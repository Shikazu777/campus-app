import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminEventList() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/admin/events")
      .then(res => res.json())
      .then(setEvents);
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h2>📋 Manage Events</h2>

      {events.map(e => (
        <div key={e.id} style={card}>
          <div>
            <b>{e.name}</b>
            <p>{new Date(e.event_time).toLocaleString()}</p>
          </div>

          <button onClick={() => navigate(`/admin/events/edit/${e.id}`)}>
            ✏️ Edit
          </button>
        </div>
      ))}
    </div>
  );
}

const card = {
  background: "white",
  padding: 16,
  borderRadius: 10,
  marginBottom: 12,
  display: "flex",
  justifyContent: "space-between"
};
