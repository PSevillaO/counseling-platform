const express = require("express");
const router = express.Router();
const {
  getCounselors,
  getCounselorById,
} = require("../controllers/counselorController");

router.get("/", getCounselors);
router.get("/:id", getCounselorById);

module.exports = router;
