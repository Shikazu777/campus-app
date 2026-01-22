import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Events() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  /* ---------------- FETCH EVENTS ---------------- */

  useEffect(() => {
    fetch("http://localhost:8000/events")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          setEvents([]);
        }
      });
  }, []);

  return (
    <div>
      <h1>🎟 Events</h1>

      {events.length === 0 && <p>No upcoming events</p>}

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {events.map(ev => (
          <div key={ev.id} style={cardStyle}>
            <h3>{ev.name}</h3>
            <p>{ev.department}</p>
            <p>
              {new Date(ev.event_time).toLocaleDateString()}
            </p>

            <button
              style={btnStyle}
              onClick={() => navigate(`/events/${ev.id}`)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const cardStyle = {
  background: "white",
  padding: "16px",
  borderRadius: "12px",
  width: "220px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
};

const btnStyle = {
  padding: "8px 12px",
  border: "none",
  borderRadius: "6px",
  background: "#111",
  color: "white",
  cursor: "pointer"
};
