const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Note = require('../models/note')

const api = supertest(app)

const initialNotes = [
  {
    title: "Meeting Minutes",
    note: "Discussed Q3 marketing budget. Sarah to follow up with the design team.",
    isFavorite: false,
    pinned: true
  },
  {
    title: "Project Ideas",
    note: "Brainstorming a mobile app for tracking local community volunteer events.",
    isFavorite: true,
    pinned: false
  },
]

beforeEach(async () => {
  await Note.deleteMany({})
  let noteObject = new Note(initialNotes[0])
  await noteObject.save()
  noteObject = new Note(initialNotes[1])
  await noteObject.save()
})

test('notes are returned as json', async () => {
    await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
    const response = await api.get('/api/notes')

    assert.strictEqual(response.body.length, initialNotes.length)
})

after(async () => {
    await mongoose.connection.close()
})