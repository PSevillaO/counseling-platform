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

module.exports = { getProfile, updateProfile };
