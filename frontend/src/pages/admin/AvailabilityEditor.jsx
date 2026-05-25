import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import availabilityService from "../../services/availabilityService";
import counselorService from "../../services/counselorService";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "./AdminLayout";
import Navbar from "../../components/Navbar";

const DAYS = [
  { key: "lunes", label: "Lunes" },
  { key: "martes", label: "Martes" },
  { key: "miercoles", label: "Miércoles" },
  { key: "jueves", label: "Jueves" },
  { key: "viernes", label: "Viernes" },
  { key: "sabado", label: "Sábado" },
  { key: "domingo", label: "Domingo" },
];

const TIME_OPTIONS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

const defaultSchedule = () => ({
  lunes: { enabled: false, slots: [] },
  martes: { enabled: false, slots: [] },
  miercoles: { enabled: false, slots: [] },
  jueves: { enabled: false, slots: [] },
  viernes: { enabled: false, slots: [] },
  sabado: { enabled: false, slots: [] },
  domingo: { enabled: false, slots: [] },
});

export default function AvailabilityEditor() {
  const { counselorId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";
  const targetId = counselorId || user?.id || user?._id;

  const [counselor, setCounselor] = useState(null);
  const [schedule, setSchedule] = useState(defaultSchedule());
  const [blockedDates, setBlockedDates] = useState([]);
  const [newBlockedDate, setNewBlockedDate] = useState("");
  const [sessionDuration, setSessionDuration] = useState(50);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [availData, counselorData] = await Promise.all([
          availabilityService.getAvailability(targetId),
          counselorService.getById(targetId),
        ]);
        const avail = availData.availability;
        setSchedule(avail.weeklySchedule || defaultSchedule());
        setBlockedDates(avail.blockedDates || []);
        setSessionDuration(avail.sessionDuration || 50);
        setCounselor(counselorData.counselor);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [targetId]);

  const toggleDay = (dayKey) => {
    setSchedule((prev) => ({
      ...prev,
      [dayKey]: { ...prev[dayKey], enabled: !prev[dayKey].enabled },
    }));
  };

  const toggleSlot = (dayKey, time) => {
    setSchedule((prev) => {
      const currentSlots = prev[dayKey].slots || [];
      const exists = currentSlots.find((s) => s.start === time);
      const newSlots = exists
        ? currentSlots.filter((s) => s.start !== time)
        : [...currentSlots, { start: time, end: time }].sort((a, b) =>
            a.start.localeCompare(b.start),
          );
      return { ...prev, [dayKey]: { ...prev[dayKey], slots: newSlots } };
    });
  };

  const addBlockedDate = () => {
    if (!newBlockedDate || blockedDates.includes(newBlockedDate)) return;
    setBlockedDates((prev) => [...prev, newBlockedDate].sort());
    setNewBlockedDate("");
  };

  const removeBlockedDate = (date) => {
    setBlockedDates((prev) => prev.filter((d) => d !== date));
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      await availabilityService.updateAvailability(targetId, {
        weeklySchedule: schedule,
        blockedDates,
        sessionDuration,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Error al guardar la disponibilidad.");
    } finally {
      setSaving(false);
    }
  };

  const content = loading ? (
    <div className="text-orange-400">Cargando agenda...</div>
  ) : (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">
            Agenda de {counselor?.firstName} {counselor?.lastName}
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            Configurá los horarios disponibles para sesiones.
          </p>
        </div>
        <button
          onClick={() => navigate(isAdmin ? "/admin/counselors" : "/dashboard")}
          className="text-sm text-stone-400 hover:text-orange-400 transition-colors"
        >
          ← Volver
        </button>
      </div>

      {/* Duración de sesión */}
      <div className="bg-white rounded-2xl border border-orange-100 p-6 mb-4">
        <h2 className="font-semibold text-stone-700 mb-4">
          Duración de sesión
        </h2>
        <div className="flex gap-3">
          {[30, 45, 50, 60, 90].map((min) => (
            <button
              key={min}
              onClick={() => setSessionDuration(min)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                sessionDuration === min
                  ? "bg-orange-400 text-white"
                  : "bg-orange-50 text-stone-500 border border-orange-100 hover:bg-orange-100"
              }`}
            >
              {min} min
            </button>
          ))}
        </div>
      </div>

      {/* Horario semanal */}
      <div className="bg-white rounded-2xl border border-orange-100 p-6 mb-4">
        <h2 className="font-semibold text-stone-700 mb-4">Horario semanal</h2>
        <div className="space-y-4">
          {DAYS.map((day) => {
            const dayData = schedule[day.key] || { enabled: false, slots: [] };
            return (
              <div
                key={day.key}
                className={`rounded-xl border p-4 transition-colors ${
                  dayData.enabled
                    ? "border-orange-200 bg-orange-50"
                    : "border-stone-100 bg-stone-50"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <button
                    onClick={() => toggleDay(day.key)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${
                      dayData.enabled ? "bg-orange-400" : "bg-stone-200"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${
                        dayData.enabled ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                  <span
                    className={`font-medium text-sm ${dayData.enabled ? "text-stone-800" : "text-stone-400"}`}
                  >
                    {day.label}
                  </span>
                  {dayData.enabled && (
                    <span className="text-xs text-orange-400">
                      {dayData.slots?.length || 0} horarios seleccionados
                    </span>
                  )}
                </div>

                {dayData.enabled && (
                  <div className="flex flex-wrap gap-2">
                    {TIME_OPTIONS.map((time) => {
                      const selected = dayData.slots?.find(
                        (s) => s.start === time,
                      );
                      return (
                        <button
                          key={time}
                          onClick={() => toggleSlot(day.key, time)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            selected
                              ? "bg-orange-400 text-white"
                              : "bg-white text-stone-500 border border-stone-200 hover:border-orange-300"
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Fechas bloqueadas */}
      <div className="bg-white rounded-2xl border border-orange-100 p-6 mb-6">
        <h2 className="font-semibold text-stone-700 mb-4">Fechas bloqueadas</h2>
        <p className="text-xs text-stone-400 mb-3">
          Días en los que el counselor no atiende (vacaciones, feriados, etc.)
        </p>
        <div className="flex gap-3 mb-4">
          <input
            type="date"
            value={newBlockedDate}
            onChange={(e) => setNewBlockedDate(e.target.value)}
            className="px-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          <button
            onClick={addBlockedDate}
            className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Bloquear fecha
          </button>
        </div>

        {blockedDates.length === 0 ? (
          <p className="text-sm text-stone-300">No hay fechas bloqueadas.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {blockedDates.map((date) => (
              <div
                key={date}
                className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-400 px-3 py-1.5 rounded-lg text-xs"
              >
                📅{" "}
                {new Date(date + "T12:00:00").toLocaleDateString("es-AR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
                <button
                  onClick={() => removeBlockedDate(date)}
                  className="hover:text-red-600 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Guardar */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm mb-4">
          ✅ Agenda guardada correctamente.
        </div>
      )}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-60"
      >
        {saving ? "Guardando..." : "Guardar agenda"}
      </button>
    </div>
  );

  if (isAdmin) return <AdminLayout>{content}</AdminLayout>;

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">{content}</div>
    </div>
  );
}
