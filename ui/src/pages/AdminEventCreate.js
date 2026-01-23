import { useState } from "react";

export default function AdminEventCreate() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    department: "",
    eligibility: "",
    event_time: "",
    registration_deadline: ""
  });

  const [msg, setMsg] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const createEvent = async () => {
    setMsg(null);

    const params = new URLSearchParams({
      ...form,
      current_user_id: 1 // ADMIN (for now)
    });

    try {
      const res = await fetch(
        `http://localhost:8000/event/create?${params.toString()}`,
        { method: "POST" }
      );

      const data = await res.json();

      if (data.event_id) {
        setMsg("✅ Event created successfully");
        setForm({
          name: "",
          description: "",
          department: "",
          eligibility: "",
          event_time: "",
          registration_deadline: ""
        });
      } else {
        setMsg(data.error || "❌ Failed to create event");
      }
    } catch {
      setMsg("❌ Server error");
    }
  };

  return (
    <div style={wrap}>
      <h2>📅 Create Event</h2>

      <input
        name="name"
        placeholder="Event name"
        value={form.name}
        onChange={handleChange}
        style={input}
      />

      <textarea
        name="description"
        placeholder="Event description"
        value={form.description}
        onChange={handleChange}
        style={{ ...input, height: 80 }}
      />

      <input
        name="department"
        placeholder="Department / Venue"
        value={form.department}
        onChange={handleChange}
        style={input}
      />

      <input
        name="eligibility"
        placeholder="Eligibility"
        value={form.eligibility}
        onChange={handleChange}
        style={input}
      />

      <label>Event Time</label>
      <input
        type="datetime-local"
        name="event_time"
        value={form.event_time}
        onChange={handleChange}
        style={input}
      />

      <label>Registration Deadline</label>
      <input
        type="datetime-local"
        name="registration_deadline"
        value={form.registration_deadline}
        onChange={handleChange}
        style={input}
      />

      <button onClick={createEvent} style={btn}>
        Create Event
      </button>

      {msg && <p>{msg}</p>}
    </div>
  );
}

const wrap = {
  padding: 30,
  maxWidth: 500
};

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 12
};

const btn = {
  padding: "10px 20px",
  cursor: "pointer"
};
