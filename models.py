from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base
from datetime import datetime

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
    category = Column(String)  # canteen / event
    status = Column(String)    # success / failed
    timestamp = Column(DateTime, default=datetime.utcnow)
