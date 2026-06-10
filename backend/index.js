const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let notes = [
    {
      "id": "1",
      "title": "Grocery List",
      "note": "Buy almond milk, avocados, whole wheat bread, and coffee beans.",
      "isFavorite": false,
      "pinned": false,
      "createdAt": "2026-06-09T08:00:00.000Z"
    },
    {
      "id": "2",
      "title": "Project Ideas",
      "note": "Brainstorming a mobile app for tracking local community volunteer events.",
      "isFavorite": false,
      "pinned": true,
      "createdAt": "2026-06-09T08:30:00.000Z"
    },
    {
      "id": "3",
      "title": "Meeting Minutes",
      "note": "Discussed Q3 marketing budget. Sarah to follow up with the design team by Friday.",
      "isFavorite": false,
      "pinned": true,
      "createdAt": "2026-06-09T09:00:00.000Z"
    },
    {
      "id": "4",
      "title": "Book Recommendations",
      "note": "Read 'Atomic Habits', 'Bible' and 'Deep Work' before the end of the quarter.",
      "isFavorite": true,
      "pinned": false,
      "createdAt": "2026-06-09T09:30:00.000Z"
    },
    {
      "id": "5",
      "title": "Workout Routine",
      "note": "Monday: Legs, Wednesday: Push, Friday: Pull. Cardio on weekends.",
      "isFavorite": true,
      "pinned": false,
      "createdAt": "2026-06-09T10:00:00.000Z"
    }
];

app.get('/', (request, response) => {
    response.send('<h1>Hello from backend</h1>')
})

// Fetch all data
app.get('/api/notes', (request, response) => {
    response.json(notes)
})

// Fetch a single note
app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id
    const note = notes.find(note => note.id === id)
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
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

    const note = {
        id: String(notes.length + 1),
        title: body.title,
        note: body.note,
        isFavorite: false,
        pinned: false,
        createdAt: new Date().toISOString()
    }

    notes = notes.concat(note)

    response.json(note)
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

    const note = notes.find(note => note.id === id)

    if (!note) {
        return response.status(404).json({ error: 'note not found' })
    }

    const updatedNote = {
        ...note,
        title: body.title,
        note: body.note,
    }

    notes = notes.map(note =>
        note.id === id ? updatedNote : note
    )

    response.json(updatedNote)
})

// Deleting a note
app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
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