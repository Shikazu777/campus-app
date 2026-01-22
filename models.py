from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime
from database import Base
from sqlalchemy import Boolean, ForeignKey
from sqlalchemy.orm import relationship


class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True)
    trust_score = Column(Float, default=50.0)
    trust_tier = Column(String, default="Normal")


class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True)
    student_id = Column(Integer)
    amount = Column(Float)
    category = Column(String)
    status = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)


class CanteenItem(Base):
    __tablename__ = "canteen_items"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    image_url = Column(String)
    category = Column(String, nullable=False)
    stock = Column(Integer, default=0)
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class CanteenOrderItem(Base):
    __tablename__ = "canteen_order_items"

    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("canteen_orders.id", ondelete="CASCADE"))
    item_id = Column(Integer, ForeignKey("canteen_items.id"))
    quantity = Column(Integer, nullable=False)
    price_at_order = Column(Float, nullable=False)


class CanteenOrder(Base):
    __tablename__ = "canteen_orders"
    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, nullable=False)
    item = Column(String)
    total_amount = Column(Float, nullable=False)
    advance_paid = Column(Float)
    status = Column(String, default="PENDING")
    qr_token = Column(String, unique=True, nullable=True)   
    created_at = Column(DateTime, default=datetime.utcnow)

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(String)
    department = Column(String)
    eligibility = Column(String)
    event_time = Column(DateTime)
    registration_deadline = Column(DateTime)
    is_active = Column(Boolean, default=True)  # ✅ ADD THIS
    created_at = Column(DateTime, default=datetime.utcnow)



class EventRegistration(Base):
    __tablename__ = "event_registrations"
    id = Column(Integer, primary_key=True)
    student_id = Column(Integer)
    event_id = Column(Integer)
    status = Column(String)
    qr_token = Column(String, unique=True)
    transferred_to = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True)
    register_number = Column(String, nullable=True)
    user_type = Column(String)  # student / faculty / owner
    trust_score = Column(Float, default=50.0)
    trust_tier = Column(String, default="Normal")

    roles = relationship("UserRole", back_populates="user")

class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)  # OWNER, EVENT_EDITOR, CANTEEN_EDITOR


class UserRole(Base):
    __tablename__ = "user_roles"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    role_id = Column(Integer, ForeignKey("roles.id"))

    user = relationship("User", back_populates="roles")

