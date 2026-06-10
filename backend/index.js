require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Note = require('./models/note')

const app = express()

app.use(express.json())
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Fetch all data
app.get('/api/notes', (request, response, next) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
    .catch(error => next(error))
})

// Fetch a single note
app.get('/api/notes/:id', (request, response, next) => {
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
app.post('/api/notes', (request, response, next) => {
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
      response.json(savedNote)
    })
    .catch(error => next(error))
})

// Update a note
app.put('/api/notes/:id', (request, response, next) => {
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
app.delete('/api/notes/:id', (request, response, next) => {
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

// Catch all for undefined routes
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// Error handling middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  return response.status(500).send({ error: 'internal server error' })
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})