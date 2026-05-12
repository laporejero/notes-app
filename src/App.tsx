import { use, useActionState, useState } from "react"
import type { Note, Filter } from "./types"
import NoteList from "./components/NoteList"
import NoteForm from "./components/NoteForm"

const listsOfNotes: Note[] = [
  {
    "id": 1,
    "title": "Project Setup",
    "note": "Initialize the repository and configure the development environment.",
    "isFavorite": true
  },
  {
    "id": 2,
    "title": "Database Design",
    "note": "Create tables and relationships for user and task data.",
    "isFavorite": false
  },
  {
    "id": 3,
    "title": "API Development",
    "note": "Build REST endpoints for CRUD operations.",
    "isFavorite": false
  },
  {
    "id": 4,
    "title": "Frontend Integration",
    "note": "Connect the UI with backend services.",
    "isFavorite": true
  },
  {
    "id": 5,
    "title": "Testing",
    "note": "Write unit and integration tests for core features.",
    "isFavorite": false
  }
]

function App() {
  const [notes, setNotes] = useState<Note[]>(listsOfNotes)
  const [noteTitle, setNoteTitle] = useState<string>("")
  const [newNote, setNewNote] = useState<string>("")
  const [filter, setFilter] = useState<Filter>("All")

  function addNote(): void {
    if (!noteTitle.trim() || !newNote.trim()) {
      alert("Invalid input")
      return
    }

    const newItem: Note = {
      id: Date.now(),
      title: noteTitle,
      note: newNote,
      isFavorite: false
    }

    setNotes(prevNotes => [...prevNotes, newItem])
    setNoteTitle("")
    setNewNote("")
  }

  function deleteNote(id: number): void {
    setNotes(prevNotes => 
      prevNotes.filter(note => note.id !== id)
    )
  }

  return (
    <>
      <h1>Mini Notes App</h1>
      <NoteForm newNote={newNote} setNewNote={setNewNote} noteTitle={noteTitle} setNoteTitle={setNoteTitle} addNote={addNote} />
      <NoteList notes={notes} deleteNote={deleteNote} />
    </>
  )
}

export default App