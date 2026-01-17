import { useState } from "react";

/* -------- FAKE EVENT DATA -------- */
const EVENTS = [
  {
    id: 1,
    title: "Tech Symposium 2026",
    description: "Talks, workshops, and networking.",
    fee: 150,
    date: "2026-02-10"
  },
  {
    id: 2,
    title: "Cultural Fest",
    description: "Music, dance, and fun events.",
    fee: 0,
    date: "2026-02-15"
  },
  {
    id: 3,
    title: "AI & Data Analytics Seminar",
    description: "Industry experts on AI trends.",
    fee: 100,
    date: "2026-02-20"
  }
];

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [bookedEvent, setBookedEvent] = useState(null);

  // TEMP: simulate logged-in user
  const userType = "student"; // student / faculty

  return (
    <div>
      <h1>🎟 Events</h1>

      {/* EVENT LIST */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {EVENTS.map(ev => (
          <div key={ev.id} style={cardStyle}>
            <h3>{ev.title}</h3>
            <p>{ev.date}</p>
            <p>{ev.fee === 0 ? "Free Event" : `₹ ${ev.fee}`}</p>
            <button
              style={btnStyle}
              onClick={() => setSelectedEvent(ev)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* EVENT DETAILS */}
      {selectedEvent && (
        <div style={detailsBox}>
          <h2>{selectedEvent.title}</h2>
          <p>{selectedEvent.description}</p>
          <p>Date: {selectedEvent.date}</p>
          <p>
            Fee:{" "}
            <b>
              {selectedEvent.fee === 0
                ? "Free"
                : `₹ ${selectedEvent.fee}`}
            </b>
          </p>

          {userType === "student" ? (
            <button
              style={btnStyle}
              onClick={() => {
                setBookedEvent(selectedEvent);
                setSelectedEvent(null);
              }}
            >
              Book Ticket
            </button>
          ) : (
            <p style={{ color: "red" }}>
              Faculty cannot book tickets
            </p>
          )}

          <button
            onClick={() => setSelectedEvent(null)}
            style={{ ...btnStyle, background: "#777", marginLeft: "10px" }}
          >
            Close
          </button>
        </div>
      )}

      {/* ACTIVE TICKET QR */}
      {bookedEvent && (
        <EventQR event={bookedEvent} />
      )}

      {/* EVENT HISTORY */}
      <div style={{ marginTop: "50px" }}>
        <h2>📜 Event Booking History</h2>
        <p>Tech Symposium — ₹150 — Attended</p>
        <p>Cultural Fest — Free — Attended</p>
      </div>
    </div>
  );
}

/* -------- QR COMPONENT -------- */

function EventQR({ event }) {
  const [visible, setVisible] = useState(true);

  if (!visible) return <p>✅ Entry marked</p>;

  return (
    <div style={qrBox}>
      <p><b>{event.title}</b></p>
      <p>Show this QR at entry</p>
      <div style={qrFake}>QR CODE</div>

      <button
        style={{ ...btnStyle, marginTop: "10px" }}
        onClick={() => setVisible(false)}
      >
        Simulate Scan
      </button>
    </div>
  );
}

/* -------- STYLES -------- */

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

const detailsBox = {
  marginTop: "30px",
  padding: "20px",
  background: "white",
  borderRadius: "12px",
  maxWidth: "400px"
};

const qrBox = {
  marginTop: "30px",
  padding: "20px",
  background: "#fff",
  borderRadius: "12px",
  width: "260px"
};

const qrFake = {
  height: "120px",
  background: "#ddd",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold"
};
