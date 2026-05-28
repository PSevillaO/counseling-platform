const express = require('express')
const router = express.Router()
const { getNotes, createNote, updateNote, deleteNote } = require('../controllers/noteController')
const { protect, restrictTo } = require('../middleware/auth')

router.use(protect)
router.use(restrictTo('counselor', 'admin'))

router.get('/:clientId', getNotes)
router.post('/:clientId', createNote)
router.put('/:noteId', updateNote)
router.delete('/:noteId', deleteNote)

module.exports = router