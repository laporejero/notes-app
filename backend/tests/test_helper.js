const Note = require('../models/note')

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

module.exports = { initialNotes, notesInDb, nonExistingId }