import pandas as pd
import streamlit as st
from sqlalchemy import create_engine

st.set_page_config(page_title="Campus Analytics Dashboard", layout="wide")

engine = create_engine(
    "postgresql://postgres:admin123@localhost:5432/campusdb"
)

# Load data
students = pd.read_sql("SELECT * FROM students", engine)
transactions = pd.read_sql("SELECT * FROM transactions", engine)
canteen = pd.read_sql("SELECT * FROM canteen_orders", engine)

st.title("📊 Campus Smart Payment Analytics")

# --- TRUST TIER ---
st.header("Student Trust Tier Distribution")
trust_counts = students["trust_tier"].value_counts()
st.bar_chart(trust_counts)

# --- TRANSACTION STATUS ---
st.header("Transaction Status Distribution")
tx_status = transactions["status"].value_counts()
st.bar_chart(tx_status)

# --- CANTEEN ORDER STATUS ---
st.header("Canteen Order Status")
canteen_status = canteen["status"].value_counts()
st.bar_chart(canteen_status)

# --- PEAK HOURS ---
st.header("Peak Canteen Order Hours")
canteen["hour"] = pd.to_datetime(canteen["created_at"]).dt.hour
hourly = canteen.groupby("hour").size()
st.line_chart(hourly)

# --- HIGH RISK STUDENTS ---
st.header("High Risk Students (Low Trust Score)")
risk_students = students[students["trust_score"] < 40][
    ["id", "email", "trust_score"]
]
st.dataframe(risk_students)
