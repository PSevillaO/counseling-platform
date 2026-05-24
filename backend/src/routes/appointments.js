const express = require("express");
const router = express.Router();
const {
  getAppointments,
  createAppointment,
  cancelAppointment,
} = require("../controllers/appointmentController");
const { protect } = require("../middleware/auth");

router.use(protect); // todas las rutas requieren login

router.get("/", getAppointments);
router.post("/", createAppointment);
router.put("/:id/cancel", cancelAppointment);

module.exports = router;
