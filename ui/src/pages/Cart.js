import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const navigate = useNavigate();

  const { cart, updateQty, total, clearCart } = useCart();

 const placeOrder = async () => {
  const payload = {
    student_id: 1,
    items: cart.map(i => ({
      item_id: i.id,
      qty: i.qty
    }))
  };

  const res = await fetch("http://localhost:8000/canteen/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (data.order_id) {
    // simulate payment
    setTimeout(async () => {
      await fetch("http://localhost:8000/payment/success", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: data.order_id })
      });

      clearCart();
      navigate(`/canteen/order/${data.order_id}`);
    }, 7000);
  }
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
