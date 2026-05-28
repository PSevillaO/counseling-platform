const SessionNote = require('../models/SessionNote')

// GET /api/notes/:clientId — notas del counselor sobre un cliente
const getNotes = async (req, res) => {
  try {
    const notes = await SessionNote.find({
      counselor: req.user._id,
      client: req.params.clientId,
    })
      .populate('appointment', 'date time')
      .sort({ createdAt: -1 })

    res.json({ success: true, notes })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener notas.' })
  }
}

// POST /api/notes/:clientId
const createNote = async (req, res) => {
  try {
    const { content, appointmentId } = req.body

    if (!content) {
      return res.status(400).json({ success: false, message: 'El contenido es requerido.' })
    }

    const note = await SessionNote.create({
      counselor: req.user._id,
      client: req.params.clientId,
      appointment: appointmentId || null,
      content,
    })

    res.status(201).json({ success: true, note })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al crear la nota.' })
  }
}

// PUT /api/notes/:noteId
const updateNote = async (req, res) => {
  try {
    const note = await SessionNote.findOne({
      _id: req.params.noteId,
      counselor: req.user._id,
    })

    if (!note) {
      return res.status(404).json({ success: false, message: 'Nota no encontrada.' })
    }

    note.content = req.body.content || note.content
    await note.save()

    res.json({ success: true, note })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar la nota.' })
  }
}

// DELETE /api/notes/:noteId
const deleteNote = async (req, res) => {
  try {
    const note = await SessionNote.findOne({
      _id: req.params.noteId,
      counselor: req.user._id,
    })

    if (!note) {
      return res.status(404).json({ success: false, message: 'Nota no encontrada.' })
    }

    await note.deleteOne()
    res.json({ success: true, message: 'Nota eliminada.' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar la nota.' })
  }
}

module.exports = { getNotes, createNote, updateNote, deleteNote }