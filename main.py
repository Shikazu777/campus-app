from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Student, Transaction
from scoring import update_trust_score

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
