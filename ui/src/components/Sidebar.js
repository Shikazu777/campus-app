import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ role }) {
  const { logout } = useAuth();

  return (
    <div
      style={{
        width: "220px",
        background: "#111",
        color: "#fff",
        height: "100vh",
        padding: "20px",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* TOP */}
      <div>
        <h2 style={{ marginBottom: "20px" }}>Campus App</h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link to="/canteen" style={linkStyle}>🍔 Canteen</Link>
          <Link to="/events" style={linkStyle}>🎟 Events</Link>
          <Link to="/bookings" style={linkStyle}>📦 My Bookings</Link>
          <Link to="/analytics" style={linkStyle}>📊 Analytics</Link>

          {(role === "OWNER" || role === "CANTEEN_EDITOR") && (
            <Link to="/admin/canteen" style={linkStyle}>
              🛠 Canteen Admin
            </Link>
          )}

          {(role === "OWNER" || role === "EVENT_EDITOR") && (
            <>
              <Link to="/admin/event/create" style={linkStyle}>
                ➕ Create Event
              </Link>
              <Link to="/admin/event/list" style={linkStyle}>
                📋 Manage Events
              </Link>
              <Link to="/admin/event/scanner" style={linkStyle}>
                🎫 Scan Tickets
              </Link>
            </>
          )}

          {role === "OWNER" && (
            <Link to="/admin/role-assign" style={linkStyle}>
              👑 Assign Roles
            </Link>
          )}
        </nav>
      </div>

      {/* BOTTOM */}
      <div style={{ marginTop: "auto" }}>
        <div style={badgeStyle}>
          {role === "OWNER" ? "ADMIN" : role.replace("_", " ")}
        </div>

        <button onClick={logout} style={logoutBtn}>
          Logout
        </button>
      </div>
    </div>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "16px"
};

const badgeStyle = {
  display: "inline-block",
  padding: "6px 12px",
  borderRadius: "14px",
  fontSize: "12px",
  background: "#2563eb",
  color: "#fff",
  marginBottom: "10px"
};

const logoutBtn = {
  width: "100%",
  padding: "8px",
  borderRadius: "8px",
  border: "none",
  background: "#ef4444",
  color: "white",
  cursor: "pointer",
  fontSize: "14px"
};
