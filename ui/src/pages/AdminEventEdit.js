import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function AdminEventEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/events/${id}`)
      .then(res => res.json())
      .then(setForm);
  }, [id]);

  if (!form) return <p>Loading...</p>;

  const save = async () => {
    const res = await fetch(
      `http://localhost:8000/admin/events/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          department: form.department,
          eligibility: form.eligibility,
          event_time: form.event_time,
          registration_deadline: form.registration_deadline
        })
      }
    );

    const data = await res.json();
    setMsg(data.message || "Error updating");
  };

  return (
    <div style={{ padding: 30, maxWidth: 500 }}>
      <h2>✏️ Edit Event</h2>

      {["name", "description", "department", "eligibility"].map(f => (
        <input
          key={f}
          value={form[f]}
          onChange={e =>
            setForm({ ...form, [f]: e.target.value })
          }
          style={input}
        />
      ))}

      <label>Event Time</label>
      <input
        type="datetime-local"
        value={form.event_time.slice(0,16)}
        onChange={e =>
          setForm({ ...form, event_time: e.target.value })
        }
        style={input}
      />

      <label>Registration Deadline</label>
      <input
        type="datetime-local"
        value={form.registration_deadline.slice(0,16)}
        onChange={e =>
          setForm({ ...form, registration_deadline: e.target.value })
        }
        style={input}
      />

      <button onClick={save}>Save Changes</button>
      <button onClick={() => navigate(-1)}>Back</button>

      {msg && <p>{msg}</p>}
    </div>
  );
}

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 12
};
