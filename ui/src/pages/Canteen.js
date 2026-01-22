import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/global.css";

export default function Canteen() {
  const navigate = useNavigate();
  const { cart, addToCart, total } = useCart();

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
    // 1. Create order
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

    // 2. Simulate payment delay (7 sec)
    setTimeout(async () => {
      await fetch("http://localhost:8000/payment/success", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId })
      });

      navigate(`/canteen/order/${orderId}`);
    }, 7000);
  };

  return (
    <div className="app">
      <main className="main">
        {/* HEADER */}
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

        {/* FOOD ITEMS */}
        <div className="card-grid">
          {items.map(item => (
            <div key={item.id} className="card item-card">
              <img src={item.image_url} className="food-image" />
              <div className="item-title">{item.name}</div>
              <div className="item-price">₹ {item.price}</div>

              {item.is_available && item.stock > 0 ? (
                <button
                  className="btn btn-success"
                  onClick={() => addToCart(item)}
                >
                  Add to Cart
                </button>
              ) : (
                <button disabled className="btn">
                  Out of Stock
                </button>
              )}
            </div>
          ))}
        </div>

        {/* CART SUMMARY */}
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
