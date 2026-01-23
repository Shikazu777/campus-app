import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);

  /* ---------------- FETCH ORDER ---------------- */

  const fetchOrder = () => {
    fetch(`http://localhost:8000/canteen/order/${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setOrder(data);
      });
  };

  /* ---------------- FETCH ITEMS ---------------- */

  const fetchItems = () => {
    fetch(`http://localhost:8000/canteen/order/${id}/items`)
      .then(res => res.json())
      .then(setItems);
  };

  useEffect(() => {
    fetchOrder();
    fetchItems();

    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [id]);

  if (!order) return <p>❌ Order not found</p>;

  return (
    <div>
      <h1>📦 Order #{order.id}</h1>

      <p>Status: <b>{order.status}</b></p>
      <p>Total: ₹{order.total}</p>

      <h3 style={{ marginTop: 20 }}>Items</h3>

      {items.length === 0 && <p>No items</p>}

      {items.map((i, idx) => (
        <div key={idx} style={itemRow}>
          <span>{i.name}</span>
          <span>{i.quantity} × ₹{i.price}</span>
        </div>
      ))}

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

/* ---------------- STYLES ---------------- */

const itemRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: "8px 0",
  borderBottom: "1px solid #e5e7eb",
  fontSize: 14
};

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
