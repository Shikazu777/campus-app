import pandas as pd
from sqlalchemy import create_engine
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix

# DB connection
engine = create_engine(
    "postgresql://postgres:admin123@localhost:5432/campusdb"
)

# Load data
students = pd.read_sql("SELECT * FROM students", engine)
transactions = pd.read_sql("SELECT * FROM transactions", engine)
canteen = pd.read_sql("SELECT * FROM canteen_orders", engine)

# ---------- Feature Engineering ----------

# Avg transaction amount per student
avg_amt = transactions.groupby("student_id")["amount"].mean()

# Transaction failure rate
fail_rate = (
    transactions.assign(failed=lambda x: (x["status"] == "failed").astype(int))
    .groupby("student_id")["failed"]
    .mean()
)

# Canteen order count
order_count = canteen.groupby("student_id").size()

# Order completion rate
completion = (
    canteen.assign(done=lambda x: (x["status"] == "collected").astype(int))
    .groupby("student_id")["done"]
    .mean()
)

# Merge features
df = students.set_index("id")
df["avg_amount"] = avg_amt
df["fail_rate"] = fail_rate
df["order_count"] = order_count
df["completion_rate"] = completion

# Fill missing values
df = df.fillna(0)

# Target variable
df["risky"] = (df["trust_score"] < 40).astype(int)

X = df[["avg_amount", "fail_rate", "order_count", "completion_rate"]]
y = df["risky"]

# ---------- Train/Test ----------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42
)

model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

# ---------- Evaluation ----------
y_pred = model.predict(X_test)

print("CONFUSION MATRIX")
print(confusion_matrix(y_test, y_pred))

print("\nCLASSIFICATION REPORT")
print(classification_report(y_test, y_pred))

# ---------- Feature Importance ----------
importance = pd.Series(
    model.coef_[0],
    index=X.columns
).sort_values(ascending=False)

print("\nFEATURE IMPORTANCE")
print(importance)
