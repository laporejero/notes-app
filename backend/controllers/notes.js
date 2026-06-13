const notesRouter = require('express').Router()
const Note = require('../models/note')

// Fetch all data
notesRouter.get('/', (request, response, next) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
    .catch(error => next(error))
})

// Fetch a single note
notesRouter.get('/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Adding a new note
notesRouter.post('/', (request, response, next) => {
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

  note.save()
    .then(savedNote => {
      response.status(201).json(savedNote)
    })
    .catch(error => next(error))
})

// Update a note
notesRouter.put('/:id', (request, response, next) => {
  const body = request.body

  if (!body.title?.trim()) {
    return response.status(400).json({ error: 'title missing' })
  }
  if (!body.note?.trim()) {
    return response.status(400).json({ error: 'note missing' })
  }

  Note.findById(request.params.id)
    .then(note => {
      if (!note) {
        return response.status(404).end()
      }

      note.title = body.title
      note.note = body.note
      note.isFavorite = body.isFavorite
      note.pinned = body.pinned

      return note.save().then((updatedNote) => {
        response.json(updatedNote)
      })
    })
    .catch(error => next(error))
})

// Deleting a note
notesRouter.delete('/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      if (result) {
        response.status(204).end()
      } else {
        response.status(404).json({ error: 'note not found' })
      }
    })
    .catch(error => next(error))
})

module.exports = notesRouter