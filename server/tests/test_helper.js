const Note = require('../models/note')
const User = require('../models/user')

const initialNotes = [
  {
    title: "Meeting Minutes",
    note: "Discussed Q3 marketing budget. Sarah to follow up with the design team.",
  },
  {
    title: "Project Ideas",
    note: "Brainstorming a mobile app for tracking local community volunteer events.",
  },
]

const nonExistingId = async () => {
  const note = new Note({ 
    title: 'willremovethissoon',
    note: 'willremovethisnotesoon'
  })
  await note.save()
  await note.deleteOne()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const createUser = async (api, user = {}) => {
  const newUser = {
    name: 'Test User',
    username: 'testuser',
    password: 'password123',
    ...user
  }

  const response = await api.post('/api/users').send(newUser)
  
  return response.body
}

const login = async (api, credentials = {}) => {
  const loginData = {
    username: 'testuser',
    password: 'password123',
    ...credentials
  }

  const response = await api
    .post('/api/login')
    .send(loginData)

  return response.body
}

const authHeader = token => ({
  Authorization: `Bearer ${token}`
})

module.exports = { 
  initialNotes, 
  notesInDb, 
  nonExistingId, 
  usersInDb, 
  createUser, 
  login, 
  authHeader 
}