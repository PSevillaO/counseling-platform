const User = require("../models/User");

// GET /api/counselors
const getCounselors = async (req, res) => {
  try {
    const { specialty, search } = req.query;

    const filter = { role: "counselor", isActive: true };

    if (specialty) {
      filter["counselorProfile.specialties"] = { $in: [specialty] };
    }

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ];
    }

    const counselors = await User.find(filter).select("-password");

    res.json({
      success: true,
      count: counselors.length,
      counselors,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error al obtener counselors." });
  }
};

// GET /api/counselors/:id
const getCounselorById = async (req, res) => {
  try {
    const counselor = await User.findOne({
      _id: req.params.id,
      role: "counselor",
      isActive: true,
    }).select("-password");

    if (!counselor) {
      return res
        .status(404)
        .json({ success: false, message: "Counselor no encontrado." });
    }

    res.json({ success: true, counselor });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error al obtener el counselor." });
  }
};

module.exports = { getCounselors, getCounselorById };
