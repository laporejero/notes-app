const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// Fetch all data
notesRouter.get('/', async (request, response, next) => {
  try {
    const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
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

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

// Adding a new note
notesRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)

    if (!user) {
      return response.status(400).json({ error: 'userId missing or valid' })
    }

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
      createdAt: new Date().toISOString(),
      user: user.id
    })

    const savedNote = await note.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()

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