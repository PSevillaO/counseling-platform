const Appointment = require("../models/Appointment");
const User = require("../models/User");

// GET /api/appointments — listar citas del usuario logueado
const getAppointments = async (req, res) => {
  try {
    const filter =
      req.user.role === "client"
        ? { client: req.user._id }
        : { counselor: req.user._id };

    const appointments = await Appointment.find(filter)
      .populate("client", "firstName lastName email")
      .populate("counselor", "firstName lastName counselorProfile")
      .sort({ date: 1 });

    res.json({ success: true, appointments });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error al obtener citas." });
  }
};

// POST /api/appointments — crear una cita
const createAppointment = async (req, res) => {
  try {
    const { counselorId, date, time, notes } = req.body;

    if (!counselorId || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Counselor, fecha y horario son requeridos.",
      });
    }

    // Verificar que el counselor existe
    const counselor = await User.findOne({
      _id: counselorId,
      role: "counselor",
    });
    if (!counselor) {
      return res
        .status(404)
        .json({ success: false, message: "Counselor no encontrado." });
    }

    // Verificar que no hay otra cita en ese horario
    const startOfDay = new Date(date + "T00:00:00.000Z");
    const endOfDay = new Date(date + "T23:59:59.999Z");

    const existingAppointment = await Appointment.findOne({
      counselor: counselorId,
      date: { $gte: startOfDay, $lte: endOfDay },
      time,
      status: { $in: ["pending", "confirmed"] },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "Ese horario ya está reservado. Elegí otro.",
      });
    }

    const appointment = await Appointment.create({
      client: req.user._id,
      counselor: counselorId,
      date: new Date(date),
      time,
      notes,
    });

    const populated = await appointment.populate([
      { path: "client", select: "firstName lastName email" },
      { path: "counselor", select: "firstName lastName counselorProfile" },
    ]);

    res.status(201).json({
      success: true,
      message: "Sesión reservada exitosamente.",
      appointment: populated,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error al crear la cita." });
  }
};

// PUT /api/appointments/:id/cancel — cancelar una cita
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Cita no encontrada." });
    }

    // Solo el cliente dueño o el counselor pueden cancelar
    const isOwner =
      appointment.client.toString() === req.user._id.toString() ||
      appointment.counselor.toString() === req.user._id.toString();

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "No tenés permiso para cancelar esta cita.",
      });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.json({ success: true, message: "Cita cancelada.", appointment });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error al cancelar la cita." });
  }
};

module.exports = { getAppointments, createAppointment, cancelAppointment };
