import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import counselorService from "../services/counselorService";
import appointmentService from "../services/appointmentService";
import availabilityService from "../services/availabilityService";
import DatePicker from "../components/DatePicker";

// eslint-disable-next-line no-unused-vars
const getNextDays = (count) => {
  const days = [];
  for (let i = 1; i <= count; i++) {
    // Crear fecha con mediodía local para evitar problemas de timezone
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + i);
    days.push(date);
  }
  return days;
};

const formatDate = (date) => {
  return date.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
};

const formatDateValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [counselor, setCounselor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  

  useEffect(() => {
    counselorService
      .getById(id)
      .then((data) => setCounselor(data.counselor))
      .catch(() => navigate("/counselors"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Cuando cambia la fecha, buscar slots disponibles
  useEffect(() => {
    if (!selectedDate) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadingSlots(true);
    setSelectedTime(null);
    setAvailableSlots([]);

    availabilityService
      .getSlots(id, formatDateValue(selectedDate))
      .then((data) => setAvailableSlots(data.slots || []))
      .catch(() => setAvailableSlots([]))
      .finally(() => setLoadingSlots(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      setError("Seleccioná una fecha y un horario.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await appointmentService.create({
        counselorId: id,
        date: formatDateValue(selectedDate),
        time: selectedTime,
        notes,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Error al reservar la sesión.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-orange-400">Cargando...</div>
      </div>
    );

  if (success)
    return (
      <div className="min-h-screen bg-orange-50">
        <Navbar />
        <div className="max-w-lg mx-auto px-6 py-20 text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-2xl font-bold text-stone-800 mb-3">
            ¡Sesión reservada!
          </h1>
          <p className="text-stone-500 mb-2">
            Tu sesión con <strong>{counselor?.firstName}</strong> fue confirmada
            para el
          </p>
          <p className="text-orange-400 font-semibold text-lg mb-8">
            {formatDate(selectedDate)} a las {selectedTime}hs
          </p>
          <div className="bg-white rounded-2xl border border-orange-100 p-5 mb-8 text-left space-y-3">
            {[
              { icon: "📧", text: "Vas a recibir un email de confirmación" },
              { icon: "🎥", text: "El link de Zoom llega 15 min antes" },
              { icon: "📅", text: "Podés cancelar hasta 24hs antes" },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-3 text-sm text-stone-500"
              >
                <span>{item.icon}</span> {item.text}
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-orange-400 hover:bg-orange-500 text-white font-semibold px-8 py-3 rounded-full transition-colors"
          >
            Ir a mi dashboard
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate(`/counselors/${id}`)}
          className="text-sm text-stone-400 hover:text-orange-400 transition-colors mb-6 flex items-center gap-1"
        >
          ← Volver al perfil
        </button>

        <h1 className="text-2xl font-bold text-stone-800 mb-1">
          Reservar sesión
        </h1>
        <p className="text-stone-400 text-sm mb-8">
          Con {counselor?.firstName} {counselor?.lastName} · $
          {counselor?.counselorProfile?.hourlyRate} USD
        </p>

        {/* Paso 1: Fecha */}
        <div className="bg-white rounded-2xl border border-orange-100 p-6 mb-4">
          <h2 className="font-semibold text-stone-700 mb-4">
            1. Elegí una fecha
          </h2>
          <DatePicker
            counselorId={id}
            selectedDate={selectedDate}
            onSelectDate={(date) => {
              setSelectedDate(date);
              setSelectedTime(null);
            }}
          />
        </div>

        {/* Paso 2: Horario con slots reales */}
        {selectedDate && (
          <div className="bg-white rounded-2xl border border-orange-100 p-6 mb-4">
            <h2 className="font-semibold text-stone-700 mb-4">
              2. Elegí un horario
            </h2>

            {loadingSlots ? (
              <div className="text-sm text-orange-400">
                Cargando horarios disponibles...
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="text-center py-6">
                <div className="text-3xl mb-2">😔</div>
                <p className="text-sm text-stone-400">
                  No hay horarios disponibles para este día.
                </p>
                <p className="text-xs text-stone-300 mt-1">
                  Probá con otra fecha.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {availableSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                      selectedTime === time
                        ? "bg-orange-400 text-white shadow-sm"
                        : "bg-orange-50 text-stone-500 hover:bg-orange-100 border border-orange-100"
                    }`}
                  >
                    {time}hs
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Paso 3: Notas */}
        {selectedTime && (
          <div className="bg-white rounded-2xl border border-orange-100 p-6 mb-4">
            <h2 className="font-semibold text-stone-700 mb-2">
              3. ¿Querés agregar alguna nota? (opcional)
            </h2>
            <p className="text-xs text-stone-400 mb-3">
              Contale al counselor brevemente qué te gustaría trabajar.
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Ej: Estoy pasando por un momento de mucho estrés laboral..."
              className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm resize-none"
            />
            <p className="text-xs text-stone-300 text-right mt-1">
              {notes.length}/500
            </p>
          </div>
        )}

        {/* Resumen y confirmar */}
        {selectedDate && selectedTime && (
          <div className="bg-white rounded-2xl border border-orange-200 p-6">
            <h2 className="font-semibold text-stone-700 mb-4">
              Resumen de tu reserva
            </h2>
            <div className="space-y-2 mb-5">
              {[
                {
                  label: "Counselor",
                  value: `${counselor?.firstName} ${counselor?.lastName}`,
                },
                { label: "Fecha", value: formatDate(selectedDate) },
                { label: "Horario", value: `${selectedTime}hs` },
                {
                  label: "Duración",
                  value: `${counselor?.counselorProfile?.sessionDuration || 50} minutos`,
                },
                {
                  label: "Precio",
                  value: `$${counselor?.counselorProfile?.hourlyRate} USD`,
                },
              ].map((item) => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-stone-400">{item.label}</span>
                  <span className="font-medium text-stone-700">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-60"
            >
              {submitting ? "Confirmando..." : "Confirmar reserva"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
