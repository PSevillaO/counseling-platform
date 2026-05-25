import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import appointmentService from "../services/appointmentService";
import { useAuth } from "../context/AuthContext";

const statusConfig = {
  confirmed: {
    label: "Confirmada",
    color: "bg-green-50 text-green-600 border-green-100",
  },
  pending: {
    label: "Pendiente",
    color: "bg-yellow-50 text-yellow-600 border-yellow-100",
  },
  completed: {
    label: "Completada",
    color: "bg-stone-50 text-stone-500 border-stone-100",
  },
  cancelled: {
    label: "Cancelada",
    color: "bg-red-50 text-red-400 border-red-100",
  },
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: 'UTC',
  });
};

export default function Appointments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  const isClient = user?.role === "client";

  useEffect(() => {
    appointmentService
      .getAll()
      .then((data) => setAppointments(data.appointments))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!confirm("¿Estás seguro de que querés cancelar esta sesión?")) return;
    setCancelling(id);
    try {
      await appointmentService.cancel(id);
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "cancelled" } : a)),
      );
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("No se pudo cancelar la sesión.");
    } finally {
      setCancelling(null);
    }
  };

  const upcoming = appointments.filter(
    (a) =>
      ["confirmed", "pending"].includes(a.status) &&
      new Date(a.date) >= new Date(),
  );
  const past = appointments.filter(
    (a) =>
      a.status === "completed" ||
      a.status === "cancelled" ||
      new Date(a.date) < new Date(),
  );

  if (loading)
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-orange-400">Cargando citas...</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-800">Mis sesiones</h1>
            <p className="text-stone-400 text-sm mt-1">
              {isClient
                ? "Tus sesiones reservadas."
                : "Sesiones con tus clientes."}
            </p>
          </div>
          {isClient && (
            <button
              onClick={() => navigate("/counselors")}
              className="bg-orange-400 hover:bg-orange-500 text-white font-semibold px-5 py-2.5 rounded-full text-sm transition-colors"
            >
              + Nueva sesión
            </button>
          )}
        </div>

        {/* Próximas */}
        <div className="mb-10">
          <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-4">
            Próximas ({upcoming.length})
          </h2>

          {upcoming.length === 0 ? (
            <div className="bg-white rounded-2xl border border-orange-100 p-10 text-center">
              <div className="text-4xl mb-3">📅</div>
              <p className="text-stone-400 text-sm">
                No tenés sesiones próximas.
              </p>
              {isClient && (
                <button
                  onClick={() => navigate("/counselors")}
                  className="mt-4 text-orange-400 font-semibold text-sm hover:underline"
                >
                  Reservar una sesión
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {upcoming.map((apt) => (
                <AppointmentCard
                  key={apt._id}
                  apt={apt}
                  isClient={isClient}
                  cancelling={cancelling}
                  onCancel={handleCancel}
                  onViewCounselor={() =>
                    navigate(`/counselors/${apt.counselor._id}`)
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Historial */}
        {past.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-4">
              Historial ({past.length})
            </h2>
            <div className="space-y-4">
              {past.map((apt) => (
                <AppointmentCard
                  key={apt._id}
                  apt={apt}
                  isClient={isClient}
                  cancelling={cancelling}
                  onCancel={handleCancel}
                  onViewCounselor={() =>
                    navigate(`/counselors/${apt.counselor._id}`)
                  }
                  isPast
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AppointmentCard({
  apt,
  isClient,
  cancelling,
  onCancel,
  onViewCounselor,
  isPast,
}) {
  const status = statusConfig[apt.status] || statusConfig.confirmed;
  const person = isClient ? apt.counselor : apt.client;

  return (
    <div
      className={`bg-white rounded-2xl border p-5 transition-all ${isPast ? "border-stone-100 opacity-70" : "border-orange-100"}`}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center text-lg font-bold text-orange-400 flex-shrink-0">
            {person?.firstName?.charAt(0)}
          </div>

          <div>
            <h3 className="font-semibold text-stone-800">
              {person?.firstName} {person?.lastName}
            </h3>
            {isClient && (
              <p className="text-xs text-orange-400">
                {apt.counselor?.counselorProfile?.specialties?.[0]}
              </p>
            )}
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-stone-400 capitalize">
                📅 {formatDate(apt.date)}
              </span>
              <span className="text-sm text-stone-400">🕐 {apt.time}hs</span>
            </div>
            {apt.notes && (
              <p className="text-xs text-stone-300 mt-1 italic">
                "{apt.notes}"
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full border ${status.color}`}
          >
            {status.label}
          </span>

          {!isPast && apt.status === "confirmed" && (
            <button
              onClick={() => onCancel(apt._id)}
              disabled={cancelling === apt._id}
              className="text-xs text-stone-300 hover:text-red-400 transition-colors disabled:opacity-50"
            >
              {cancelling === apt._id ? "Cancelando..." : "Cancelar"}
            </button>
          )}

          {isClient && !isPast && (
            <button
              onClick={onViewCounselor}
              className="text-xs text-orange-400 hover:underline"
            >
              Ver perfil
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
