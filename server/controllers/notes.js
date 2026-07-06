const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

// Fetch all data
notesRouter.get('/', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }

    const notes = await Note.find({ user: decodedToken.id }).populate('user', { username: 1, name: 1 })
    response.json(notes)
  } catch (error) {
    next(error)
  }
})

// Fetch a single note
notesRouter.get('/:id', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }

    const note = await Note.findById(request.params.id)

    if (!note) {
      response.status(404).json({ error: 'note not found' })
    }

    if (note.user._id.toString() !== decodedToken.id) {
      return response.status(403).json({ error: 'forbidden' })
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

    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }

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

    if (note.user.toString() !== decodedToken.id) {
      return response.status(403).json({ error: 'forbidden' })
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
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }

    const note = await Note.findById(request.params.id)

    if (!note) {
      return response.status(404).json({ error: 'note not found' })
    }

    if (note.user.toString() !== decodedToken.id) {
      return response.status(403).json({ error: 'forbidden' })
    }

    await Note.findByIdAndDelete(request.params.id)

    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = notesRouter