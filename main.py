from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Student, Transaction, CanteenOrder, CanteenOrderItem, CanteenItem
from models import Event, EventRegistration
from scoring import update_trust_score
from datetime import datetime, timedelta
from qr_utils import generate_qr_token
from fastapi.middleware.cors import CORSMiddleware
from models import User
from rbac import has_role
import time
from threading import Thread
from pydantic import BaseModel
from models import CanteenItem



app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/register")
def register_student(email: str, db: Session = Depends(get_db)):
    student = Student(email=email)
    db.add(student)
    db.commit()
    return {"message": "Student registered"}

@app.get("/ui/students")
def get_students(db: Session = Depends(get_db)):
    students = db.query(Student).all()

    result = []
    for s in students:
        result.append({
            "id": s.id,
            "email": s.email,
            "trust_score": s.trust_score,
            "trust_tier": s.trust_tier,
            "risky": s.trust_score < 40
        })

    return result


@app.post("/pay")
def simulate_payment(student_id: int, amount: float, status: str, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()

    new_score, tier = update_trust_score(student.trust_score, status)
    student.trust_score = new_score
    student.trust_tier = tier

    tx = Transaction(
        student_id=student_id,
        amount=amount,
        category="canteen",
        status=status
    )

    db.add(tx)
    db.commit()

    return {
        "trust_score": new_score,
        "trust_tier": tier
    }

class CanteenOrderCreate(BaseModel):
    student_id: int
    total_amount: float


class CanteenItemCreate(BaseModel):
    name: str
    price: float
    image_url: str | None = None
    category: str
    stock: int

@app.get("/canteen/items")
def get_canteen_items(
    category: str | None = None,
    db: Session = Depends(get_db)
):
    q = db.query(CanteenItem)

    if category:
        q = q.filter(CanteenItem.category == category)

    return q.all()



@app.post("/canteen/items")
def add_canteen_item(
    payload: CanteenItemCreate,
    current_user_id: int,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == current_user_id).first()

    if user.user_type != "owner" and not has_role(user, "CANTEEN_EDITOR"):
        return {"error": "Permission denied"}

    item = CanteenItem(**payload.dict())
    db.add(item)
    db.commit()
    db.refresh(item)

    return item

class StockUpdate(BaseModel):
    stock: int

@app.patch("/canteen/items/{item_id}/stock")
def update_stock(
    item_id: int,
    payload: StockUpdate,
    current_user_id: int,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == current_user_id).first()

    if user.user_type != "owner" and not has_role(user, "CANTEEN_EDITOR"):
        return {"error": "Permission denied"}

    item = db.query(CanteenItem).filter(CanteenItem.id == item_id).first()
    if not item:
        return {"error": "Item not found"}

    item.stock = max(payload.stock, 0)
    db.commit()

    return {"message": "Stock updated", "stock": item.stock}

class AvailabilityUpdate(BaseModel):
    is_available: bool

@app.patch("/canteen/items/{item_id}/availability")
def update_availability(
    item_id: int,
    payload: AvailabilityUpdate,
    current_user_id: int,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == current_user_id).first()

    if user.user_type != "owner" and not has_role(user, "CANTEEN_EDITOR"):
        return {"error": "Permission denied"}

    item = db.query(CanteenItem).filter(CanteenItem.id == item_id).first()
    if not item:
        return {"error": "Item not found"}

    item.is_available = payload.is_available
    db.commit()

    return {"message": "Availability updated"}

class OrderItemPayload(BaseModel):
    item_id: int
    qty: int

class CanteenOrderCreate(BaseModel):
    student_id: int
    items: list[OrderItemPayload]

@app.get("/canteen/orders")
def get_all_canteen_orders(db: Session = Depends(get_db)):
    orders = (
        db.query(CanteenOrder)
        .order_by(CanteenOrder.created_at.desc())
        .all()
    )

    return [
        {
            "id": o.id,
            "student_id": o.student_id,
            "total": o.total_amount,
            "status": o.status,
            "created_at": o.created_at
        }
        for o in orders
    ]


@app.post("/canteen/order")
def create_canteen_order(
    payload: CanteenOrderCreate,
    db: Session = Depends(get_db)
):
    total = 0
    items_cache = []

    # 1. Validate & deduct stock
    for i in payload.items:
        item = db.query(CanteenItem).filter(CanteenItem.id == i.item_id).first()

        if not item or not item.is_available:
            raise HTTPException(status_code=400, detail="Item unavailable")

        if item.stock < i.qty:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {item.name}"
            )

        item.stock -= i.qty
        total += item.price * i.qty
        items_cache.append((item, i.qty))

    # 2. Create order
    order = CanteenOrder(
        student_id=payload.student_id,
        total_amount=total,
        status="PENDING"
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    # 3. Create order items
    for item, qty in items_cache:
        db.add(CanteenOrderItem(
            order_id=order.id,
            item_id=item.id,
            quantity=qty,
            price_at_order=item.price
        ))

    db.commit()

    return {
        "order_id": order.id,
        "total": total,
        "status": order.status
    }



@app.get("/canteen/order/{order_id}")
def get_canteen_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(CanteenOrder).filter(
        CanteenOrder.id == order_id
    ).first()

    if not order:
        return {"error": "Order not found"}

    return {
        "id": order.id,
        "total": order.total_amount,
        "status": order.status,
        "qr_token": order.qr_token
    }


@app.get("/canteen/order/{order_id}/items")
def get_order_items(order_id: int, db: Session = Depends(get_db)):
    items = (
        db.query(
            CanteenOrderItem.quantity,
            CanteenOrderItem.price_at_order,
            CanteenItem.name
        )
        .join(CanteenItem, CanteenItem.id == CanteenOrderItem.item_id)
        .filter(CanteenOrderItem.order_id == order_id)
        .all()
    )

    return [
        {
            "name": name,
            "quantity": qty,
            "price": price
        }
        for qty, price, name in items
    ]


@app.get("/canteen/orders/student/{student_id}")
def get_student_orders(student_id: int, db: Session = Depends(get_db)):
    orders = (
        db.query(CanteenOrder)
        .filter(CanteenOrder.student_id == student_id)
        .order_by(CanteenOrder.created_at.desc())
        .all()
    )

    return [
        {
            "id": o.id,
            "total": o.total_amount,
            "status": o.status,
            "created_at": o.created_at,
        }
        for o in orders
    ]


@app.post("/canteen/mark-ready")
def mark_ready(order_id: int, current_user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == current_user_id).first()

    if user.user_type != "owner" and not has_role(user, "CANTEEN_EDITOR"):
        return {"error": "Permission denied"}

    order = db.query(CanteenOrder).filter(CanteenOrder.id == order_id).first()
    if not order:
        return {"error": "Order not found"}

    order.status = "READY"
    order.qr_token = generate_qr_token("CANTEEN")

    db.commit()

    return {"message": "Order marked ready"}

@app.post("/canteen/scan")
def scan_canteen_qr(qr_token: str, db: Session = Depends(get_db)):
    order = db.query(CanteenOrder).filter(
        CanteenOrder.qr_token == qr_token
    ).first()

    if not order or order.status != "READY":
        return {"error": "Invalid or not ready"}

    order.status = "COLLECTED"

    db.commit()
    return {"message": "Order collected"}




@app.post("/payment/create")
def create_payment(order_id: int, db: Session = Depends(get_db)):
    order = db.query(CanteenOrder).filter(
        CanteenOrder.id == order_id
    ).first()

    if not order:
        return {"error": "Order not found"}

    if order.status != "PENDING":
        return {"error": "Payment already processed"}

    # MOCK payment redirect URL
    payment_url = f"http://localhost:3000/payment/mock/{order.id}"

    return {
        "order_id": order.id,
        "payment_url": payment_url

    }

@app.post("/payment/success")
def payment_success(order_id: int, db: Session = Depends(get_db)):
    order = db.query(CanteenOrder).filter(
        CanteenOrder.id == order_id
    ).first()

    if not order:
        return {"error": "Order not found"}

    order.status = "PREPARING"
    order.qr_token = generate_qr_token("CANTEEN")
    db.commit()

    return {
        "message": "Payment confirmed",
        "order_id": order.id
    }


@app.post("/canteen/order/{order_id}/ready")
def mark_order_ready(order_id: int, db: Session = Depends(get_db)):
    order = db.query(CanteenOrder).filter(
        CanteenOrder.id == order_id
    ).first()

    if not order:
        return {"error": "Order not found"}

    order.status = "READY"
    order.qr_token = generate_qr_token("CANTEEN")
    db.commit()

    return {
        "message": "Order ready",
        "qr_token": order.qr_token
    }




@app.post("/event/create")
def create_event(
    name: str,
    description: str,
    department: str,
    eligibility: str,
    event_time: datetime,
    registration_deadline: datetime,
    current_user_id: int,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == current_user_id).first()

    if user.user_type != "owner" and not has_role(user, "EVENT_EDITOR"):
        return {"error": "Permission denied"}

    event = Event(
        name=name,
        description=description,
        department=department,
        eligibility=eligibility,
        event_time=event_time,
        registration_deadline=registration_deadline
    )

    db.add(event)
    db.commit()
    db.refresh(event)

    return {
        "event_id": event.id,
        "message": "Event created"
    }

@app.get("/events")
def list_events(db: Session = Depends(get_db)):
    now = datetime.utcnow()

    events = db.query(Event).filter(
        Event.is_active == True,
        Event.event_time >= now
    ).all()

    return events

@app.get("/events/{event_id}")
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()

    if not event:
        return {"error": "Event not found"}

    now = datetime.utcnow()

    registration_open = now <= event.registration_deadline
    is_closed = now > event.event_time + timedelta(days=2)

    return {
        "id": event.id,
        "name": event.name,
        "description": event.description,
        "department": event.department,
        "eligibility": event.eligibility,
        "event_time": event.event_time,
        "registration_deadline": event.registration_deadline,
        "registration_open": registration_open,
        "closed": is_closed
    }



@app.post("/event/register")
def register_event(student_id: int, event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()

    if not event:
        return {"error": "Event not found"}

    if datetime.utcnow() > event.registration_deadline:
        return {"error": "Registration closed"}

    reg = EventRegistration(
        student_id=student_id,
        event_id=event_id,
        status="PENDING",
        qr_token=None
    )

    db.add(reg)
    db.commit()
    db.refresh(reg)

    return {
        "registration_id": reg.id,
        "status": reg.status
    }

@app.post("/event/confirm")
def confirm_event_registration(registration_id: int, db: Session = Depends(get_db)):
    reg = db.query(EventRegistration).filter(
        EventRegistration.id == registration_id
    ).first()

    if not reg:
        return {"error": "Registration not found"}

    reg.status = "CONFIRMED"
    reg.qr_token = generate_qr_token("EVENT")

    db.commit()

    return {
        "message": "Registration confirmed",
        "qr_token": reg.qr_token
    }

@app.get("/event/registration/{registration_id}")
def get_event_registration(registration_id: int, db: Session = Depends(get_db)):
    reg = db.query(EventRegistration).filter(
        EventRegistration.id == registration_id
    ).first()

    if not reg:
        return {"error": "Not found"}

    return {
        "id": reg.id,
        "status": reg.status,
        "qr_token": reg.qr_token
    }


@app.post("/event/scan")
def scan_event_qr(qr_token: str, db: Session = Depends(get_db)):
    reg = db.query(EventRegistration).filter(
        EventRegistration.qr_token == qr_token
    ).first()

    if not reg:
        return {"error": "Invalid QR"}

    if reg.status != "CONFIRMED":
        return {"error": f"Ticket already {reg.status}"}

    reg.status = "ATTENDED"
    db.commit()

    return {
        "message": "Entry allowed",
        "student_id": reg.student_id,
        "event_id": reg.event_id
    }

@app.post("/event/attend")
def attend_event(registration_id: int, db: Session = Depends(get_db)):
    reg = db.query(EventRegistration).filter(
        EventRegistration.id == registration_id
    ).first()

    if not reg:
        return {"error": "Registration not found"}

    reg.status = "attended"
    db.commit()
    return {"message": "Attendance marked"}

@app.post("/event/no-show")
def no_show(registration_id: int, db: Session = Depends(get_db)):
    reg = db.query(EventRegistration).filter(
        EventRegistration.id == registration_id
    ).first()

    if not reg:
        return {"error": "Registration not found"}

    student = db.query(Student).filter(Student.id == reg.student_id).first()

    # penalty
    student.trust_score -= 10
    if student.trust_score < 40:
        student.trust_tier = "Weak"

    reg.status = "no_show"
    db.commit()

    return {
        "message": "No-show recorded",
        "new_trust_score": student.trust_score,
        "trust_tier": student.trust_tier
    }



@app.post("/event/cancel")
def cancel_event(registration_id: int, db: Session = Depends(get_db)):
    reg = db.query(EventRegistration).filter(EventRegistration.id == registration_id).first()
    event = db.query(Event).filter(Event.id == reg.event_id).first()

    hours_left = (event.event_time - datetime.utcnow()).total_seconds() / 3600

    if hours_left < 24:
        refund_percent = 0.5
    elif hours_left <= 72:
        refund_percent = 0.75
    else:
        refund_percent = 0.9

    refund_amount = event.fee * refund_percent
    reg.status = "cancelled"
    db.commit()

    return {
        "message": "Event cancelled",
        "refund_amount": refund_amount,
        "refund_percent": refund_percent * 100
    }


# ---- utilities ----

def auto_close_events():
    db = SessionLocal()
    try:
        cutoff = datetime.utcnow() - timedelta(days=2)
        events = db.query(Event).filter(
            Event.event_time < cutoff,
            Event.is_active == True
        ).all()

        for e in events:
            e.is_active = False

        db.commit()
    finally:
        db.close()



   


@app.on_event("startup")
def startup_tasks():
    auto_close_events()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
