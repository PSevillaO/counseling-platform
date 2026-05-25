const express = require("express");
const router = express.Router();
const { getProfile, updateProfile, changePassword, resetPassword } = require("../controllers/userController");
const { protect, restrictTo } = require("../middleware/auth");

router.use(protect);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.put('/change-password', changePassword);
router.put('/:id/reset-password', restrictTo('admin'), resetPassword);

module.exports = router;