import { useEffect, useState } from "react"
import type { Note, Filter } from "./types"
import NoteList from "./components/NoteList"
import NoteForm from "./components/NoteForm"
import NoteFilter from "./components/NoteFilter"

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
  // states
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem("notes")
      return saved ? JSON.parse(saved) : listsOfNotes
    } catch (error) {
      console.error("Failed to parse notes:", error)
      return listsOfNotes
    }
  })
  const [noteTitle, setNoteTitle] = useState<string>("")
  const [newNote, setNewNote] = useState<string>("")
  const [filter, setFilter] = useState<Filter>("All")

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])

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

  function toggleFavorites(id: number): void {
    setNotes(prevNotes =>
      prevNotes.map(note => 
        note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
      )
    )
  }

  const filteredNotes = notes.filter(note => {
    if (filter === "Favorites") return note.isFavorite
    return true
  })

  let content

  if (filteredNotes.length === 0) {
    content = <p>No notes available.</p>
  } else {
    content = (
      <NoteList notes={filteredNotes} toggleFavorites={toggleFavorites} deleteNote={deleteNote} />
    )
  }

  return (
    <>
      <h2>Notes App</h2>
      <NoteForm newNote={newNote} setNewNote={setNewNote} noteTitle={noteTitle} setNoteTitle={setNoteTitle} addNote={addNote} />
      <NoteFilter filter={filter} setFilter={setFilter} />
      {content}
    </>
  )
}

export default App