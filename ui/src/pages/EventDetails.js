import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8000/events/${id}`)
      .then(res => res.json())
      .then(setEvent);
  }, [id]);

  if (!event) return <p>Loading...</p>;

  return (
    <div className="event-page">

      {/* HERO */}
      <div className="event-hero">
        <img src={event.image_url} alt={event.name} />
      </div>

      {/* CONTENT */}
      <div className="event-content">

        <h1>{event.name}</h1>

        <p>{new Date(event.event_time).toLocaleString()}</p>
        <p>{event.department}</p>

        {/* ABOUT */}
        <section>
          <h3>About the event</h3>
          <p>
            {expanded
              ? event.description
              : event.description.slice(0, 120) + "..."}
          </p>
          <button onClick={() => setExpanded(!expanded)}>
            {expanded ? "Read less" : "Read more"}
          </button>
        </section>

        {/* INSTRUCTIONS */}
        <section>
          <h3>Instructions</h3>
          <ul>
            <li>Entry allowed only with valid QR code</li>
            <li>Tickets valid only on event dates</li>
            <li>ID verification mandatory</li>
            <li>No re-entry</li>
          </ul>
        </section>

        {/* GALLERY */}
        <section className="gallery">
          {event.gallery_images?.map((img, i) => (
            <img key={i} src={img} alt="" />
          ))}
        </section>

      </div>

      {/* BOOK BAR */}
      <div className="book-bar">
        <span>₹ {event.price || 50}</span>
        <button disabled={!event.registration_open}>
          {event.registration_open ? "Book tickets" : "Registration closed"}
        </button>
      </div>

    </div>
  );
}
