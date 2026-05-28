import { NavLink, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/admin", label: "📊 Dashboard", end: true },
  { to: "/admin/counselors", label: "👥 Counselors" },
  { to: "/admin/appointments", label: "📅 Citas" },
  { to: '/recurring', label: '🔄 Sesiones periódicas' },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#FFF8F5" }}>
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-orange-100 flex flex-col fixed h-full">
        <div className="p-6 border-b border-orange-100">
          <Link to="/" className="text-xl font-bold text-orange-400">
            🌸 Contigo
          </Link>
          <div className="text-xs text-stone-400 mt-1">
            Panel de administración
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-orange-400 text-white"
                    : "text-stone-500 hover:bg-orange-50 hover:text-orange-400"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-orange-100">
          <div className="px-4 py-2 text-xs text-stone-400 mb-2">
            {user?.firstName} {user?.lastName}
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-stone-400 hover:text-red-400 transition-colors rounded-xl hover:bg-red-50"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
