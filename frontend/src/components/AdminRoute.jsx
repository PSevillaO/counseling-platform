import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="text-orange-400">Cargando...</div>
      </div>
    );

  if (!user || user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
}
