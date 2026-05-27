import { useState, useEffect } from "react";
import availabilityService from "../services/availabilityService";

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const DAYS_HEADER = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const formatDateValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function DatePicker({
  counselorId,
  selectedDate,
  onSelectDate,
}) {
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [dayStatus, setDayStatus] = useState({}); // { '2026-06-15': 'available' | 'partial' | 'full' | 'none' }
  const [loading, setLoading] = useState(false);

  // Obtener todos los días del mes actual y el siguiente
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  // Cargar disponibilidad del mes
  useEffect(() => {
    if (!counselorId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setDayStatus({});

    availabilityService
      .getMonthAvailability(counselorId, currentYear, currentMonth)
      .then((data) => setDayStatus(data.days || {}))
      .catch(() => setDayStatus({}))
      .finally(() => setLoading(false));
  }, [currentMonth, currentYear, counselorId]);

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isPrevDisabled = () => {
    return (
      currentMonth === today.getMonth() && currentYear === today.getFullYear()
    );
  };

  const handleSelectDay = (day) => {
    const date = new Date(currentYear, currentMonth, day, 12, 0, 0);
    const dateStr = formatDateValue(date);
    const status = dayStatus[dateStr];
    if (status === "none" || status === "full") return;
    if (date < today) return;
    onSelectDate(date);
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const getDayStyle = (day) => {
    const date = new Date(currentYear, currentMonth, day, 12, 0, 0);
    const dateStr = formatDateValue(date);
    const isSelected =
      selectedDate && formatDateValue(selectedDate) === dateStr;
    const isPast = date < today;
    const status = dayStatus[dateStr];

    if (isSelected) {
      return "bg-orange-400 text-white font-bold cursor-pointer";
    }
    if (isPast) {
      return "text-stone-200 cursor-not-allowed";
    }
    if (status === "none" || status === "full") {
      return "text-stone-300 bg-stone-50 cursor-not-allowed line-through";
    }
    if (status === "partial") {
      return "bg-yellow-50 text-yellow-600 border border-yellow-200 cursor-pointer hover:bg-yellow-100";
    }
    if (status === "available") {
      return "bg-green-50 text-green-700 border border-green-200 cursor-pointer hover:bg-green-100";
    }
    return "text-stone-400 cursor-pointer hover:bg-orange-50";
  };

  return (
    <div className="w-full">
      {/* Header del mes */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={goToPrevMonth}
          disabled={isPrevDisabled()}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:bg-orange-50 hover:text-orange-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ‹
        </button>
        <span className="font-semibold text-stone-700">
          {MONTHS[currentMonth]} {currentYear}
        </span>
        <button
          onClick={goToNextMonth}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:bg-orange-50 hover:text-orange-400 transition-colors"
        >
          ›
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS_HEADER.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-medium text-stone-400 py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Días del mes */}
      {loading ? (
        <div className="text-center py-8 text-orange-400 text-sm">
          Cargando disponibilidad...
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {/* Espacios vacíos al inicio */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {/* Días */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            return (
              <button
                key={day}
                onClick={() => handleSelectDay(day)}
                className={`aspect-square rounded-lg text-sm flex items-center justify-center transition-all ${getDayStyle(day)}`}
              >
                {day}
              </button>
            );
          })}
        </div>
      )}

      {/* Leyenda */}
      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-stone-100">
        {[
          { color: "bg-green-50 border border-green-200", label: "Disponible" },
          {
            color: "bg-yellow-50 border border-yellow-200",
            label: "Pocos turnos",
          },
          { color: "bg-stone-50", label: "Sin turnos" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-1.5 text-xs text-stone-400"
          >
            <div className={`w-4 h-4 rounded ${item.color}`} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
