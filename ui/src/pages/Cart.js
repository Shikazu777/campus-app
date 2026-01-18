import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const navigate = useNavigate();

  const { cart, updateQty, total, clearCart } = useCart();

  const placeOrder = async () => {
  // 1. Create order
  const orderRes = await fetch("http://localhost:8000/canteen/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      student_id: 1,
      total_amount: total
    })
  });

  const orderData = await orderRes.json();

  // 2. Create payment
  const payRes = await fetch("http://localhost:8000/payment/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      order_id: orderData.order_id
    })
  });

  const payData = await payRes.json();

  

  // 3. Redirect to payment page
  window.location.href = payData.payment_url;
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
