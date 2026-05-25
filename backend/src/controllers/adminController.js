const User = require("../models/User");
const Appointment = require("../models/Appointment");

// GET /api/admin/counselors
const getCounselors = async (req, res) => {
  try {
    const counselors = await User.find({ role: "counselor" }).select(
      "-password",
    );
    res.json({ success: true, counselors });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error al obtener counselors." });
  }
};

// PUT /api/admin/counselors/:id/toggle
const toggleCounselor = async (req, res) => {
  try {
    const counselor = await User.findById(req.params.id);
    if (!counselor || counselor.role !== "counselor") {
      return res
        .status(404)
        .json({ success: false, message: "Counselor no encontrado." });
    }
    counselor.isActive = !counselor.isActive;
    await counselor.save();
    res.json({
      success: true,
      message: `Counselor ${counselor.isActive ? "activado" : "desactivado"}.`,
      counselor: counselor.toPublicJSON(),
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error al actualizar counselor." });
  }
};

// GET /api/admin/appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("client", "firstName lastName email")
      .populate("counselor", "firstName lastName")
      .sort({ date: -1 });
    res.json({ success: true, appointments });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error al obtener citas." });
  }
};

// GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const totalCounselors = await User.countDocuments({ role: "counselor" });
    const activeCounselors = await User.countDocuments({
      role: "counselor",
      isActive: true,
    });
    const totalClients = await User.countDocuments({ role: "client" });
    const totalAppointments = await Appointment.countDocuments();
    const confirmedAppointments = await Appointment.countDocuments({
      status: "confirmed",
    });

    res.json({
      success: true,
      stats: {
        totalCounselors,
        activeCounselors,
        totalClients,
        totalAppointments,
        confirmedAppointments,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error al obtener estadísticas." });
  }
};

// POST /api/admin/counselors
const createCounselor = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      bio,
      specialties,
      hourlyRate,
    } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Nombre, apellido, email y contraseña son requeridos.",
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un usuario con ese email.",
      });
    }

    const counselor = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: "counselor",
      counselorProfile: {
        bio: bio || "",
        specialties: specialties || [],
        hourlyRate: hourlyRate || 0,
        rating: 0,
        totalSessions: 0,
      },
    });

    res.status(201).json({
      success: true,
      message: "Counselor creado exitosamente.",
      counselor: counselor.toPublicJSON(),
    });
  } catch (error) {
    console.error("ERROR createCounselor:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error al crear el counselor." });
  }
};

const updateCounselor = async (req, res) => {
  try {
    const { firstName, lastName, bio, specialties, hourlyRate } = req.body;
    const counselor = await User.findById(req.params.id);

    if (!counselor || counselor.role !== "counselor") {
      return res
        .status(404)
        .json({ success: false, message: "Counselor no encontrado." });
    }

    if (firstName) counselor.firstName = firstName;
    if (lastName) counselor.lastName = lastName;
    if (!counselor.counselorProfile) counselor.counselorProfile = {};
    if (bio !== undefined) counselor.counselorProfile.bio = bio;
    if (specialties !== undefined)
      counselor.counselorProfile.specialties = specialties;
    if (hourlyRate !== undefined)
      counselor.counselorProfile.hourlyRate = hourlyRate;

    await counselor.save();

    res.json({
      success: true,
      message: "Counselor actualizado.",
      counselor: counselor.toPublicJSON(),
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error al actualizar el counselor." });
  }
};
module.exports = {
  getCounselors,
  toggleCounselor,
  getAllAppointments,
  getStats,
  createCounselor,
  updateCounselor,
};
