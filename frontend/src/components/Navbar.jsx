import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-orange-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-orange-400">
          🌸 Contigo
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/counselors"
            className="text-sm text-stone-500 hover:text-orange-400 transition-colors"
          >
            Counselors
          </Link>
          <Link
            to="/blog"
            className="text-sm text-stone-500 hover:text-orange-400 transition-colors"
          >
            Blog
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="text-sm text-stone-500 hover:text-orange-400 transition-colors"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-semibold text-sm">
                  {user.firstName?.charAt(0)}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-stone-400 hover:text-red-400 transition-colors"
                >
                  Salir
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm text-orange-400 font-medium hover:underline"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="text-sm bg-orange-400 hover:bg-orange-500 text-white font-semibold px-4 py-2 rounded-full transition-colors"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
