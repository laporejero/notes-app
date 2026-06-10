require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Note = require('./models/note')

const app = express()

app.use(express.json())
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Fetch all data
app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

// Fetch a single note
app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
        response.json(note)
    })
})

// Adding a new note
app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.title?.trim()) {
        return response.status(400).json({ error: 'title missing'})
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

    note.save().then(savedNote => {
        response.json(savedNote)
    })
})

// Update a note
app.put('/api/notes/:id', (request, response) => {
    const id = request.params.id
    const body = request.body

    if (!body.title?.trim()) {
        return response.status(400).json({ error: 'title missing'})
    }
    if (!body.note?.trim()) {
        return response.status(400).json({ error: 'note missing' })
    }

    const updatedNote = {
        title: body.title,
        note: body.note,
        isFavorite: body.isFavorite,
        pinned: body.pinned,
        createdAt: body.createdAt
    }

    Note.findByIdAndUpdate(id, updatedNote, { new: true })
        .then(updated => {
            response.json(updated)
        })
})

// Deleting a note
app.delete('/api/notes/:id', (request, response) => {
    Note.findByIdAndDelete(request.params.id)
        .then(result => {
            if (result) {
                response.status(204).end()
            } else {
                response.status(404).json({ error: 'note not found' })
            }
        })
})

// Catch all for undefined routes
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})