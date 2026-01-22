import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/global.css";

export default function Canteen() {
  const navigate = useNavigate();
  const { cart, addToCart, total, clearCart } = useCart();

  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("Meals");
  const [orders, setOrders] = useState([]);

  const studentId = 1; // TEMP until login system

  /* ---------------- FETCH MENU ---------------- */

  useEffect(() => {
    fetch(`http://localhost:8000/canteen/items?category=${category}`)
      .then(res => res.json())
      .then(setItems);
  }, [category]);

  /* ---------------- FETCH ORDER HISTORY ---------------- */

  useEffect(() => {
    fetch(`http://localhost:8000/canteen/orders/student/${studentId}`)
      .then(res => res.json())
      .then(setOrders);
  }, []);

  /* ---------------- PAYMENT FLOW ---------------- */

  const makePayment = async () => {
    // Create order
    const res = await fetch("http://localhost:8000/canteen/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id: studentId,
        total_amount: total
      })
    });

    const data = await res.json();
    const orderId = data.order_id;

    // Simulate payment delay (7s)
    setTimeout(async () => {
      await fetch("http://localhost:8000/payment/success", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId })
      });

      clearCart();
      navigate(`/canteen/order/${orderId}`);
    }, 7000);
  };

  return (
    <div className="app">
      <main className="main">
        <div className="page-header">
          <h1 className="page-title">Canteen Menu</h1>
        </div>

        {/* CATEGORY TABS */}
        <div className="tabs">
          {["Meals", "Snacks", "Drinks"].map(cat => (
            <div
              key={cat}
              className={`tab ${category === cat ? "active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </div>
          ))}
        </div>

        {/* ITEMS */}
        <div className="card-grid">
          {items.map(item => {
            const disabled = !item.is_available || item.stock <= 0;

            return (
              <div key={item.id} className="card item-card">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="food-image"
                />
                <div className="item-title">{item.name}</div>
                <div className="item-price">₹ {item.price}</div>

                <button
                  className="btn btn-success"
                  disabled={disabled}
                  onClick={() => addToCart(item)}
                >
                  {disabled ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            );
          })}
        </div>

        {/* CART */}
        {cart.length > 0 && (
          <div className="card" style={{ marginTop: 24 }}>
            <h3>Total: ₹ {total}</h3>
            <p>Payment will be confirmed in a few seconds</p>

            <button className="btn-cta" onClick={makePayment}>
              Make Payment
            </button>
          </div>
        )}

        {/* RECENT ORDERS */}
        <div className="card" style={{ marginTop: 30 }}>
          <h3>Recent Orders</h3>

          {orders.length === 0 && <p>No orders yet</p>}

          {orders.slice(0, 3).map(o => (
            <div key={o.id} className="history-item">
              <div>
                Order #{o.id}
                <div className={`status ${o.status.toLowerCase()}`}>
                  {o.status}
                </div>
              </div>
              <span>
                {new Date(o.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}

          <button
            className="btn btn-outline"
            style={{ marginTop: 10 }}
            onClick={() => navigate("/canteen/history")}
          >
            View Full History →
          </button>
        </div>
      </main>
    </div>
  );
}
