const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')

const Note = require('../models/note')
const User = require('../models/user')

const helper = require('./test_helper')

const api = supertest(app)

let token

beforeEach(async () => {
    await Note.deleteMany({})
    await User.deleteMany({})

    await helper.createUser(api)
    const login = await helper.login(api)
    token = login.token

    for (const note of helper.initialNotes) {
        await api
            .post('/api/notes')
            .set(helper.authHeader(token))
            .send(note)
            .expect(201)
    }
})

describe('when there are initially some notes', () => {
    test('notes are returned as json', async () => {
        await api
            .get('/api/notes')
            .set(helper.authHeader(token))
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all initial notes are returned', async () => {
        const response = await api
            .get('/api/notes')
            .set(helper.authHeader(token))
            .expect(200)
        
        assert.strictEqual(response.body.length, helper.initialNotes.length)
    })

    test('a specific note can be viewed', async () => {
        const notesAtStart = await helper.notesInDb()

        const noteToView = notesAtStart[0]

        const response = await api
            .get(`/api/notes/${noteToView.id}`)
            .set(helper.authHeader(token))
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        assert.deepStrictEqual(response.body, noteToView)
    })

    test('fails with status code 404 if note does not exist', async () => {
        const nonExistingId = await helper.nonExistingId()

        await api
            .get(`/api/notes/${nonExistingId}`)
            .set(helper.authHeader(token))
            .expect(404)
    })

    test('fails with status code 400 if id is invalid', async () => {
        const invalidId = '12345'

        await api
            .get(`/api/notes/${invalidId}`)
            .set(helper.authHeader(token))
            .expect(400)
    })

    test('a valid note can be added', async () => {
        const newNote = {
            title: 'Test Note',
            note: 'This note was created during testing.',
        }

        await api
            .post('/api/notes')
            .set(helper.authHeader(token))
            .send(newNote)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const notesAtEnd = await helper.notesInDb()

        assert.strictEqual(
            notesAtEnd.length,
            helper.initialNotes.length + 1
        )

        const titles = notesAtEnd.map(note => note.title)

        assert(titles.includes('Test Note'))
    })

    test('note without a title is not added', async () => {
        const newNote = {
            note: 'Missing title',
        }

        await api
            .post('/api/notes')
            .set(helper.authHeader(token))
            .send(newNote)
            .expect(400)

        const notesAtEnd = await helper.notesInDb()

        assert.strictEqual(
            notesAtEnd.length,
            helper.initialNotes.length
        )
    })

    test('note without a token is not added', async () => {
        const newNote = {
            title: 'Unauthorized Note',
            note: 'This should not be created.',
            isFavorite: false,
            pinned: false
        }

        await api
            .post('/api/notes')
            .send(newNote)
            .expect(401)

        const notesAtEnd = await helper.notesInDb()

        assert.strictEqual(
            notesAtEnd.length,
            helper.initialNotes.length
        )
    })

    test('a note can be updated', async () => {
        const notesAtStart = await helper.notesInDb()
        const noteToUpdate = notesAtStart[0]

        const updatedNote = {
            ...noteToUpdate,
            title: 'Updated Meeting Minutes'
        }

        await api
            .put(`/api/notes/${noteToUpdate.id}`)
            .set(helper.authHeader(token))
            .send(updatedNote)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const notesAtEnd = await helper.notesInDb()

        const updated = notesAtEnd.find(note => note.id === noteToUpdate.id)

        assert.strictEqual(updated.title, 'Updated Meeting Minutes')
    })

    test('a note without a token cannot be updated', async () => {
        const notesAtStart = await helper.notesInDb()
        const noteToUpdate = notesAtStart[0]

        const updatedNote = {
            ...noteToUpdate,
            title: 'Updated Without Token'
        }

        await api
            .put(`/api/notes/${noteToUpdate.id}`)
            .send(updatedNote)
            .expect(401)

        const notesAtEnd = await helper.notesInDb()

        const unchanged = notesAtEnd.find(note => note.id === noteToUpdate.id)

        assert.strictEqual(unchanged.title, noteToUpdate.title)
    })

    test('updating a non-existing note returns 404', async () => {
        const nonExistingId = await helper.nonExistingId()

        const updatedNote = {
            title: 'Updated Title',
            note: 'Updated Note',
            isFavorite: false,
            pinned: false
        }

        await api
            .put(`/api/notes/${nonExistingId}`)
            .set(helper.authHeader(token))
            .send(updatedNote)
            .expect(404)
    })

    test('updating a note with an invalid id returns 400', async () => {
        const invalidId = '12345'

        const updatedNote = {
            title: 'Updated Title',
            note: 'Updated Note',
            isFavorite: false,
            pinned: false
        }

        await api
            .put(`/api/notes/${invalidId}`)
            .set(helper.authHeader(token))
            .send(updatedNote)
            .expect(400)
    })

    test('a note can be deleted', async () => {
        const notesAtStart = await helper.notesInDb()
        const noteToDelete = notesAtStart[0]

        await api
            .delete(`/api/notes/${noteToDelete.id}`)
            .set(helper.authHeader(token))
            .expect(204)

        const notesAtEnd = await helper.notesInDb()

        assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1)

        const ids = notesAtEnd.map(note => note.id)

        assert(!ids.includes(noteToDelete.id))
    })

    test('a note without a token cannot be deleted', async () => {
        const notesAtStart = await helper.notesInDb()
        const noteToDelete = notesAtStart[0]

        await api
            .delete(`/api/notes/${noteToDelete.id}`)
            .expect(401)

        const notesAtEnd = await helper.notesInDb()

        assert.strictEqual(
            notesAtEnd.length,
            notesAtStart.length
        )

        const ids = notesAtEnd.map(note => note.id)

        assert(ids.includes(noteToDelete.id))
    })

    test('deleting a non-existing note returns 404', async () => {
        const nonExistingId = await helper.nonExistingId()

        await api
            .delete(`/api/notes/${nonExistingId}`)
            .set(helper.authHeader(token))
            .expect(404)
    })

    test('deleting a note with an invalid id returns 400', async () => {
        const invalidId = '12345'

        await api
            .delete(`/api/notes/${invalidId}`)
            .set(helper.authHeader(token))
            .expect(400)
    })
})

after(async () => {
    await mongoose.connection.close()
})