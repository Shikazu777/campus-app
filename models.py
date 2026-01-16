from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime
from database import Base

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
    created_at = Column(DateTime, default=datetime.utcnow)
