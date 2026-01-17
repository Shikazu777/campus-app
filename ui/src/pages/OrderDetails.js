import { useParams } from "react-router-dom";
import { useState } from "react";

export default function OrderDetails() {
  const { id } = useParams();

  // TEMP order data
  const [status, setStatus] = useState("Preparing");

  return (
    <div>
      <h1>📦 Order #{id}</h1>

      <p>Status: <b>{status}</b></p>
      <p>Your order will be ready in 10–30 minutes.</p>

      {status === "Ready" && (
        <div style={qrBox}>
          <p>Show QR at canteen</p>
          <div style={qr}>QR CODE</div>
          <button onClick={() => setStatus("Collected")}>
            Simulate Scan
          </button>
        </div>
      )}

      {status === "Preparing" && (
        <button onClick={() => setStatus("Ready")}>
          Simulate Ready
        </button>
      )}

      {status === "Collected" && (
        <p>🍽 Order Collected</p>
      )}
    </div>
  );
}

const qrBox = {
  marginTop: 20,
  padding: 20,
  background: "#fff",
  width: 200
};

const qr = {
  height: 100,
  background: "#ddd",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};
