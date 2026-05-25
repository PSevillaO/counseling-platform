const mongoose = require("mongoose");

const timeSlotSchema = new mongoose.Schema(
  {
    start: { type: String, required: true }, // "09:00"
    end: { type: String, required: true }, // "10:00"
  },
  { _id: false },
);

const dayScheduleSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: false },
    slots: [timeSlotSchema],
  },
  { _id: false },
);

const availabilitySchema = new mongoose.Schema(
  {
    counselor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    weeklySchedule: {
      lunes: {
        type: dayScheduleSchema,
        default: () => ({ enabled: false, slots: [] }),
      },
      martes: {
        type: dayScheduleSchema,
        default: () => ({ enabled: false, slots: [] }),
      },
      miercoles: {
        type: dayScheduleSchema,
        default: () => ({ enabled: false, slots: [] }),
      },
      jueves: {
        type: dayScheduleSchema,
        default: () => ({ enabled: false, slots: [] }),
      },
      viernes: {
        type: dayScheduleSchema,
        default: () => ({ enabled: false, slots: [] }),
      },
      sabado: {
        type: dayScheduleSchema,
        default: () => ({ enabled: false, slots: [] }),
      },
      domingo: {
        type: dayScheduleSchema,
        default: () => ({ enabled: false, slots: [] }),
      },
    },
    blockedDates: [{ type: String }], // ["2026-06-15", "2026-06-16"]
    sessionDuration: { type: Number, default: 50 }, // minutos
  },
  { timestamps: true },
);

module.exports = mongoose.model("Availability", availabilitySchema);
