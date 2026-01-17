import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import Canteen from "./pages/Canteen";
import Events from "./pages/Events";
import Bookings from "./pages/Bookings";

export default function App() {

  // TEMP: simulate logged-in user
  const currentUser = {
    role: "OWNER" // change to STUDENT / EVENT_EDITOR / CANTEEN_EDITOR
  };

  return (
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
            <Route path="/events" element={<Events />} />
            <Route path="/bookings" element={<Bookings />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
