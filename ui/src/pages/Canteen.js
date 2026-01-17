import { useState } from "react";
import { useNavigate } from "react-router-dom";


/* -------- FAKE FOOD DATA (₹) -------- */
const FOOD_DATA = {
  Meals: [
    { id: 1, name: "Veg Meals", price: 80 },
    { id: 2, name: "Chicken Meals", price: 120 }
  ],
  Snacks: [
    { id: 3, name: "Samosa", price: 15 },
    { id: 4, name: "Bajji", price: 20 }
  ],
  Drinks: [
    { id: 5, name: "Tea", price: 12 },
    { id: 6, name: "Coffee", price: 15 }
  ]
};

export default function Canteen() {
  const [category, setCategory] = useState("Meals");
  const [cart, setCart] = useState([]);
  // FOOD | CART | ORDER
  const [order, setOrder] = useState(null);
  const [history, setHistory] = useState([]);

  const trustTier = "Normal"; // Weak / Normal / Good

  /* -------- CART LOGIC -------- */

  const addToCart = (item) => {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      setCart(
        cart.map(i =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        )
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
    alert("Added to cart");
  };

  const updateQty = (id, delta) => {
    setCart(
      cart
        .map(i =>
          i.id === id ? { ...i, qty: i.qty + delta } : i
        )
        .filter(i => i.qty > 0)
    );
  };

  const total = cart.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  /* -------- PAYMENT -------- */

  let advance = 0;
  if (trustTier === "Weak") advance = total;
  else if (trustTier === "Normal") advance = total * 0.5;

  const placeOrder = () => {
    const newOrder = {
      id: Math.floor(Math.random() * 100000),
      items: cart,
      total,
      status: "Preparing"
    };

    setOrder(newOrder);
    setHistory([newOrder, ...history]);
    setCart([]);
    setScreen("ORDER");

    // simulate ready in 10–30 mins
    setTimeout(() => {
      setOrder(o => ({ ...o, status: "Ready" }));
    }, 3000);
  };

  /* -------- RENDER -------- */

  return (
    <div>
      <h1>🍔 Canteen</h1>

      {!order && (

        <>
          {/* CATEGORY */}
          <div style={{ display: "flex", gap: 10 }}>
            {Object.keys(FOOD_DATA).map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FOOD LIST */}
          <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
            {FOOD_DATA[category].map(item => (
              <div key={item.id} style={card}>
                <h3>{item.name}</h3>
                <p>₹ {item.price}</p>
                <button onClick={() => addToCart(item)}>
                  Add to cart
                </button>
              </div>
            ))}
          </div>

          {cart.length > 0 && (
            <button
             style={{ marginTop: 20 }}
                onClick={() => navigate("/canteen/cart")}
               >
             Go to Cart ({cart.length})
            </button>

          )}

          {/* RECENT ORDERS */}
          <h3 style={{ marginTop: 40 }}>Recent Orders</h3>
          {history.slice(0, 3).map(o => (
            <p key={o.id}>
              Order #{o.id} — ₹{o.total}
            </p>
          ))}
        </>
      )}


      {order && (

        <>
          <h2>✅ Order Placed</h2>
          <p>Order ID: {order.id}</p>
          <p>Status: {order.status}</p>
          <p>Your order will be ready in 10–30 minutes</p>

          {order.status === "Ready" && (
            <div style={qrBox}>
              <p>Show QR at canteen</p>
              <div style={qr}>QR CODE</div>
              <button
                onClick={() =>
                  setOrder(o => ({ ...o, status: "Collected" }))
                }
              >
                Simulate Scan
              </button>
            </div>
          )}

          {order.status === "Collected" && (
            <p>🍽 Order Collected</p>
          )}

          <button onClick={() => setScreen("FOOD")}>
            Back to Canteen
          </button>
        </>
      )}
    </div>
  );
}

/* -------- STYLES -------- */

const card = {
  background: "white",
  padding: 16,
  borderRadius: 10,
  width: 160
};

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
