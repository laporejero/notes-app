import { useEffect, useState } from "react"
import type { Note, Filter } from "./types"
import Navbar from "./components/Navbar"
import NoteList from "./components/NoteList"
import NoteForm from "./components/NoteForm"
import NoteFilter from "./components/NoteFilter"

function App() {
  // states
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem("notes")
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error("Failed to parse notes:", error)
      return []
    }
  })
  const [noteTitle, setNoteTitle] = useState<string>("")
  const [newNote, setNewNote] = useState<string>("")
  const [filter, setFilter] = useState<Filter>("All")
  const [search, setSearch] = useState<string>("")

  console.log(search)

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
    const matchesFavorite =
      filter === "Favorites" ? note.isFavorite : true

    const matchesSearch =
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.note.toLowerCase().includes(search.toLowerCase())

    return matchesFavorite && matchesSearch
  })

  let content

  if (filteredNotes.length === 0) {
    content = <p className="no-notes-message">No notes available.</p>
  } else {
    content = (
      <NoteList notes={filteredNotes} toggleFavorites={toggleFavorites} deleteNote={deleteNote} />
    )
  }

  return (
    <>
      <Navbar search={search} setSearch={setSearch} />
      <main>
        <NoteForm newNote={newNote} setNewNote={setNewNote} noteTitle={noteTitle} setNoteTitle={setNoteTitle} addNote={addNote} />
        <NoteFilter filter={filter} setFilter={setFilter} />
        {content}
      </main>
    </>
  )
}

export default App