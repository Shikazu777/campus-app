export default function Bookings() {
  return (
    <div>
      <h1>📦 My Bookings</h1>

      {/* CANTEEN BOOKINGS */}
      <section style={sectionStyle}>
        <h2>🍔 Canteen Orders</h2>

        <BookingItem
          title="Veg Meals"
          amount="₹80"
          status="Collected"
          date="15 Jan 2026"
        />
        <BookingItem
          title="Samosa"
          amount="₹15"
          status="Collected"
          date="14 Jan 2026"
        />
        <BookingItem
          title="Coffee"
          amount="₹15"
          status="Collected"
          date="13 Jan 2026"
        />
        <BookingItem
          title="Chicken Meals"
          amount="₹120"
          status="Cancelled"
          date="10 Jan 2026"
        />
      </section>

      {/* EVENT BOOKINGS */}
      <section style={sectionStyle}>
        <h2>🎟 Event Bookings</h2>

        <BookingItem
          title="Tech Symposium"
          amount="₹150"
          status="Attended"
          date="12 Jan 2026"
        />
        <BookingItem
          title="Cultural Fest"
          amount="Free"
          status="Attended"
          date="08 Jan 2026"
        />
      </section>
    </div>
  );
}

/* ---------------- COMPONENT ---------------- */

function BookingItem({ title, amount, status, date }) {
  return (
    <div style={itemStyle}>
      <div>
        <b>{title}</b>
        <p style={{ fontSize: "13px", color: "#666" }}>{date}</p>
      </div>

      <div style={{ textAlign: "right" }}>
        <p>{amount}</p>
        <p style={{ fontSize: "13px" }}>{status}</p>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const sectionStyle = {
  marginTop: "30px"
};

const itemStyle = {
  display: "flex",
  justifyContent: "space-between",
  background: "white",
  padding: "14px",
  borderRadius: "10px",
  marginBottom: "10px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
};
