import { useEffect, useState } from "react"

// Services
import noteService from "./services/notes"
import loginService from "./services/login"
import userService from "./services/user"

// Types
import type { Note, Filter, Sort, User } from "./types"

// Components
import LoginForm from "./components/LoginForm"
import RegisterForm from "./components/RegisterForm"
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
  const [user, setUser] = useState<User|null>(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNotesAppUser')
    return loggedUserJSON ? JSON.parse(loggedUserJSON) : null
  })
  const [showRegister, setShowRegister] = useState<boolean>(false)
  const [successMessage, setSuccessMessage] = useState<string|null>(null)

  useEffect(() => {
    if (user) {
      noteService.setToken(user.token)
    }
  }, [user])

  useEffect(() => {
    if (!user) return

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

  function handleLogout(event:React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    window.localStorage.removeItem('loggedNotesAppUser')
    noteService.setToken('')
    setUser(null)
  }

  async function handleRegister(username:string, name:string, password:string) {
    await userService.create({username, name, password})

    setSuccessMessage('Account created successfully. Please sign in.')
    setShowRegister(false)
  }

  async function addNote(title:string, body:string):Promise<void> {
    if (!title.trim() || !body.trim()) return

    try {
      const newNote:Note = {
        id: String(Date.now()),
        title: title,
        note: body,
        isFavorite: false,
        pinned: false,
        createdAt: new Date().toISOString()
      }

      const note = await noteService.create(newNote)
      setNotes(prevNotes => [...prevNotes, note])
    } catch (error) {
      console.error('Failed to create note', error)
    }
    
  }

  async function deleteNote(id:string):Promise<void> {
    const noteToDelete = notes.find(note => note.id === id)
    if (!noteToDelete) return

    try {
      await noteService.deleteNote(id)
      setHistory(prevHistory => [...prevHistory, noteToDelete])
      setNotes(prevNotes =>
        prevNotes.filter(note => note.id !== id)
      )
      setShowUndo(true)
    } catch (error) {
      console.error('Failed to delete note:', error)
    }
  }

  async function undoDelete():Promise<void> {
    const lastDeleted:Note = history[history.length - 1]
    if (!lastDeleted) return

    try {
      const lastDeletedNote = await noteService.create(lastDeleted)
      setNotes(prevNotes => [...prevNotes, lastDeletedNote])

      const newHistory = history.slice(0, -1)
      setHistory(newHistory)
      setShowUndo(newHistory.length > 0)
    } catch (error) {
      console.error('Undo failed:', error)
    }
  }

  useEffect(() => {
    if (!showUndo) return

    const timer = setTimeout(() => {
      setShowUndo(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [showUndo])

  // Toggle Favorite note function
  async function toggleFavorites(id:string):Promise<void> {
    const note:Note|undefined = notes.find(n => n.id === id)

    if (!note) return

    const changedNote:Note = { ...note, isFavorite: !note.isFavorite }

    try {
      const updatedNote = await noteService.update(id, changedNote)
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === id ? updatedNote : note
        )
      )
    } catch (error) {
      console.error('Failed to update favorite status:', error)
    }
  }

  // Toggle Pin note function
  async function togglePin(id:string):Promise<void> {
    const note:Note|undefined = notes.find(n => n.id === id)

    if (!note) return

    const changedNote:Note = { ...note, pinned: !note.pinned }

    try {
      const updatedNote = await noteService.update(id, changedNote)
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === id ? updatedNote : note
        )
      )
    } catch (error) {
      console.log('Failed to update pin status:', error)
    }
  }

  // Update note function
  async function handleUpdateNote(id:string, updatedTitle:string, updatedText:string):Promise<void> {
    const note:Note|undefined = notes.find(note => note.id === id)

    if (!note) return
    
    const updatedNote:Note = {
      ...note,
      title: updatedTitle,
      note: updatedText
    }

    try {
      const savedNote = await noteService.update(id, updatedNote)
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === id ? savedNote : note
        )
      )
    } catch (error) {
      console.error('Failed to update note:', error)
    }
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
        : showRegister ? (
          <RegisterForm 
            onRegister={handleRegister} 
            goToLogin={() => setShowRegister(false)} 
          />
        ) : (
          <LoginForm 
            handleLogin={handleLogin} 
            goToRegister={() => setShowRegister(true)}
            successMessage={successMessage}
            setSuccessMessage={setSuccessMessage}
          />
        )
      }
    </>
  )
}

export default App