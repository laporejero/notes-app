import type { JSX } from "react"
import type { Note } from "../types"
import NoteItem from "./NoteItem"

type NoteListProps = {
    notes: Note[]
    deleteNote: (id: number) => void
    toggleFavorites: (id: number) => void
}

function NoteList({ notes, deleteNote, toggleFavorites }: NoteListProps): JSX.Element {
    return (
        <ul>
            {notes.map(note => (
                <NoteItem 
                    key={note.id} 
                    note={note} 
                    toggleFavorites={toggleFavorites} 
                    deleteNote={deleteNote} 
                />
            ))}
        </ul>
    )
}

export default NoteList