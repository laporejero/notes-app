import type { JSX } from "react"
import type { Note } from "../types"
import NoteItem from "./NoteItem"

type NoteListProps = {
    notes: Note[]
    deleteNote: (id: number) => void
    toggleFavorites: (id: number) => void
    handleUpdateNote: (id: number, updatedText: string) => void
}

function NoteList({ 
            notes, 
            deleteNote, 
            toggleFavorites, 
            handleUpdateNote
        }: NoteListProps): JSX.Element {
    return (
        <div className="note-list-container">
            <ul>
                {notes.map(note => (
                    <NoteItem 
                        key={note.id} 
                        note={note} 
                        toggleFavorites={toggleFavorites} 
                        deleteNote={deleteNote} 
                        handleUpdateNote={handleUpdateNote}
                    />
                ))}
            </ul>
        </div>
    )
}

export default NoteList