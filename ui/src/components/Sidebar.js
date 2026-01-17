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

        {(role === "OWNER" || role === "CANTEEN_EDITOR") &&
          <Link to="/admin/canteen" style={linkStyle}>🛠 Canteen Admin</Link>
        }

        {(role === "OWNER" || role === "EVENT_EDITOR") &&
          <Link to="/admin/events" style={linkStyle}>🛠 Event Admin</Link>
        }
      </nav>
    </div>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "16px"
};
