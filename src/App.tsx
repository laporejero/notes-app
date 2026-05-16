import { useEffect, useState } from "react"

// Types
import type { Note, Filter, Sort } from "./types"

// Components
import Navbar from "./components/Navbar"
import NoteList from "./components/NoteList"
import NoteForm from "./components/NoteForm"
import NoteFilter from "./components/NoteFilter"
import NoteSort from "./components/NoteSort"

function App() {
  // States
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem("notes")
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error("Failed to parse notes:", error)
      return []
    }
  })
  const [filter, setFilter] = useState<Filter>("All")
  const [sort, setSort] = useState<Sort>("Newest")
  const [search, setSearch] = useState<string>("")

  // Update localStorage everytime state variable notes change
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])

  // Add Note function
  function addNote(title: string, body: string): void {
    if (!title.trim() || !body.trim()) {
      alert("Invalid input")
      return
    }

    const newItem: Note = {
      id: Date.now(),
      title: title,
      note: body,
      isFavorite: false,
      pinned: false
    }

    setNotes(prevNotes => [...prevNotes, newItem])
  }

  function deleteNote(id: number): void {
    setNotes(prevNotes => 
      prevNotes.filter(note => note.id !== id)
    )
  }

  // Toggle Favorite note function
  function toggleFavorites(id: number): void {
    setNotes(prevNotes =>
      prevNotes.map(note => 
        note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
      )
    )
  }

  // Toggle Pin note function
  function togglePin(id: number) {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === id ? { ...note, pinned: !note.pinned } : note
      )
    )
  }

  // Update note function
  function handleUpdateNote(id: number, updatedText: string): void {
    setNotes(prevNotes =>
    prevNotes.map(note =>
        note.id === id
        ? { ...note, note: updatedText } : note
      )
    )
  }

  // Filter & Sort Notes list
  const filteredNotes = notes
    .filter(note => {
      const matchesFilter =
        filter === "Favorites" ? note.isFavorite : true

      const matchesSearch =
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.note.toLowerCase().includes(search.toLowerCase())

      return matchesFilter && matchesSearch
    })
    .sort((a, b) => {
      if (b.pinned !== a.pinned) {
        return Number(b.pinned) - Number(a. pinned)
      }

      if (sort === "Favorites") {
        return Number(b.isFavorite) - Number(a.isFavorite)
      }

      if (sort === "Newest") {
        return b.id - a.id
      }

      if (sort === "Oldest") {
        return a.id - b.id
      }

      return 0
    })

  // Conditional rendering for Note list
  let content
  if (filteredNotes.length === 0) {
    content = <p className="no-notes-message">No notes available.</p>
  } else {
    content = (
      <NoteList 
        notes={filteredNotes} 
        togglePin={togglePin}
        toggleFavorites={toggleFavorites} 
        deleteNote={deleteNote} 
        handleUpdateNote={handleUpdateNote}
      />
    )
  }

  return (
    <>
      <Navbar search={search} setSearch={setSearch} />
      <main>
        <NoteForm addNote={addNote} />
        <NoteFilter filter={filter} setFilter={setFilter} />
        <NoteSort sort={sort} setSort={setSort} />
        {content}
      </main>
    </>
  )
}

export default App