import { useParams } from "react-router-dom";
import { useOrders } from "../context/OrderContext";

export default function OrderDetails() {
  const { id } = useParams();
  const { getOrderById, updateOrderStatus } = useOrders();

  const order = getOrderById(id);

  if (!order) {
    return <p>❌ Order not found</p>;
  }

  return (
    <div>
      <h1>📦 Order #{order.id}</h1>

      <p>Status: <b>{order.status}</b></p>
      <p>Total: ₹{order.total}</p>

      <h3>Items</h3>
      {order.items.map(i => (
        <p key={i.id}>
          {i.name} × {i.qty} — ₹{i.price * i.qty}
        </p>
      ))}

      {order.status === "Preparing" && (
        <p>Your order is being prepared.</p>
      )}

      {order.status === "Ready" && (
        <div style={qrBox}>
          <p>Show this QR at canteen</p>
          <div style={qr}>QR CODE</div>
          <button
            onClick={() =>
              updateOrderStatus(order.id, "Collected")
            }
          >
            Simulate Scan
          </button>
        </div>
      )}

      {order.status === "Collected" && (
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
