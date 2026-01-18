import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CanteenHistory() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // TEMP: hardcoded student
  const studentId = 1;

  useEffect(() => {
    fetch(`http://localhost:8000/canteen/orders/student/${studentId}`)
      .then(res => res.json())
      .then(setOrders);
  }, []);

  return (
    <div>
      <h1>📜 Canteen Order History</h1>

      {orders.length === 0 && <p>No orders yet</p>}

      {orders.map(order => (
        <div
          key={order.id}
          style={card}
          onClick={() => navigate(`/canteen/order/${order.id}`)}
        >
          <p><b>Order #{order.id}</b></p>
          <p>Status: {order.status}</p>
          <p>Total: ₹{order.total}</p>
          <p style={{ fontSize: 12, color: "#666" }}>
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

const card = {
  padding: 16,
  marginBottom: 12,
  borderRadius: 10,
  background: "#fff",
  cursor: "pointer"
};
