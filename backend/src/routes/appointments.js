const express = require("express");
const router = express.Router();

const {
  getAppointments,
  createAppointment,
  cancelAppointment,
  transferAppointment,
  createRecurringAppointments,
  completeAppointment,
} = require("../controllers/appointmentController");

const { protect, restrictTo } = require("../middleware/auth");

router.use(protect);
router.get("/", getAppointments);
router.post("/", createAppointment);
router.post(
  "/recurring",
  restrictTo("admin", "counselor"),
  createRecurringAppointments,
); // ← antes de /:id
router.put("/:id/cancel", cancelAppointment);
router.put("/:id/transfer", transferAppointment);
router.put("/:id/complete", completeAppointment);

module.exports = router;
