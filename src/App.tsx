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
  const [editingNoteId, setEditingNoteId] = useState<number>()
  const [editText, setEditText] = useState<string>("")

  console.log(editText)

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])

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
    }

    setNotes(prevNotes => [...prevNotes, newItem])
  }

  function handleSaveEdit(id: number): void {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === id
        ? { ...note, note: editText } : note
      )
    )

    setEditingNoteId(undefined)
    setEditText("")
  }

  function handleCancelEdit():void {
    setEditingNoteId(undefined)
    setEditText("")
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

  let content

  if (filteredNotes.length === 0) {
    content = <p className="no-notes-message">No notes available.</p>
  } else {
    content = (
      <NoteList 
        notes={filteredNotes} 
        toggleFavorites={toggleFavorites} 
        deleteNote={deleteNote} 
        editingNoteId={editingNoteId}
        setEditingNoteId={setEditingNoteId}
        editText={editText}
        setEditText={setEditText}
        handleSaveEdit={handleSaveEdit}
        handleCancelEdit={handleCancelEdit}
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