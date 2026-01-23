import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allow, children }) {
  const { user } = useAuth();

  // Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Role check
  if (allow && !allow(user)) {
    return <Navigate to="/events" replace />;
  }

  return children;
}
