import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/event-details.css";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  const bookTicket = async () => {
  const res = await fetch(
    `http://localhost:8000/event/register?student_id=1&event_id=${event.id}`,
    { method: "POST" }
  );

  const data = await res.json();

  if (data.registration_id) {
    // simulate confirmation
    setTimeout(async () => {
      await fetch(
        `http://localhost:8000/event/confirm?registration_id=${data.registration_id}`,
        { method: "POST" }
      );

      navigate(`/events/ticket/${data.registration_id}`);
    }, 3000);
  }
};


  useEffect(() => {
    fetch(`http://localhost:8000/events/${id}`)
      .then(res => res.json())
      .then(setEvent);
  }, [id]);

  if (!event) return <div className="loading">Loading event…</div>;

  return (
    <div className="event-page">

      {/* HERO */}
      <div className="event-hero">
        <img src={event.image_url} alt={event.name} />
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>
      </div>

      {/* CONTENT */}
      <div className="event-content">

        {/* TITLE */}
        <h1 className="event-title">{event.name}</h1>

        <div className="event-meta">
          <div>
            <strong>Date</strong>
            <p>{new Date(event.event_time).toLocaleString()}</p>
          </div>
          <div>
            <strong>Venue</strong>
            <p>{event.department}</p>
          </div>
        </div>

        {/* GATES */}
        <div className="info-card">
          <strong>Gates open at</strong>
          <p>8:30 AM</p>
        </div>

        {/* ABOUT */}
        <section className="section">
          <h3>About the event</h3>
          <p>
            {aboutExpanded
              ? event.description
              : event.description.slice(0, 140) + "..."}
          </p>
          <button
            className="link-btn"
            onClick={() => setAboutExpanded(!aboutExpanded)}
          >
            {aboutExpanded ? "Read less" : "Read more"}
          </button>
        </section>

        {/* THINGS TO KNOW */}
        <section className="section">
          <h3>Things to know</h3>
          <ul className="icon-list">
            <li>Event in Tamil & English</li>
            <li>Ticket required for ages 5+</li>
            <li>Entry allowed for all ages</li>
            <li>Kid friendly</li>
          </ul>
        </section>

        {/* INSTRUCTIONS */}
        <section className="section">
          <div
            className="accordion-header"
            onClick={() => setInstructionsOpen(!instructionsOpen)}
          >
            <h3>Instructions</h3>
            <span>{instructionsOpen ? "▲" : "▼"}</span>
          </div>

          {instructionsOpen && (
            <ul className="instruction-list">
              <li>Entry allowed only with a valid QR code</li>
              <li>Tickets valid only on event dates</li>
              <li>ID verification mandatory</li>
              <li>No re-entry allowed</li>
              <li>No alcohol or prohibited items</li>
            </ul>
          )}
        </section>

        {/* GALLERY */}
        <section className="section">
          <h3>Gallery</h3>
          <div className="gallery-row">
            {(event.gallery_images || []).map((img, i) => (
              <img key={i} src={img} alt="gallery" />
            ))}
          </div>
        </section>

        {/* ORGANISER */}
        <section className="section organiser-card">
          <div className="avatar" />
          <div>
            <strong>{event.organiser_name || "Campus Committee"}</strong>
            <p>Hosted events • 1 month</p>
          </div>
        </section>

      </div>

      {/* BOOK BAR */}
      <div className="book-bar">
        
        <div className="price">₹ {event.price || 50}</div>
        <button
             className="book-btn"
               disabled={!event.registration_open}
              onClick={bookTicket}
        >

          {event.registration_open ? "Book tickets" : "Registration closed"}
        </button>
      </div>

    </div>
  );
}
