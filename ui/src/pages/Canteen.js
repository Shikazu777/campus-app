import { useState } from "react";
import "../styles/global.css";

/* -------- FAKE CANTEEN DATA (₹) -------- */
const FOOD_DATA = {
  Meals: [
    {
      id: 1,
      name: "Veg Meals",
      price: 80,
      img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d"
    },
    {
      id: 2,
      name: "Chicken Meals",
      price: 120,
      img: "https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab"
    }
  ],
  Snacks: [
    {
      id: 3,
      name: "Samosa",
      price: 15,
      img: "https://images.unsplash.com/photo-1600628422019-6c5a8a77a1f3"
    },
    {
      id: 4,
      name: "Bajji",
      price: 20,
      img: "https://images.unsplash.com/photo-1606491956689-2ea866880c84"
    }
  ],
  Drinks: [
    {
      id: 5,
      name: "Tea",
      price: 12,
      img: "https://images.unsplash.com/photo-1544787219-7f47ccb76574"
    },
    {
      id: 6,
      name: "Coffee",
      price: 15,
      img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93"
    }
  ]
};

export default function Canteen() {
  const [category, setCategory] = useState("Meals");
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState(() => {
  const saved = localStorage.getItem("canteenOrders");
  return saved ? JSON.parse(saved) : [];
});


  const addToCart = (item) => {
    const exists = cart.find((i) => i.id === item.id);
    if (exists) {
      setCart(
        cart.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        )
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const total = cart.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  return (
    <div className="app">


      {/* ---------- MAIN ---------- */}
      <main className="main">
        {/* HEADER */}
        <div className="page-header">
          <h1 className="page-title">Canteen Menu</h1>
          <button className="btn btn-outline">👤 Profile</button>
        </div>

        {/* TABS */}
        <div className="tabs">
          {Object.keys(FOOD_DATA).map((cat) => (
            <div
              key={cat}
              className={`tab ${category === cat ? "active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </div>
          ))}
        </div>

        {/* FOOD GRID */}
        <div className="card-grid">
          {FOOD_DATA[category].map((item) => (
            <div key={item.id} className="card item-card">
              <img src={item.img} alt={item.name} className="food-image" />
              <div className="item-title">{item.name}</div>
              <div className="item-price">₹ {item.price}</div>
              <button
                className="btn btn-success"
                onClick={() => addToCart(item)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        {/* CART SUMMARY */}
        {cart.length > 0 && (
          <div className="card" style={{ marginTop: 24 }}>
            <h3>Your order will be ready in 30 minutes</h3>
            <p>Total: ₹ {total}</p>
            <button
  className="btn-cta"
  onClick={() => {
    const newOrder = {
      id: Date.now(),
      items: cart,
      total,
      status: "PREPARING",
      qr: null,
      createdAt: new Date().toISOString()
    };

    const updated = [newOrder, ...orders];
    setOrders(updated);
    localStorage.setItem("canteenOrders", JSON.stringify(updated));

    setCart([]);

    // simulate preparation
    setTimeout(() => {
      setOrders(prev =>
        prev.map(o =>
          o.id === newOrder.id
            ? { ...o, status: "READY", qr: `QR-${o.id}` }
            : o
        )
      );
    }, 5000);
  }}
>
  Proceed to Payment
</button>

          </div>
        )}

        {/* BOOKING HISTORY */}
        <div className="card" style={{ marginTop: 30 }}>
          <h3>Booking History</h3>

          {orders.slice(0, 3).map(o => (
  <div key={o.id} className="history-item">
    <div>
      Order #{o.id}
      <div className={`status ${o.status.toLowerCase()}`}>
        {o.status}
      </div>
    </div>
    <span>
      {new Date(o.createdAt).toLocaleDateString()}
    </span>
  </div>
))}

<button
  className="btn btn-outline"
  style={{ marginTop: 10 }}
  onClick={() => window.location.href = "/my-bookings"}
>
  View Full History →
</button>



          {/* QR Preview */}
          {orders.find(o => o.status === "READY") && (
  <div className="qr-box">
    <strong>Scan QR to Collect</strong>
    <div className="qr-placeholder">
      {orders.find(o => o.status === "READY").qr}
    </div>
  </div>
)}

        </div>
      </main>
    </div>


  );
}
