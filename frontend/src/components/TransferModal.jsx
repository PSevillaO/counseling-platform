import { useState, useEffect } from "react";
import counselorService from "../services/counselorService";
import appointmentService from "../services/appointmentService";
import availabilityService from "../services/availabilityService";

const getNextDays = (count) => {
  const days = [];
  for (let i = 1; i <= count; i++) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + i);
    days.push(date);
  }
  return days;
};

const formatDateValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function TransferModal({
  appointment,
  onClose,
  onSuccess,
  isAdmin,
}) {
  const [counselors, setCounselors] = useState([]);
  const [selectedCounselor, setSelectedCounselor] = useState(
    appointment.counselor._id,
  );
  const [selectedDate, setSelectedDate] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [availableSlots, setAvailableSlots] = useState([]);
  const [allSlots, setAllSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const days = getNextDays(60); // 60 días hacia adelante

  useEffect(() => {
    if (isAdmin) {
      counselorService.getAll().then((data) => setCounselors(data.counselors));
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!selectedDate || !selectedCounselor) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadingSlots(true);
    setSelectedTime(null);
    availabilityService
      .getSlots(selectedCounselor, formatDateValue(selectedDate))
      .then((data) => {
        setAvailableSlots(data.slots || []);
        setAllSlots(data.allSlots || []);
        setBookedSlots(data.bookedSlots || []);
      })
      .catch(() => setAvailableSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [selectedDate, selectedCounselor]);

  const handleSubmit = async () => {
    if (
      !selectedDate &&
      !selectedTime &&
      selectedCounselor === appointment.counselor._id
    ) {
      setError("Seleccioná al menos un cambio.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await appointmentService.transfer(appointment._id, {
        newCounselorId:
          selectedCounselor !== appointment.counselor._id
            ? selectedCounselor
            : undefined,
        newDate: selectedDate ? formatDateValue(selectedDate) : undefined,
        newTime: selectedTime || undefined,
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Error al transferir la cita.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-orange-100 flex justify-between items-center">
          <div>
            <h2 className="font-bold text-stone-800 text-lg">
              Transferir sesión
            </h2>
            <p className="text-stone-400 text-sm mt-0.5">
              Cliente: {appointment.client?.firstName}{" "}
              {appointment.client?.lastName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-300 hover:text-stone-500 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Cita actual */}
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-100 text-sm">
            <p className="font-medium text-stone-700 mb-1">Cita actual:</p>
            <p className="text-stone-500">
              📅{" "}
              {new Date(appointment.date).toLocaleDateString("es-AR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                timeZone: "UTC",
              })}{" "}
              · 🕐 {appointment.time}hs
            </p>
            <p className="text-stone-500">
              👤 {appointment.counselor?.firstName}{" "}
              {appointment.counselor?.lastName}
            </p>
          </div>

          {/* Cambiar counselor — solo admin */}
          {isAdmin && counselors.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-2">
                Cambiar counselor
              </label>
              <select
                value={selectedCounselor}
                onChange={(e) => {
                  setSelectedCounselor(e.target.value);
                  setSelectedDate(null);
                  setSelectedTime(null);
                }}
                className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
              >
                {counselors.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.firstName} {c.lastName}
                    {c._id === appointment.counselor._id ? " (actual)" : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Elegir nueva fecha */}
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">
              Nueva fecha
            </label>
            <div className="grid grid-cols-5 sm:grid-cols-7 gap-1.5 max-h-48 overflow-y-auto">
              {days.map((day) => {
                const isSelected =
                  selectedDate?.toDateString() === day.toDateString();
                return (
                  <button
                    key={day.toDateString()}
                    onClick={() => {
                      setSelectedDate(day);
                      setSelectedTime(null);
                    }}
                    className={`p-1.5 rounded-lg text-center text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-orange-400 text-white"
                        : "bg-orange-50 text-stone-500 hover:bg-orange-100 border border-orange-100"
                    }`}
                  >
                    <div className="capitalize">
                      {day.toLocaleDateString("es-AR", { weekday: "short" })}
                    </div>
                    <div className="font-bold">{day.getDate()}</div>
                    <div className="capitalize">
                      {day.toLocaleDateString("es-AR", { month: "short" })}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Elegir nuevo horario */}
          {selectedDate && (
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-2">
                Nuevo horario
              </label>
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
                        className={`py-2 rounded-lg text-xs font-medium transition-all ${
                          isBooked
                            ? "bg-stone-100 text-stone-300 cursor-not-allowed"
                            : isSelected
                              ? "bg-orange-400 text-white"
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

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-orange-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-stone-200 text-stone-500 font-semibold py-2.5 rounded-xl hover:bg-stone-50 transition-colors text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              saving ||
              (!selectedDate &&
                !selectedTime &&
                selectedCounselor === appointment.counselor._id)
            }
            className="flex-1 bg-orange-400 hover:bg-orange-500 text-white font-bold py-2.5 rounded-xl transition-colors disabled:opacity-60 text-sm"
          >
            {saving ? "Guardando..." : "Confirmar transferencia"}
          </button>
        </div>
      </div>
    </div>
  );
}
