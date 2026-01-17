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


class CanteenOrder(Base):
    __tablename__ = "canteen_orders"
    id = Column(Integer, primary_key=True)
    student_id = Column(Integer)
    item = Column(String)
    total_amount = Column(Float)
    advance_paid = Column(Float)
    status = Column(String)
    qr_token = Column(String, unique=True)   
    created_at = Column(DateTime, default=datetime.utcnow)

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    fee = Column(Float)
    total_tickets = Column(Integer, nullable=True)  # NULL = unlimited
    tickets_sold = Column(Integer, default=0)
    event_time = Column(DateTime)



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

