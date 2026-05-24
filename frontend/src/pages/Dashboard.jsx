import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import appointmentService from "../services/appointmentService";

export default function Dashboard() {
  const { user } = useAuth();
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const isClient = user?.role === "client";
  const isCounselor = user?.role === "counselor";

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appointmentService
      .getAll()
      .then((data) => setAppointments(data.appointments))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const upcoming = appointments.filter(
    (a) =>
      ["confirmed", "pending"].includes(a.status) &&
      new Date(a.date) >= new Date(),
  );
  const completed = appointments.filter((a) => a.status === "completed");

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
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

        {/* Stats con datos reales */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-orange-100">
            <p className="text-sm text-stone-400 mb-1">
              {isClient ? "Sesiones realizadas" : "Sesiones dadas"}
            </p>
            <p className="text-3xl font-bold text-orange-400">
              {loading ? "—" : completed.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-orange-100">
            <p className="text-sm text-stone-400 mb-1">Próximas citas</p>
            <p className="text-3xl font-bold text-orange-400">
              {loading ? "—" : upcoming.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-orange-100">
            <p className="text-sm text-stone-400 mb-1">Total de sesiones</p>
            <p className="text-3xl font-bold text-orange-400">
              {loading ? "—" : appointments.length}
            </p>
          </div>
        </div>

        {/* Próxima cita destacada */}
        {upcoming.length > 0 && (
          <div className="bg-white rounded-2xl border border-orange-200 p-5 mb-8">
            <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-3">
              Próxima sesión
            </p>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center text-lg font-bold text-orange-400">
                  {isClient
                    ? upcoming[0].counselor?.firstName?.charAt(0)
                    : upcoming[0].client?.firstName?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-stone-800">
                    {isClient
                      ? `${upcoming[0].counselor?.firstName} ${upcoming[0].counselor?.lastName}`
                      : `${upcoming[0].client?.firstName} ${upcoming[0].client?.lastName}`}
                  </p>
                  <p className="text-sm text-stone-400">
                    📅{" "}
                    {new Date(upcoming[0].date).toLocaleDateString("es-AR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}{" "}
                    · 🕐 {upcoming[0].time}hs
                  </p>
                </div>
              </div>
              <Link
                to="/appointments"
                className="text-sm text-orange-400 font-semibold hover:underline"
              >
                Ver todas →
              </Link>
            </div>
          </div>
        )}

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
