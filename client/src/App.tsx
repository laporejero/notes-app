import { useEffect, useState } from "react"

// Services
import noteService from "./services/notes"
import loginService from "./services/login"

// Types
import type { Note, Filter, Sort, User } from "./types"

// Components
import LoginForm from "./components/LoginForm"
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
  const [loading, setLoading] = useState<boolean>(true)
  const [user, setUser] = useState<User|null>(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNotesAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    if (!user) return

    setLoading(true)

    noteService
      .getAll()
      .then(notes => {
        setNotes(notes)
      })
      .catch(err => {
        console.error('Failed to fetch notes:', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [user])

  // login
  async function handleLogin(username:string, password:string) {
    const user = await loginService.login(username, password)
    
    window.localStorage.setItem('loggedNotesAppUser', JSON.stringify(user))

    noteService.setToken(user.token)
    setUser(user)
  }

  function handleLogout(event:any) {
    event.preventDefault()
    window.localStorage.removeItem('loggedNotesAppUser')
    noteService.setToken('')
    setUser(null)
  }

  // Add Note function
  function addNote(title:string, body:string):void {
    if (!title.trim() || !body.trim()) return

    const newNote:Note = {
      id: String(Date.now()),
      title: title,
      note: body,
      isFavorite: false,
      pinned: false,
      createdAt: new Date().toISOString()
    }

    noteService
      .create(newNote)
      .then(note => {
        setNotes(prevNotes => [...prevNotes, note])
      })
      .catch(err => {
        console.error('Failed to create note', err)
      })
  }

  // Delete note function
  function deleteNote(id:string):void {
    const noteToDelete = notes.find(note => note.id === id)

    if (!noteToDelete) return

    noteService
      .deleteNote(id)
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
      .catch(err => {
        console.error('Failed to delete note:', err)
      })
  }

  // Undo note delete
  function undoDelete():void {
    const lastDeleted:Note = history[history.length - 1]

    if (!lastDeleted) return

    noteService
      .create(lastDeleted)
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
  function toggleFavorites(id:string):void {
    const note:Note|undefined = notes.find(n => n.id === id)

    if (!note) return

    const changedNote:Note = { ...note, isFavorite: !note.isFavorite }

    noteService
      .update(id, changedNote)
      .then(() => {
        setNotes(prevNotes =>
          prevNotes.map(note => 
            note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
          ))  
      })
      .catch(err => {
        console.error('Failed to update favorite status:', err)
      })
  }

  // Toggle Pin note function
  function togglePin(id:string):void {
    const note:Note|undefined = notes.find(n => n.id === id)

    if (!note) return

    const changedNote:Note = { ...note, pinned: !note.pinned }

    noteService
      .update(id, changedNote)
      .then(() => {
        setNotes(prevNotes =>
          prevNotes.map(note =>
            note.id === id ? { ...note, pinned: !note.pinned } : note
          ))
      })
      .catch(err => {
        console.error('Failed to update pin status:', err)
      })
  }

  // Update note function
  function handleUpdateNote(id:string, updatedTitle:string, updatedText:string):void {
    const note:Note|undefined = notes.find(note => note.id === id)

    if (!note) return
    
    const updatedNote:Note = {
      ...note,
      title: updatedTitle,
      note: updatedText
    }

    noteService
      .update(id, updatedNote)
      .then(() => {
        setNotes(prevNotes =>
          prevNotes.map(note =>
              note.id === id ? updatedNote : note
            ))
      })
      .catch(err => {
        console.error('Failed to update note:', err)
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
        return Date.parse(b.createdAt) - Date.parse(a.createdAt)
      }

      if (sort === "Oldest") {
        return Date.parse(a.createdAt) - Date.parse(b.createdAt)
      }

      return 0
    })

  // Conditional rendering for Note list
  let content

  if (loading) {
    content = <p className="message-display">Loading notes...</p>
  } else if (filteredNotes.length === 0) {
    content = <p className="message-display">No notes available.</p>
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
      {user
        ? (
          <>
            <Navbar search={search} setSearch={setSearch} handleLogout={handleLogout} />
            <main>
              <NoteForm addNote={addNote} />
              <NoteFilter filter={filter} setFilter={setFilter} />
              <NoteSort sort={sort} setSort={setSort} />
              <UndoButton undo={undoDelete} show={showUndo} />
              {content}
            </main>
          </>
        )
        : (
          <LoginForm 
            handleLogin={handleLogin}
          />
        )
      }
    </>
  )
}

export default App