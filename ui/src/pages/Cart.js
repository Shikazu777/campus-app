import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Cart() {
  const navigate = useNavigate();

  // TEMP shared cart (later via context)
  const [cart, setCart] = useState([
    { id: 1, name: "Samosa", price: 15, qty: 2 },
    { id: 2, name: "Veg Meals", price: 80, qty: 1 }
  ]);

  const total = cart.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  const placeOrder = () => {
    const orderId = Math.floor(Math.random() * 100000);
    navigate(`/canteen/order/${orderId}`);
  };

  return (
    <div>
      <h1>🛒 Cart</h1>

      {cart.map(i => (
        <div key={i.id}>
          {i.name} × {i.qty} — ₹{i.price * i.qty}
        </div>
      ))}

      <h3>Total: ₹{total}</h3>

      <button onClick={placeOrder}>
        Proceed to Pay
      </button>
    </div>
  );
}
