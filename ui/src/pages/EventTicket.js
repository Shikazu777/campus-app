import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function EventTicket() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/event/registration/${id}`)
      .then(res => res.json())
      .then(setTicket);
  }, [id]);

  if (!ticket) return <p>Loading ticket...</p>;

  return (
    <div style={{ padding: 30 }}>
      <h2>🎫 Event Ticket</h2>

      <p>Status: <b>{ticket.status}</b></p>

      {ticket.status === "CONFIRMED" && (
        <div style={{ marginTop: 20 }}>
          <p>Show this QR at entry</p>
          <div style={qrBox}>QR CODE</div>
        </div>
      )}
    </div>
  );
}

const qrBox = {
  width: 200,
  height: 200,
  background: "#eee",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 12
};
