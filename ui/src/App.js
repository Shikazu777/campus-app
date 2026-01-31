import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import Canteen from "./pages/Canteen";
import Cart from "./pages/Cart";
import OrderDetails from "./pages/OrderDetails";
import MockPayment from "./pages/MockPayment";
import Events from "./pages/Events";
import Bookings from "./pages/Bookings";
import CanteenHistory from "./pages/CanteenHistory";
import AdminCanteen from "./pages/AdminCanteen";

import EventDetails from "./pages/EventDetails";
import EventTicket from "./pages/EventTicket";

import AdminEventScanner from "./pages/AdminEventScanner";
import AdminEventCreate from "./pages/AdminEventCreate";
import AdminEventList from "./pages/AdminEventList";
import AdminEventEdit from "./pages/AdminEventEdit";
import AdminRoleAssign from "./pages/AdminRoleAssign";

import Login from "./pages/Login";

import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Analytics from "./pages/Analytics";  

export default function App() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  const isOwner = user.user_type === "owner";
  const isEventEditor = user.roles?.includes("EVENT_EDITOR");
  const isCanteenEditor = user.roles?.includes("CANTEEN_EDITOR");

  return (
    <CartProvider>
      <OrderProvider>
        <div style={{ display: "flex" }}>
          <Sidebar
            role={
              isOwner
                ? "OWNER"
                : isEventEditor
                ? "EVENT_EDITOR"
                : isCanteenEditor
                ? "CANTEEN_EDITOR"
                : "STUDENT"
            }
          />

          <div
            style={{
              flex: 1,
              padding: "30px",
              background: "#f5f5f5",
              minHeight: "100vh"
            }}
          >
            <Routes>
              {/* STUDENT ROUTES */}
              <Route path="/canteen" element={<Canteen />} />
              <Route path="/canteen/cart" element={<Cart />} />
              <Route path="/canteen/order/:id" element={<OrderDetails />} />
              <Route path="/canteen/history" element={<CanteenHistory />} />

              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/events/ticket/:id" element={<EventTicket />} />

              <Route path="/bookings" element={<Bookings />} />
              <Route path="/payment/mock/:orderId" element={<MockPayment />} />

              <Route path="/analytics" element={<Analytics />} />

              {/* CANTEEN ADMIN */}
              <Route
                path="/admin/canteen"
                element={
                  <ProtectedRoute
                    allow={() => isOwner || isCanteenEditor}
                  >
                    <AdminCanteen />
                  </ProtectedRoute>
                }
              />

              {/* EVENT ADMIN */}
              <Route
                path="/admin/event/scanner"
                element={
                  <ProtectedRoute
                    allow={() => isOwner || isEventEditor}
                  >
                    <AdminEventScanner />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/event/create"
                element={
                  <ProtectedRoute
                    allow={() => isOwner || isEventEditor}
                  >
                    <AdminEventCreate />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/event/list"
                element={
                  <ProtectedRoute
                    allow={() => isOwner || isEventEditor}
                  >
                    <AdminEventList />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/event/edit/:id"
                element={
                  <ProtectedRoute
                    allow={() => isOwner || isEventEditor}
                  >
                    <AdminEventEdit />
                  </ProtectedRoute>
                }
              />

              {/* OWNER ONLY */}
              <Route
                path="/admin/role-assign"
                element={
                  <ProtectedRoute allow={() => isOwner}>
                    <AdminRoleAssign />
                  </ProtectedRoute>
                }
              />

              {/* FALLBACK */}
              <Route path="*" element={<Navigate to="/events" />} />
            </Routes>
          </div>
        </div>
      </OrderProvider>
    </CartProvider>
  );
}
