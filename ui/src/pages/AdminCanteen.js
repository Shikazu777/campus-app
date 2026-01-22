import { useEffect, useState } from "react";

export default function AdminCanteen() {
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  /* ---------------- FETCH DATA ---------------- */

  const loadOrders = () => {
    fetch("http://localhost:8000/canteen/orders")
      .then(res => res.json())
      .then(setOrders);
  };

  const loadItems = () => {
    fetch("http://localhost:8000/canteen/items")
      .then(res => res.json())
      .then(setItems);
  };

  useEffect(() => {
    loadOrders();
    loadItems();

    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  /* ---------------- ORDER ACTIONS ---------------- */

  const markReady = async (id) => {
    await fetch(
      `http://localhost:8000/canteen/order/${id}/ready`,
      { method: "POST" }
    );
    loadOrders();
  };

  const markCollected = async (qr) => {
    await fetch("http://localhost:8000/canteen/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qr_token: qr })
    });
    loadOrders();
  };

  /* ---------------- STOCK ACTIONS ---------------- */

  const updateStock = async (id, stock) => {
    await fetch(
      `http://localhost:8000/canteen/items/${id}/stock`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock })
      }
    );
    loadItems();
  };

  const toggleAvailability = async (id, is_available) => {
    await fetch(
      `http://localhost:8000/canteen/items/${id}/availability`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_available: !is_available })
      }
    );
    loadItems();
  };

  return (
    <div>
      <h1>🛠 Canteen Admin</h1>

      {/* ---------- ORDERS ---------- */}
      <section>
        <h2>📦 Live Orders</h2>

        {orders.map(o => (
          <div key={o.id} style={card}>
            <div>
              <b>Order #{o.id}</b>
              <p>Status: {o.status}</p>
              <p>Total: ₹{o.total}</p>
            </div>

            <div>
              {o.status === "PREPARING" && (
                <button onClick={() => markReady(o.id)}>
                  Mark READY
                </button>
              )}

              {o.status === "READY" && (
                <button onClick={() => markCollected(o.qr_token)}>
                  Mark COLLECTED
                </button>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* ---------- ITEMS ---------- */}
      <section style={{ marginTop: 40 }}>
        <h2>
          🍔 Food Items
          <button
            style={addBtn}
            onClick={() => setShowAdd(true)}
          >
            ＋
          </button>
        </h2>

        {items.map(i => (
          <div key={i.id} style={card}>
            <div>
              <b>{i.name}</b>
              <p>₹ {i.price}</p>
              <p>Stock: {i.stock}</p>
            </div>

            <div>
              <button onClick={() => updateStock(i.id, i.stock + 10)}>
                +10
              </button>
              <button onClick={() => updateStock(i.id, i.stock - 1)}>
                −1
              </button>
              <button onClick={() => toggleAvailability(i.id, i.is_available)}>
                {i.is_available ? "Disable" : "Enable"}
              </button>
            </div>
          </div>
        ))}
      </section>

      {showAdd && <AddItem onClose={() => {
        setShowAdd(false);
        loadItems();
      }} />}
    </div>
  );
}

/* ---------------- ADD ITEM MODAL ---------------- */

function AddItem({ onClose }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    image_url: "",
    category: "Meals",
    stock: 0
  });

  const submit = async () => {
    await fetch("http://localhost:8000/canteen/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    onClose();
  };

  return (
    <div style={modal}>
      <h3>Add Food Item</h3>

      {Object.keys(form).map(k => (
        <input
          key={k}
          placeholder={k}
          value={form[k]}
          onChange={e =>
            setForm({ ...form, [k]: e.target.value })
          }
        />
      ))}

      <button onClick={submit}>Add</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const card = {
  display: "flex",
  justifyContent: "space-between",
  padding: 16,
  marginBottom: 10,
  background: "#fff",
  borderRadius: 10
};

const addBtn = {
  marginLeft: 10,
  fontSize: 20
};

const modal = {
  position: "fixed",
  top: "20%",
  left: "35%",
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  width: 300
};
