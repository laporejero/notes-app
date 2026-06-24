const notesRouter = require('express').Router()
const Note = require('../models/note')

// Fetch all data
notesRouter.get('/', async (request, response, next) => {
  try {
    const notes = await Note.find({})
    response.json(notes)
  } catch (error) {
    next(error)
  }
})

// Fetch a single note
notesRouter.get('/:id', async (request, response, next) => {
  try {
    const note = await Note.findById(request.params.id)

    if (!note) {
      response.status(404).end()
      
    }

    response.json(note)
  } catch (error) {
    next(error)
  }
})

// Adding a new note
notesRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body
    if (!body.title?.trim()) {
      return response.status(400).json({ error: 'title missing' })
    }
    if (!body.note?.trim()) {
      return response.status(400).json({ error: 'note missing' })
    }

    const note = new Note({
      title: body.title,
      note: body.note,
      isFavorite: false,
      pinned: false,
      createdAt: new Date().toISOString()
    })

    const savedNote = await note.save()
    response.status(201).json(savedNote)
  } catch (error) {
    next(error)
  }
})

// Update a note
notesRouter.put('/:id', async (request, response, next) => {
  try {
    const body = request.body

    if (!body.title?.trim()) {
      return response.status(400).json({ error: 'title missing' })
    }
    if (!body.note?.trim()) {
      return response.status(400).json({ error: 'note missing' })
    }

    const note = await Note.findById(request.params.id)

    if (!note) {
      return response.status(404).end()
    }

    note.title = body.title
    note.note = body.note
    note.isFavorite = body.isFavorite
    note.pinned = body.pinned

    const updatedNote = await note.save()
    response.json(updatedNote)
  } catch (error) {
    next(error)
  }
})

// Deleting a note
notesRouter.delete('/:id', async (request, response, next) => {
  try {
    const note = await Note.findByIdAndDelete(request.params.id)

    if (!note) {
      return response.status(404).json({ error: 'note not found' })
    }

    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = notesRouter