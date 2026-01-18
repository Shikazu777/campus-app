import { useParams, useNavigate } from "react-router-dom";

export default function MockPayment() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const completePayment = async () => {
    await fetch("http://localhost:8000/payment/success", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: orderId })
    });

    navigate(`/canteen/order/${orderId}`);
  };

  return (
    <div>
      <h1>💳 Mock UPI Payment</h1>
      <p>Order ID: {orderId}</p>
      <p>Simulating Google Pay / PhonePe</p>

      <button onClick={completePayment}>
        Pay ₹ (Success)
      </button>
    </div>
  );
}
