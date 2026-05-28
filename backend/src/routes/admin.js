const express = require("express");
const router = express.Router();
const {
  getCounselors,
  toggleCounselor,
  getAllAppointments,
  getStats,
  createCounselor,
  updateCounselor,
  getClients,
} = require("../controllers/adminController");

const { protect, restrictTo } = require("../middleware/auth");

router.use(protect);
router.use(restrictTo("admin"));

router.get("/stats", getStats);
router.get("/counselors", getCounselors);
router.post("/counselors", createCounselor);
router.put("/counselors/:id/toggle", toggleCounselor);
router.get("/appointments", getAllAppointments);
router.put("/counselors/:id", updateCounselor);
router.get("/clients", getClients);

module.exports = router;
