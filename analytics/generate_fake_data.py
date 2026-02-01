import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from database import SessionLocal
from models import Student, Transaction, CanteenOrder, EventRegistration
from datetime import datetime, timedelta
import random
from sqlalchemy.exc import IntegrityError

db = SessionLocal()

def seed_students(n=10):
    students = []

    for i in range(n):
        email = f"student{i}@college.edu"

        existing = db.query(Student).filter(Student.email == email).first()
        if existing:
            students.append(existing)
            continue

        s = Student(
            email=email,
            trust_score=random.randint(40, 90),
            trust_tier="Good"
        )
        db.add(s)
        students.append(s)

    db.commit()
    return students


def seed_transactions(students):
    for s in students:
        for _ in range(random.randint(5, 20)):
            tx = Transaction(
                student_id=s.id,
                amount=random.randint(50, 300),
                category=random.choice(["canteen", "event"]),
                status="SUCCESS"
            )
            db.add(tx)
    db.commit()


def seed_orders(students):
    for s in students:
        for _ in range(random.randint(3, 10)):
            order = CanteenOrder(
                student_id=s.id,
                total_amount=random.randint(100, 400),
                status=random.choice(["COLLECTED", "READY", "PREPARING"])
            )
            db.add(order)
    db.commit()


def seed_events(students):
    for s in students:
        reg = EventRegistration(
            student_id=s.id,
            event_id=1,
            status=random.choice(["attended", "no_show"])
        )
        db.add(reg)
    db.commit()


if __name__ == "__main__":
    students = seed_students(15)
    seed_transactions(students)
    seed_orders(students)
    seed_events(students)
    db.close()
    print("✅ Fake data seeded")