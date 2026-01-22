export default function Bookings() {
  return (
    <div>
      <h1>📦 My Bookings</h1>

      {/* CANTEEN BOOKINGS */}
      <section style={sectionStyle}>
        <h2>🍔 Canteen Orders</h2>

        
      
      </section>

      {/* EVENT BOOKINGS */}
      <section style={sectionStyle}>
        <h2>🎟 Event Bookings</h2>

        
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
