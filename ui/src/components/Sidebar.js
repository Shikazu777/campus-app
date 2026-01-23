import { Link } from "react-router-dom";

export default function Sidebar({ role }) {
  return (
    <div style={{
      width: "220px",
      background: "#111",
      color: "#fff",
      height: "100vh",
      padding: "20px"
    }}>
      <h2>Campus App</h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
  <Link to="/canteen" style={linkStyle}>🍔 Canteen</Link>
  <Link to="/events" style={linkStyle}>🎟 Events</Link>
  <Link to="/bookings" style={linkStyle}>📦 My Bookings</Link>

  {(role === "OWNER" || role === "CANTEEN_EDITOR") && (
    <>
      <div style={section}>Canteen Admin</div>
      <Link to="/admin/canteen" style={linkStyle}>🛠 Manage Orders</Link>
    </>
  )}

  {(role === "OWNER" || role === "EVENT_EDITOR") && (
    <>
      <div style={section}>Event Admin</div>
      <Link to="/admin/events/create" style={linkStyle}>➕ Create Event</Link>
      <Link to="/admin/events/scan" style={linkStyle}>🎫 Scan Tickets</Link>
    </>
  )}
</nav>

    </div>
  );
}

const section = {
  marginTop: "14px",
  fontSize: "13px",
  color: "#9ca3af",
  textTransform: "uppercase"
};


const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "16px"
};
