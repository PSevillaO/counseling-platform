const express = require('express')
const router = express.Router()
const { getCounselors, getCounselorById, getCounselorClients } = require('../controllers/counselorController')
const { protect } = require('../middleware/auth')

router.get('/', getCounselors)
router.get('/:id', getCounselorById)
router.get('/:id/clients', protect, getCounselorClients)

module.exports = router