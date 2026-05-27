import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import DatePicker from "../components/DatePicker";
import { useAuth } from "../context/AuthContext";
import appointmentService from "../services/appointmentService";
import availabilityService from "../services/availabilityService";
import { useEffect } from "react";
import counselorService from "../services/counselorService";

const formatDateValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const FREQUENCY_OPTIONS = [
  { value: "weekly", label: "Semanal", desc: "Cada 7 días" },
  { value: "biweekly", label: "Quincenal", desc: "Cada 14 días" },
  { value: "monthly", label: "Mensual", desc: "Mismo día cada mes" },
];

export default function RecurringBooking() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const counselorId = user?.role === "counselor" ? user?.id || user?._id : null;

  const [selectedDate, setSelectedDate] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [availableSlots, setAvailableSlots] = useState([]);
  const [allSlots, setAllSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [frequency, setFrequency] = useState("weekly");
  const [endType, setEndType] = useState("count");
  const [sessionsCount, setSessionsCount] = useState(8);
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");

  useEffect(() => {
    if (!counselorId) return;
    counselorService
      .getClients(counselorId)
      .then((data) => setClients(data.clients))
      .catch(console.error);
  }, [counselorId]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setLoadingSlots(true);

    availabilityService
      .getSlots(counselorId, formatDateValue(date))
      .then((data) => {
        setAvailableSlots(data.slots || []);
        setAllSlots(data.allSlots || []);
        setBookedSlots(data.bookedSlots || []);
      })
      .catch(() => setAvailableSlots([]))
      .finally(() => setLoadingSlots(false));
  };

  const handleSubmit = async () => {
    if (!selectedClient) {
      setError("Seleccioná un cliente.");
      return;
    }
    if (!selectedDate || !selectedTime) {
      setError("Seleccioná fecha y horario.");
      return;
    }
    if (endType === "count" && (!sessionsCount || sessionsCount < 2)) {
      setError("El número de sesiones debe ser al menos 2.");
      return;
    }
    if (endType === "date" && !endDate) {
      setError("Seleccioná una fecha de fin.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const data = await appointmentService.createRecurring({
        counselorId,
        clientId: selectedClient, // ← agregar
        startDate: formatDateValue(selectedDate),
        time: selectedTime,
        frequency,
        endType,
        sessionsCount: Number(sessionsCount),
        endDate,
        notes,
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear las sesiones.");
    } finally {
      setSubmitting(false);
    }
  };

  if (result)
    return (
      <div className="min-h-screen bg-orange-50">
        <Navbar />
        <div className="max-w-lg mx-auto px-6 py-20 text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-2xl font-bold text-stone-800 mb-3">
            ¡Sesiones creadas!
          </h1>
          <p className="text-stone-500 mb-6">
            Se crearon{" "}
            <strong className="text-orange-400">
              {result.created} sesiones
            </strong>{" "}
            exitosamente.
          </p>

          {result.skipped?.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mb-6 text-left">
              <p className="font-semibold text-yellow-700 mb-3 text-sm">
                ⚠️ Se saltaron {result.skipped.length} fechas por conflicto de
                horario:
              </p>
              <div className="space-y-1">
                {result.skipped.map((date) => (
                  <p key={date} className="text-sm text-yellow-600">
                    📅{" "}
                    {new Date(date + "T12:00:00").toLocaleDateString("es-AR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      timeZone: "UTC",
                    })}
                  </p>
                ))}
              </div>
              <p className="text-xs text-yellow-500 mt-3">
                Podés reasignar estas fechas manualmente desde "Mis sesiones".
              </p>
            </div>
          )}

          <button
            onClick={() => navigate("/appointments")}
            className="bg-orange-400 hover:bg-orange-500 text-white font-semibold px-8 py-3 rounded-full transition-colors"
          >
            Ver mis sesiones
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-stone-400 hover:text-orange-400 transition-colors mb-6 flex items-center gap-1"
        >
          ← Volver al dashboard
        </button>

        <h1 className="text-2xl font-bold text-stone-800 mb-1">
          Sesiones periódicas
        </h1>
        <p className="text-stone-400 text-sm mb-8">
          Programá una serie de sesiones automáticamente.
        </p>
        {/* Paso 0: Elegir cliente */}
        <div className="bg-white rounded-2xl border border-orange-100 p-6 mb-4">
          <h2 className="font-semibold text-stone-700 mb-4">
            1. Elegí el cliente
          </h2>
          {clients.length === 0 ? (
            <p className="text-sm text-stone-400">
              No tenés clientes con sesiones previas.
            </p>
          ) : (
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
            >
              <option value="">Seleccioná un cliente</option>
              {clients.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.firstName} {c.lastName} — {c.email}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Paso 1: Fecha de inicio */}
        <div className="bg-white rounded-2xl border border-orange-100 p-6 mb-4">
          <h2 className="font-semibold text-stone-700 mb-4">
            1. Elegí la fecha de inicio
          </h2>
          <DatePicker
            counselorId={counselorId}
            selectedDate={selectedDate}
            onSelectDate={handleDateSelect}
          />
        </div>

        {/* Paso 2: Horario */}
        {selectedDate && (
          <div className="bg-white rounded-2xl border border-orange-100 p-6 mb-4">
            <h2 className="font-semibold text-stone-700 mb-4">
              2. Elegí el horario
            </h2>
            {loadingSlots ? (
              <p className="text-sm text-orange-400">Cargando horarios...</p>
            ) : allSlots.length === 0 ? (
              <p className="text-sm text-stone-400">
                No hay horarios disponibles para este día.
              </p>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {allSlots.map((time) => {
                  const isBooked = bookedSlots.includes(time);
                  const isSelected = selectedTime === time;
                  return (
                    <button
                      key={time}
                      onClick={() => !isBooked && setSelectedTime(time)}
                      disabled={isBooked}
                      className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isBooked
                          ? "bg-stone-100 text-stone-300 cursor-not-allowed"
                          : isSelected
                            ? "bg-orange-400 text-white shadow-sm"
                            : "bg-orange-50 text-stone-500 hover:bg-orange-100 border border-orange-100"
                      }`}
                    >
                      {time}hs
                      {isBooked && (
                        <span className="block text-xs leading-none">
                          ocupado
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Paso 3: Frecuencia */}
        {selectedTime && (
          <div className="bg-white rounded-2xl border border-orange-100 p-6 mb-4">
            <h2 className="font-semibold text-stone-700 mb-4">3. Frecuencia</h2>
            <div className="grid grid-cols-3 gap-3">
              {FREQUENCY_OPTIONS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFrequency(f.value)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    frequency === f.value
                      ? "border-orange-400 bg-orange-50"
                      : "border-stone-200 hover:border-orange-200"
                  }`}
                >
                  <div className="font-semibold text-stone-800 text-sm">
                    {f.label}
                  </div>
                  <div className="text-xs text-stone-400 mt-0.5">{f.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Paso 4: Duración de la serie */}
        {selectedTime && (
          <div className="bg-white rounded-2xl border border-orange-100 p-6 mb-4">
            <h2 className="font-semibold text-stone-700 mb-4">
              4. ¿Hasta cuándo?
            </h2>
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setEndType("count")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                  endType === "count"
                    ? "bg-orange-400 text-white border-orange-400"
                    : "bg-white text-stone-500 border-stone-200 hover:border-orange-300"
                }`}
              >
                Número de sesiones
              </button>
              <button
                onClick={() => setEndType("date")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                  endType === "date"
                    ? "bg-orange-400 text-white border-orange-400"
                    : "bg-white text-stone-500 border-stone-200 hover:border-orange-300"
                }`}
              >
                Fecha de fin
              </button>
            </div>

            {endType === "count" ? (
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-2">
                  Cantidad de sesiones (máx. según configuración)
                </label>
                <input
                  type="number"
                  value={sessionsCount}
                  onChange={(e) => setSessionsCount(e.target.value)}
                  min={2}
                  max={50}
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-2">
                  Fecha de fin
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                />
              </div>
            )}
          </div>
        )}

        {/* Paso 5: Notas */}
        {selectedTime && (
          <div className="bg-white rounded-2xl border border-orange-100 p-6 mb-4">
            <h2 className="font-semibold text-stone-700 mb-2">
              5. Notas (opcional)
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Notas para todas las sesiones..."
              className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm resize-none"
            />
          </div>
        )}

        {/* Resumen */}
        {selectedDate && selectedTime && (
          <div className="bg-white rounded-2xl border border-orange-200 p-6">
            <h2 className="font-semibold text-stone-700 mb-4">Resumen</h2>
            <div className="space-y-2 mb-5 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-400">Inicio</span>
                <span className="font-medium text-stone-700">
                  {selectedDate.toLocaleDateString("es-AR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Horario</span>
                <span className="font-medium text-stone-700">
                  {selectedTime}hs
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Frecuencia</span>
                <span className="font-medium text-stone-700">
                  {FREQUENCY_OPTIONS.find((f) => f.value === frequency)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Duración</span>
                <span className="font-medium text-stone-700">
                  {endType === "count"
                    ? `${sessionsCount} sesiones`
                    : `Hasta ${endDate}`}
                </span>
              </div>
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
              {submitting ? "Creando sesiones..." : "Crear sesiones periódicas"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
