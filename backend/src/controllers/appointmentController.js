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

// PUT /api/appointments/:id/transfer
const transferAppointment = async (req, res) => {
  try {
    const { newCounselorId, newDate, newTime } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Cita no encontrada." });
    }

    // Verificar permisos — solo admin o el counselor dueño
    const isAdmin = req.user.role === "admin";
    const isCounselor =
      appointment.counselor.toString() === req.user._id.toString();

    if (!isAdmin && !isCounselor) {
      return res
        .status(403)
        .json({ success: false, message: "No tenés permiso." });
    }

    // Si cambia de counselor, verificar que existe
    if (newCounselorId && newCounselorId !== appointment.counselor.toString()) {
      const counselor = await User.findOne({
        _id: newCounselorId,
        role: "counselor",
      });
      if (!counselor) {
        return res
          .status(404)
          .json({ success: false, message: "Counselor no encontrado." });
      }
      appointment.counselor = newCounselorId;
    }

    // Verificar conflicto en el nuevo horario
    if (newDate || newTime) {
      const checkDate = newDate
        ? new Date(newDate + "T12:00:00")
        : appointment.date;
      const checkTime = newTime || appointment.time;

      const startOfDay = new Date(checkDate);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(checkDate);
      endOfDay.setUTCHours(23, 59, 59, 999);

      const conflict = await Appointment.findOne({
        _id: { $ne: appointment._id },
        counselor: appointment.counselor,
        date: { $gte: startOfDay, $lte: endOfDay },
        time: checkTime,
        status: { $in: ["confirmed", "pending"] },
      });

      if (conflict) {
        return res.status(400).json({
          success: false,
          message: "Ese horario ya está ocupado.",
        });
      }

      if (newDate) appointment.date = new Date(newDate + "T12:00:00");
      if (newTime) appointment.time = newTime;
    }

    await appointment.save();

    const populated = await appointment.populate([
      { path: "client", select: "firstName lastName email" },
      { path: "counselor", select: "firstName lastName counselorProfile" },
    ]);

    res.json({
      success: true,
      message: "Cita transferida correctamente.",
      appointment: populated,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error al transferir la cita." });
  }
};

// POST /api/appointments/recurring
const createRecurringAppointments = async (req, res) => {
  try {
    const {
      counselorId,
      clientId,
      startDate,
      time,
      frequency,
      endType,
      sessionsCount,
      endDate,
      notes,
    } = req.body;

    // Validaciones
    if (!counselorId || !startDate || !time || !frequency) {
      return res.status(400).json({
        success: false,
        message: "Counselor, fecha, horario y frecuencia son requeridos.",
      });
    }

    // Solo admin o counselor pueden crear periódicas
    const isAdmin = req.user.role === "admin";
    const isCounselor =
      req.user.role === "counselor" && req.user._id.toString() === counselorId;

    if (!isAdmin && !isCounselor) {
      return res
        .status(403)
        .json({ success: false, message: "No tenés permiso." });
    }

    // Verificar counselor
    const counselor = await User.findOne({
      _id: counselorId,
      role: "counselor",
    });
    if (!counselor) {
      return res
        .status(404)
        .json({ success: false, message: "Counselor no encontrado." });
    }
    const client = await User.findById(clientId);
    if (!client) {
      return res
        .status(404)
        .json({ success: false, message: "Cliente no encontrado." });
    }
    // Calcular fechas de la serie
    const dates = [];
    const start = new Date(startDate + "T12:00:00");
    const maxMonths = parseInt(process.env.MAX_RECURRING_MONTHS || 5);
    const maxDate = new Date(start);
    maxDate.setMonth(maxDate.getMonth() + maxMonths);

    const frequencyDays = {
      weekly: 7,
      biweekly: 14,
      monthly: null, // especial
    };

    let current = new Date(start);
    let count = 0;
    const maxSessions = endType === "count" ? sessionsCount : 999;

    while (count < maxSessions) {
      const dateStr = current.toISOString().split("T")[0];

      // Verificar límite de fecha
      if (endType === "date" && current > new Date(endDate + "T12:00:00"))
        break;
      if (current > maxDate) break;

      dates.push(new Date(current));
      count++;

      // Avanzar según frecuencia
      if (frequency === "monthly") {
        current = new Date(current);
        current.setMonth(current.getMonth() + 1);
      } else {
        current = new Date(current);
        current.setDate(current.getDate() + frequencyDays[frequency]);
      }
    }

    if (dates.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No se generaron fechas válidas." });
    }

    // Verificar conflictos para cada fecha
    const created = [];
    const skipped = [];

    for (const date of dates) {
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);

      const conflict = await Appointment.findOne({
        counselor: counselorId,
        date: { $gte: startOfDay, $lte: endOfDay },
        time,
        status: { $in: ["confirmed", "pending"] },
      });

      if (conflict) {
        skipped.push(date.toISOString().split("T")[0]);
        continue;
      }

      const apt = await Appointment.create({
        client: clientId,
        counselor: counselorId,
        date,
        time,
        notes,
        isRecurring: true,
      });
      created.push(apt);
    }

    res.status(201).json({
      success: true,
      message: `Se crearon ${created.length} sesiones.`,
      created: created.length,
      skipped,
    });
  } catch (error) {
    console.error("ERROR createRecurring:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al crear las sesiones periódicas.",
    });
  }
};

// PUT /api/appointments/:id/complete
const completeAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Cita no encontrada." });
    }

    const isCounselor =
      appointment.counselor.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isCounselor && !isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "No tenés permiso." });
    }

    appointment.status = "completed";
    await appointment.save();

    // Actualizar contador de sesiones del counselor
    await User.findByIdAndUpdate(appointment.counselor, {
      $inc: { "counselorProfile.totalSessions": 1 },
    });

    res.json({
      success: true,
      message: "Sesión marcada como completada.",
      appointment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error al completar la sesión." });
  }
};

module.exports = {
  getAppointments,
  createAppointment,
  cancelAppointment,
  transferAppointment,
  createRecurringAppointments,
  completeAppointment,
};
