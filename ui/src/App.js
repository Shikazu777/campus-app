import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Canteen from "./pages/Canteen";
import Cart from "./pages/Cart";
import OrderDetails from "./pages/OrderDetails";
import Events from "./pages/Events";
import Bookings from "./pages/Bookings";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";



export default function App() {

  // TEMP: simulate logged-in user
  const currentUser = {
    role: "OWNER" // change to STUDENT / EVENT_EDITOR / CANTEEN_EDITOR
  };

  return (
    <CartProvider>
      <OrderProvider>
     <BrowserRouter>
      <div style={{ display: "flex" }}>

            <Sidebar role={currentUser.role} />
        <div style={{
          flex: 1,
          padding: "30px",
          background: "#f5f5f5",
          minHeight: "100vh"
        }}>
          <Routes>
            <Route path="/canteen" element={<Canteen />} />
            <Route path="/canteen/cart" element={<Cart />} />
            <Route path="/canteen/order/:id" element={<OrderDetails />} />

            <Route path="/events" element={<Events />} />
            <Route path="/bookings" element={<Bookings />} />
          </Routes>

        </div>
      </div>
    </BrowserRouter>
    </OrderProvider>
   </CartProvider>
  );
}
