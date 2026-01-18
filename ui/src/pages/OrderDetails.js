import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
  const fetchOrder = () => {
    fetch(`http://localhost:8000/canteen/order/${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setOrder(data);
        }
      });
  };

  fetchOrder(); // initial load
  const interval = setInterval(fetchOrder, 5000); // poll every 5s

  return () => clearInterval(interval);
}, [id]);


  if (!order) {
    return <p>❌ Order not found</p>;
  }

  return (
    <div>
      <h1>📦 Order #{order.id}</h1>

      <p>Status: <b>{order.status}</b></p>
      <p>Total: ₹{order.total}</p>

      {order.status === "PENDING" && (
        <p>Waiting for payment confirmation.</p>
      )}

      {order.status === "PREPARING" && (
        <p>Your order is being prepared.</p>
      )}

      {order.status === "READY" && (
        <div style={qrBox}>
          <p>Show this QR at canteen</p>
          <div style={qr}>QR CODE</div>
        </div>
      )}

      {order.status === "COLLECTED" && (
        <p>🍽 Order Collected</p>
      )}
    </div>
  );
}

const qrBox = {
  marginTop: 20,
  padding: 20,
  background: "#fff",
  width: 220
};

const qr = {
  height: 120,
  background: "#ddd",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};
