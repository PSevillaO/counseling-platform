const express = require('express')
const router = express.Router()
const { getCounselors, toggleCounselor, getAllAppointments, getStats, createCounselor } = require('../controllers/adminController')
const { protect, restrictTo } = require('../middleware/auth')

router.use(protect)
router.use(restrictTo('admin'))

router.get('/stats', getStats)
router.get('/counselors', getCounselors)
router.post('/counselors', createCounselor)
router.put('/counselors/:id/toggle', toggleCounselor)
router.get('/appointments', getAllAppointments)

module.exports = router