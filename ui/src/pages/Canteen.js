import { useState } from "react";

const FOOD_DATA = {
  Meals: [
    { id: 1, name: "Veg Meals", price: 80 },
    { id: 2, name: "Chicken Meals", price: 120 },
    { id: 3, name: "Egg Fried Rice", price: 90 }
  ],
  Snacks: [
    { id: 4, name: "Samosa", price: 15 },
    { id: 5, name: "Bajji", price: 20 },
    { id: 6, name: "Puffs", price: 25 }
  ],
  Drinks: [
    { id: 7, name: "Tea", price: 12 },
    { id: 8, name: "Coffee", price: 15 },
    { id: 9, name: "Lime Juice", price: 25 }
  ]
};

export default function Canteen() {
  const [category, setCategory] = useState("Meals");
  const [cart, setCart] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [history, setHistory] = useState([]);

  // TEMP: simulate trust tier
  const trustTier = "Normal"; // Weak / Normal / Good

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const total = cart.reduce((sum, i) => sum + i.price, 0);

  let advance = 0;
  if (trustTier === "Weak") advance = total;
  else if (trustTier === "Normal") advance = total * 0.5;
  else advance = 0;

  return (
    <div>
      <h1>🍔 Canteen</h1>

      {/* CATEGORY TABS */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {Object.keys(FOOD_DATA).map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "none",
              background: cat === category ? "#111" : "#ddd",
              color: cat === category ? "white" : "black",
              cursor: "pointer"
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FOOD LIST */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {FOOD_DATA[category].map(item => (
          <div key={item.id} style={cardStyle}>
            <h3>{item.name}</h3>
            <p>₹ {item.price}</p>
            <button onClick={() => addToCart(item)} style={btnStyle}>
              Add
            </button>
          </div>
        ))}
      </div>

      {/* CART */}
      <div style={{ marginTop: "40px" }}>
        <h2>🛒 Cart</h2>

        {cart.length === 0 && <p>No items added</p>}

        {cart.map((i, idx) => (
          <p key={idx}>{i.name} — ₹{i.price}</p>
        ))}

        {cart.length > 0 && (
          <>
            <h3>Total: ₹{total}</h3>
            <p>
              Trust Tier: <b>{trustTier}</b><br />
              Advance to Pay: <b>₹{advance}</b>
            </p>

            {!orderPlaced ? (
              <button
                style={{ ...btnStyle, marginTop: "10px" }}
                onClick={() => {
                    setOrderPlaced(true);
                    setHistory([
                        {
                          name: cart.map(i => i.name).join(", "),
                          amount: total
                       },
                       ...history
                ]);
               setCart([]);
             }}

              >
                Place Order
              </button>
            ) : (
              <ActiveQR />
            )}
          </>
        )}
      </div>

      {/* FOOD HISTORY */}
      <div style={{ marginTop: "50px" }}>
        <h2>📦 Food Order History</h2>
        <p>Veg Meals — ₹80 — Collected</p>
        <p>Samosa — ₹15 — Collected</p>
        <p>Coffee — ₹15 — Collected</p>
      </div>
    </div>
  );
}

/* -------------------- COMPONENTS -------------------- */

function ActiveQR() {
  const [visible, setVisible] = useState(true);

  if (!visible) return <p>✅ Order collected</p>;

  return (
    <div style={qrBox}>
      <p><b>Show this QR at canteen</b></p>
      <div style={qrFake}>QR CODE</div>
      <button
        onClick={() => setVisible(false)}
        style={{ ...btnStyle, marginTop: "10px" }}
      >
        Simulate Scan
      </button>
    </div>
  );
}

/* -------------------- STYLES -------------------- */

const cardStyle = {
  background: "white",
  padding: "16px",
  borderRadius: "12px",
  width: "180px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
};

const btnStyle = {
  padding: "8px 12px",
  border: "none",
  borderRadius: "6px",
  background: "#111",
  color: "white",
  cursor: "pointer"
};

const qrBox = {
  marginTop: "20px",
  padding: "20px",
  background: "#fff",
  borderRadius: "12px",
  width: "220px"
};

const qrFake = {
  height: "120px",
  background: "#ddd",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold"
};
