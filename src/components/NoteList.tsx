import type { JSX } from "react"
import type { Note } from "../types"
import NoteItem from "./NoteItem"

type NoteListProps = {
    notes: Note[]
    deleteNote: (id: number) => void
    toggleFavorites: (id: number) => void
    editingNoteId: number | undefined
    setEditingNoteId: (id: number) => void
    editText: string
    setEditText: (value: string) => void
    handleSave: (id: number) => void
}

function NoteList({ notes, deleteNote, toggleFavorites, editingNoteId, setEditingNoteId, editText, setEditText, handleSave }: NoteListProps): JSX.Element {
    return (
        <div className="note-list-container">
            <ul>
                {notes.map(note => (
                    <NoteItem 
                        key={note.id} 
                        note={note} 
                        toggleFavorites={toggleFavorites} 
                        deleteNote={deleteNote} 
                        editingNoteId={editingNoteId}
                        setEditingNoteId={setEditingNoteId}
                        editText={editText}
                        setEditText={setEditText}
                        handleSave={handleSave}
                    />
                ))}
            </ul>
        </div>
    )
}

export default NoteList