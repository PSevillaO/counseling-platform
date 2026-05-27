const express = require("express");
const router = express.Router();
const {
  getAppointments,
  createAppointment,
  cancelAppointment,
  transferAppointment,
} = require("../controllers/appointmentController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.get("/", getAppointments);
router.post("/", createAppointment);
router.put("/:id/cancel", cancelAppointment);
router.put("/:id/transfer", transferAppointment);

module.exports = router;
