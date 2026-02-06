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
