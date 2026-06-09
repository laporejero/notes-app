import { useEffect, useState } from "react"
import axios from "axios"

// Types
import type { Note, Filter, Sort } from "./types"

// Components
import Navbar from "./components/Navbar"
import NoteList from "./components/NoteList"
import NoteForm from "./components/NoteForm"
import NoteFilter from "./components/NoteFilter"
import NoteSort from "./components/NoteSort"
import UndoButton from "./components/UndoButton/UndoButton"

function App() {
  // States
  const [notes, setNotes] = useState<Note[]>([])
  const [filter, setFilter] = useState<Filter>("All")
  const [sort, setSort] = useState<Sort>("Newest")
  const [search, setSearch] = useState<string>("")
  const [history, setHistory] = useState<Note[]>([])
  const [showUndo, setShowUndo] = useState<boolean>(false)

  useEffect(() => {
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        setNotes(response.data)
      })
  }, [])

  // Add Note function
  function addNote(title:string, body:string):void {
    if (!title.trim() || !body.trim()) {
      alert("Invalid input")
      return
    }

    const newNote:Note = {
      id: Date.now(),
      title: title,
      note: body,
      isFavorite: false,
      pinned: false
    }

    axios
      .post('http://localhost:3001/notes', newNote)
      .then(response => {
        setNotes(notes.concat(response.data))
      })
  }

  function deleteNote(id:number):void {
    const noteToDelete = notes.find(note => note.id === id)

    if (!noteToDelete) return

    axios
      .delete(`http://localhost:3001/notes/${id}`)
      .then(() => {
        // save current notes
        setHistory(prevHistory => [...prevHistory, noteToDelete])

        // delete note
        setNotes(prevNotes => 
          prevNotes.filter(note => note.id !== id)
        )

        // show undo button
        setShowUndo(true)
      })
  }

  function undoDelete():void {
    const lastDeleted:Note = history[history.length - 1]

    if (!lastDeleted) return

    axios
      .post('http://localhost:3001/notes', lastDeleted)
      .then(response => {
        setNotes(prevNotes => [...prevNotes, response.data])

        setHistory(prevHistory => {
          const newHistory:Note[] = prevHistory.slice(0, -1)

          if (newHistory.length === 0) {
            setShowUndo(false)
          }

          return newHistory
        })
      })
      .catch(err => {
        console.error('Undo failed:', err)
      })
  }

  useEffect(() => {
    if (!showUndo) return

    const timer = setTimeout(() => {
      setShowUndo(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [showUndo])

  // Toggle Favorite note function
  function toggleFavorites(id:number):void {
    const note:Note|undefined = notes.find(n => n.id === id)

    if (!note) return

    const changedNote:Note = { ...note, isFavorite: !note.isFavorite }

    axios
      .put(`http://localhost:3001/notes/${id}`, changedNote)
      .then(() => {
        setNotes(prevNotes =>
          prevNotes.map(note => 
            note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
          ))  
      })
  }

  // Toggle Pin note function
  function togglePin(id:number):void {
    const note:Note|undefined = notes.find(n => n.id === id)

    if (!note) return

    const changedNote:Note = { ...note, pinned: !note.pinned }

    axios
      .put(`http://localhost:3001/notes/${id}`, changedNote)
      .then(() => {
        setNotes(prevNotes =>
          prevNotes.map(note =>
            note.id === id ? { ...note, pinned: !note.pinned } : note
          ))
      })
  }

  // Update note function
  function handleUpdateNote(id:number, updatedTitle:string, updatedText:string):void {
    const note:Note|undefined = notes.find(note => note.id === id)

    if (!note) return
    
    const updatedNote:Note = {
      ...note,
      title: updatedTitle,
      note: updatedText
    }

    axios
      .put(`http://localhost:3001/notes/${id}`, updatedNote)
      .then(() => {
        setNotes(prevNotes =>
          prevNotes.map(note =>
              note.id === id ? updatedNote : note
            ))
      })
  }

  // Filter & Sort Notes list
  const filteredNotes = notes
    .filter(note => {
      const matchesFilter =
        filter === "Favorites" ? note.isFavorite :
        filter === "Pinned" ? note.pinned : 
        true

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
        <UndoButton undo={undoDelete} show={showUndo} />
        {content}
      </main>
    </>
  )
}

export default App