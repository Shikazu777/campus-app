import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const navigate = useNavigate();

  const { cart, updateQty, total, clearCart } = useCart();

  const placeOrder = async () => {
  const res = await fetch("http://localhost:8000/canteen/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      student_id: 1,
      total_amount: total
    })
  });

  const data = await res.json();
  clearCart();
  navigate(`/canteen/order/${data.order_id}`);
};


  return (
    <div>
      <h1>🛒 Cart</h1>

      {cart.length === 0 && <p>Your cart is empty</p>}

      {cart.map(i => (
        <div key={i.id}>
          {i.name} × {i.qty} — ₹{i.price * i.qty}
          <button onClick={() => updateQty(i.id, 1)}>+</button>
          <button onClick={() => updateQty(i.id, -1)}>-</button>
        </div>
      ))}

      {cart.length > 0 && (
        <>
          <h3>Total: ₹{total}</h3>

          <button onClick={placeOrder}>
            Proceed to Pay
          </button>
        </>
      )}
    </div>
  );
}
