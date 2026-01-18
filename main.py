from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Student, Transaction, CanteenOrder
from models import Event, EventRegistration
from scoring import update_trust_score
from datetime import datetime
from qr_utils import generate_qr_token
from fastapi.middleware.cors import CORSMiddleware
from models import User
from rbac import has_role


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

@app.post("/canteen/order")
def create_canteen_order(
    student_id: int,
    total_amount: float,
    db: Session = Depends(get_db)
):
    order = CanteenOrder(
        student_id=student_id,
        total_amount=total_amount,
        status="PENDING"
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    return {
        "order_id": order.id,
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


# @app.post("/canteen/preorder")
# def canteen_preorder(
#     student_id: int,
#     item: str,
#     amount: float,
#     db: Session = Depends(get_db)
# ):
#     student = db.query(Student).filter(Student.id == student_id).first()

#     if student.trust_tier == "Weak":
#         return {"error": "Pre-order not allowed for your trust tier"}

#     if student.trust_tier == "Normal":
#         advance = amount * 0.5
#     else:  # Good
#         advance = 0.0

#     order = CanteenOrder(
#     student_id=student_id,
#     item=item,
#     total_amount=amount,
#     advance_paid=advance,
#     status="created",
#     qr_token=generate_qr_token("CANTEEN")
#    )

#     db.add(order)
#     db.commit()

#     return {
#         "message": "Pre-order created",
#         "order_id": order.id,
#         "qr_token": order.qr_token,
#         "advance_to_pay": advance,
#         "status": order.status
#     }

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



# @app.post("/canteen/collect")
# def collect_order(order_id: int, db: Session = Depends(get_db)):
#     order = db.query(CanteenOrder).filter(CanteenOrder.id == order_id).first()

#     if not order:
#          return {"error": "Order not found"}

#     if order.status != "ready":
#          return {"error": "Order not ready yet"}

#     order.status = "collected"
#     db.commit()

#     return {"message": "Order collected successfully"}


@app.post("/event/create")
def create_event(
    current_user_id: int,
    name: str,
    fee: float,
    event_time: datetime,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == current_user_id).first()

    if user.user_type != "owner" and not has_role(user, "EVENT_EDITOR"):
        return {"error": "Permission denied"}

    event = Event(
        name=name,
        fee=fee,
        event_time=event_time
    )

    db.add(event)
    db.commit()

    return {"message": "Event created", "event_id": event.id}

    

@app.post("/event/register")
def register_event(student_id: int, event_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == student_id).first()

    if user.user_type != "student":
        return {"error": "Only students can buy tickets"}

    reg = EventRegistration(
        student_id=student_id,
        event_id=event_id,
        status="registered",
        qr_token=generate_qr_token("EVENT")
    )

    db.add(reg)
    db.commit()

    return {
        "message": "Registered for event",
        "registration_id": reg.id,
        "qr_token": reg.qr_token
    }


@app.post("/event/scan")
def scan_event_qr(qr_token: str, db: Session = Depends(get_db)):
    reg = db.query(EventRegistration).filter(
        EventRegistration.qr_token == qr_token
    ).first()

    if not reg or reg.status != "registered":
        return {"error": "Invalid ticket"}

    reg.status = "attended"
    db.commit()
    return {"message": "Entry allowed"}


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

@app.post("/event/transfer")
def transfer_ticket(registration_id: int, to_student_id: int, db: Session = Depends(get_db)):
    reg = db.query(EventRegistration).filter(EventRegistration.id == registration_id).first()

    if not reg or reg.status != "registered":
        return {"error": "Transfer not allowed"}

    reg.transferred_to = to_student_id
    db.commit()

    return {"message": "Ticket transferred"}

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


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
