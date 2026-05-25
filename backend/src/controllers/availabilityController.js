const Availability = require("../models/Availability");
const User = require("../models/User");

// GET /api/availability/:counselorId
const getAvailability = async (req, res) => {
  try {
    let availability = await Availability.findOne({
      counselor: req.params.counselorId,
    });

    if (!availability) {
      // Si no tiene disponibilidad configurada, devolver estructura vacía
      availability = {
        counselor: req.params.counselorId,
        weeklySchedule: {
          lunes: { enabled: false, slots: [] },
          martes: { enabled: false, slots: [] },
          miercoles: { enabled: false, slots: [] },
          jueves: { enabled: false, slots: [] },
          viernes: { enabled: false, slots: [] },
          sabado: { enabled: false, slots: [] },
          domingo: { enabled: false, slots: [] },
        },
        blockedDates: [],
        sessionDuration: 50,
      };
    }

    res.json({ success: true, availability });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error al obtener disponibilidad." });
  }
};

// PUT /api/availability/:counselorId
const updateAvailability = async (req, res) => {
  try {
    const { weeklySchedule, blockedDates, sessionDuration } = req.body;
    const counselorId = req.params.counselorId;

    // Solo el propio counselor o un admin pueden modificar
    const isOwner = req.user._id.toString() === counselorId;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "No tenés permiso para modificar esta agenda.",
      });
    }

    const availability = await Availability.findOneAndUpdate(
      { counselor: counselorId },
      { weeklySchedule, blockedDates, sessionDuration },
      { new: true, upsert: true },
    );

    res.json({
      success: true,
      message: "Disponibilidad actualizada.",
      availability,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error al actualizar disponibilidad." });
  }
};

// GET /api/availability/:counselorId/slots?date=2026-06-15
// Devuelve los slots disponibles para una fecha específica
const getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date)
      return res
        .status(400)
        .json({ success: false, message: "La fecha es requerida." });

    const availability = await Availability.findOne({
      counselor: req.params.counselorId,
    });
    if (!availability)
      return res.json({ success: true, slots: [], bookedSlots: [] });

    if (availability.blockedDates.includes(date)) {
      return res.json({ success: true, slots: [], bookedSlots: [] });
    }

    const dayNames = [
      "domingo",
      "lunes",
      "martes",
      "miercoles",
      "jueves",
      "viernes",
      "sabado",
    ];
    const dayOfWeek = dayNames[new Date(date + "T12:00:00").getDay()];
    const daySchedule = availability.weeklySchedule[dayOfWeek];

    if (!daySchedule?.enabled || !daySchedule.slots?.length) {
      return res.json({ success: true, slots: [], bookedSlots: [] });
    }

    const Appointment = require("../models/Appointment");
    const startOfDay = new Date(date + "T00:00:00.000Z");
    const endOfDay = new Date(date + "T23:59:59.999Z");

    const existingAppointments = await Appointment.find({
      counselor: req.params.counselorId,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ["confirmed", "pending"] },
    });

    const bookedSlots = existingAppointments.map((a) => a.time);
    const allSlots = daySchedule.slots.map((s) => s.start);
    const availableSlots = allSlots.filter(
      (slot) => !bookedSlots.includes(slot),
    );

    res.json({ success: true, slots: availableSlots, bookedSlots, allSlots });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error al obtener slots." });
  }
};

module.exports = { getAvailability, updateAvailability, getAvailableSlots };
