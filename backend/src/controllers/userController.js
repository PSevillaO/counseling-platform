const User = require("../models/User");

// GET /api/users/profile
const getProfile = async (req, res) => {
  res.json({ success: true, user: req.user.toPublicJSON() });
};

// PUT /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio, specialties, hourlyRate } = req.body;

    const user = await User.findById(req.user._id);

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    // Campos extra para counselors
    if (req.user.role === "counselor") {
      if (!user.counselorProfile) user.counselorProfile = {};
      if (bio !== undefined) user.counselorProfile.bio = bio;
      if (specialties !== undefined)
        user.counselorProfile.specialties = specialties;
      if (hourlyRate !== undefined)
        user.counselorProfile.hourlyRate = hourlyRate;
    }

    await user.save();

    res.json({
      success: true,
      message: "Perfil actualizado.",
      user: user.toPublicJSON(),
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error al actualizar el perfil." });
  }
};

// PUT /api/users/change-password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña actual y la nueva son requeridas.',
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La nueva contraseña debe tener al menos 6 caracteres.',
      })
    }

    const user = await User.findById(req.user._id).select('+password')
    const isValid = await user.comparePassword(currentPassword)

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña actual es incorrecta.',
      })
    }

    user.password = newPassword
    await user.save()

    res.json({ success: true, message: 'Contraseña actualizada correctamente.' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al cambiar la contraseña.' })
  }
}

// Admin: PUT /api/users/:id/reset-password
const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La nueva contraseña debe tener al menos 6 caracteres.',
      })
    }

    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado.' })
    }

    user.password = newPassword
    await user.save()

    res.json({ success: true, message: `Contraseña de ${user.firstName} reseteada correctamente.` })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al resetear la contraseña.' })
  }
}

module.exports = { getProfile, updateProfile, changePassword, resetPassword }

