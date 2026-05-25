const express = require('express')
const router = express.Router()
const { getAvailability, updateAvailability, getAvailableSlots } = require('../controllers/availabilityController')
const { protect } = require('../middleware/auth')

router.get('/:counselorId', getAvailability)
router.get('/:counselorId/slots', getAvailableSlots)
router.put('/:counselorId', protect, updateAvailability)

module.exports = router