import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

import random
from datetime import datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from models import Student, Transaction, CanteenOrder

# DB connection
engine = create_engine(
    "postgresql://postgres:admin123@localhost:5432/campusdb"
)
Session = sessionmaker(bind=engine)
db = Session()

# CLEAN OLD DATA (SAFE FOR MODEL)
db.query(Transaction).delete()
db.query(CanteenOrder).delete()
db.query(Student).delete()
db.commit()

STUDENT_COUNT = 200

# CREATE STUDENTS
students = []
for i in range(STUDENT_COUNT):
    score = random.randint(20, 95)
    tier = "Weak" if score < 40 else "Normal" if score < 70 else "Good"

    s = Student(
        email=f"student{i}@college.edu",
        trust_score=score,
        trust_tier=tier
    )
    students.append(s)
    db.add(s)

db.commit()

# CREATE TRANSACTIONS
for s in students:
    for _ in range(random.randint(5, 15)):
        status = random.choices(
            ["success", "failed"],
            weights=[0.85, 0.15]
        )[0]

        tx = Transaction(
            student_id=s.id,
            amount=random.randint(30, 250),
            category="canteen",
            status=status,
            timestamp=datetime.utcnow() - timedelta(days=random.randint(0, 30))
        )
        db.add(tx)

db.commit()

# CREATE CANTEEN ORDERS
for s in students:
    for _ in range(random.randint(1, 6)):
        status = random.choice(["created", "ready", "collected"])

        order = CanteenOrder(
            student_id=s.id,
            item=random.choice(["Meal", "Snack", "Juice"]),
            total_amount=random.randint(50, 200),
            advance_paid=random.choice([0, 25, 50]),
            status=status,
            created_at=datetime.utcnow() - timedelta(hours=random.randint(1, 96))
        )
        db.add(order)

db.commit()

print("✅ Fake data generated for 200 students")
