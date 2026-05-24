import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();

  const isClient = user?.role === "client";
  const isCounselor = user?.role === "counselor";

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-800">
            Hola, {user?.firstName} 👋
          </h1>
          <p className="text-stone-500 mt-1">
            {isClient
              ? "Bienvenido a tu espacio de bienestar."
              : "Bienvenido a tu panel de counselor."}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-orange-100">
            <p className="text-sm text-stone-400 mb-1">
              {isClient ? "Sesiones realizadas" : "Sesiones dadas"}
            </p>
            <p className="text-3xl font-bold text-orange-400">0</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-orange-100">
            <p className="text-sm text-stone-400 mb-1">Próximas citas</p>
            <p className="text-3xl font-bold text-orange-400">0</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-orange-100">
            <p className="text-sm text-stone-400 mb-1">
              {isClient ? "Counselors favoritos" : "Rating promedio"}
            </p>
            <p className="text-3xl font-bold text-orange-400">
              {isClient ? "0" : "—"}
            </p>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {isClient && (
            <>
              <Link
                to="/counselors"
                className="bg-white rounded-2xl p-6 border border-orange-100 hover:border-orange-300 transition-colors group"
              >
                <div className="text-3xl mb-3">🔍</div>
                <h3 className="font-semibold text-stone-800 group-hover:text-orange-500 transition-colors">
                  Buscar un counselor
                </h3>
                <p className="text-sm text-stone-400 mt-1">
                  Explorá nuestro directorio de profesionales.
                </p>
              </Link>
              <Link
                to="/appointments"
                className="bg-white rounded-2xl p-6 border border-orange-100 hover:border-orange-300 transition-colors group"
              >
                <div className="text-3xl mb-3">📅</div>
                <h3 className="font-semibold text-stone-800 group-hover:text-orange-500 transition-colors">
                  Mis citas
                </h3>
                <p className="text-sm text-stone-400 mt-1">
                  Ver y gestionar tus sesiones reservadas.
                </p>
              </Link>
            </>
          )}

          {isCounselor && (
            <>
              <Link
                to="/availability"
                className="bg-white rounded-2xl p-6 border border-orange-100 hover:border-orange-300 transition-colors group"
              >
                <div className="text-3xl mb-3">🗓️</div>
                <h3 className="font-semibold text-stone-800 group-hover:text-orange-500 transition-colors">
                  Mi disponibilidad
                </h3>
                <p className="text-sm text-stone-400 mt-1">
                  Configurá tus horarios disponibles.
                </p>
              </Link>
              <Link
                to="/appointments"
                className="bg-white rounded-2xl p-6 border border-orange-100 hover:border-orange-300 transition-colors group"
              >
                <div className="text-3xl mb-3">👥</div>
                <h3 className="font-semibold text-stone-800 group-hover:text-orange-500 transition-colors">
                  Mis sesiones
                </h3>
                <p className="text-sm text-stone-400 mt-1">
                  Ver las sesiones agendadas con tus clientes.
                </p>
              </Link>
            </>
          )}

          <Link
            to="/profile"
            className="bg-white rounded-2xl p-6 border border-orange-100 hover:border-orange-300 transition-colors group"
          >
            <div className="text-3xl mb-3">👤</div>
            <h3 className="font-semibold text-stone-800 group-hover:text-orange-500 transition-colors">
              Mi perfil
            </h3>
            <p className="text-sm text-stone-400 mt-1">
              Editá tu información personal.
            </p>
          </Link>

          <Link
            to="/blog"
            className="bg-white rounded-2xl p-6 border border-orange-100 hover:border-orange-300 transition-colors group"
          >
            <div className="text-3xl mb-3">📖</div>
            <h3 className="font-semibold text-stone-800 group-hover:text-orange-500 transition-colors">
              Blog
            </h3>
            <p className="text-sm text-stone-400 mt-1">
              Artículos y recursos de bienestar.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
