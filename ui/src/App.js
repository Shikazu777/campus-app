import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Canteen from "./pages/Canteen";
import Cart from "./pages/Cart";
import OrderDetails from "./pages/OrderDetails";
import MockPayment from "./pages/MockPayment";
import Events from "./pages/Events";
import Bookings from "./pages/Bookings";
import CanteenHistory from "./pages/CanteenHistory";
import AdminCanteen from "./pages/AdminCanteen";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";

export default function App() {
  // TEMP until login system
  const currentUser = {
    role: "OWNER" // STUDENT | OWNER | CANTEEN_EDITOR | EVENT_EDITOR
  };

  return (
    <CartProvider>
      <OrderProvider>
        <BrowserRouter>
          <div style={{ display: "flex" }}>
            <Sidebar role={currentUser.role} />

            <div
              style={{
                flex: 1,
                padding: "30px",
                background: "#f5f5f5",
                minHeight: "100vh"
              }}
            >
              <Routes>
                {/* STUDENT */}
                <Route path="/canteen" element={<Canteen />} />
                <Route path="/canteen/cart" element={<Cart />} />
                <Route path="/canteen/order/:id" element={<OrderDetails />} />
                <Route path="/canteen/history" element={<CanteenHistory />} />
                <Route path="/events" element={<Events />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/payment/mock/:orderId" element={<MockPayment />} />

                {/* ADMIN */}
                <Route path="/admin/canteen" element={<AdminCanteen />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </OrderProvider>
    </CartProvider>
  );
}
