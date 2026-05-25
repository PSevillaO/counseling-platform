const User = require('../models/User')
const Appointment = require('../models/Appointment')

// GET /api/admin/counselors
const getCounselors = async (req, res) => {
  try {
    const counselors = await User.find({ role: 'counselor' }).select('-password')
    res.json({ success: true, counselors })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener counselors.' })
  }
}

// PUT /api/admin/counselors/:id/toggle
const toggleCounselor = async (req, res) => {
  try {
    const counselor = await User.findById(req.params.id)
    if (!counselor || counselor.role !== 'counselor') {
      return res.status(404).json({ success: false, message: 'Counselor no encontrado.' })
    }
    counselor.isActive = !counselor.isActive
    await counselor.save()
    res.json({
      success: true,
      message: `Counselor ${counselor.isActive ? 'activado' : 'desactivado'}.`,
      counselor: counselor.toPublicJSON(),
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar counselor.' })
  }
}

// GET /api/admin/appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('client', 'firstName lastName email')
      .populate('counselor', 'firstName lastName')
      .sort({ date: -1 })
    res.json({ success: true, appointments })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener citas.' })
  }
}

// GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const totalCounselors = await User.countDocuments({ role: 'counselor' })
    const activeCounselors = await User.countDocuments({ role: 'counselor', isActive: true })
    const totalClients = await User.countDocuments({ role: 'client' })
    const totalAppointments = await Appointment.countDocuments()
    const confirmedAppointments = await Appointment.countDocuments({ status: 'confirmed' })

    res.json({
      success: true,
      stats: {
        totalCounselors,
        activeCounselors,
        totalClients,
        totalAppointments,
        confirmedAppointments,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener estadísticas.' })
  }
}

module.exports = { getCounselors, toggleCounselor, getAllAppointments, getStats }