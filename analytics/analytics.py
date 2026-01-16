import pandas as pd
from sqlalchemy import create_engine

engine = create_engine(
    "postgresql://postgres:admin123@localhost:5432/campusdb"
)

canteen = pd.read_sql("SELECT * FROM canteen_orders", engine)
events = pd.read_sql("SELECT * FROM event_registrations", engine)
students = pd.read_sql("SELECT * FROM students", engine)

print(canteen.groupby("status").size())
print(events.groupby("status").size())
print(students.groupby("trust_tier").size())
