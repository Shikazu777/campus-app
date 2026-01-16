import pandas as pd
from sqlalchemy import create_engine

# 1. Database connection
engine = create_engine(
    "postgresql://postgres:admin123@localhost:5432/campusdb"
)

# 2. Load tables into DataFrames
students = pd.read_sql("SELECT * FROM students", engine)
transactions = pd.read_sql("SELECT * FROM transactions", engine)
canteen_orders = pd.read_sql("SELECT * FROM canteen_orders", engine)

print("\n--- STUDENTS TRUST TIER DISTRIBUTION ---")
print(students.groupby("trust_tier").size())

print("\n--- TRANSACTION STATUS DISTRIBUTION ---")
print(transactions.groupby("status").size())

print("\n--- CANTEEN ORDER STATUS DISTRIBUTION ---")
print(canteen_orders.groupby("status").size())

print("\n--- PEAK CANTEEN ORDER HOURS ---")
canteen_orders["hour"] = pd.to_datetime(canteen_orders["created_at"]).dt.hour
print(canteen_orders.groupby("hour").size().sort_values(ascending=False))

print("\n--- AVERAGE SPENDING PER STUDENT ---")
avg_spend = transactions.groupby("student_id")["amount"].mean()
print(avg_spend)

print("\n--- HIGH RISK STUDENTS (LOW TRUST SCORE) ---")
print(students[students["trust_score"] < 40][["id", "email", "trust_score"]])
