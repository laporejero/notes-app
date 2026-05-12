import type { JSX } from "react"
import type { Note } from "../types"

type NoteItemProps = {
    note: Note
    deleteNote: (id: number) => void
    toggleFavorites: (id: number) => void
}

function NoteItem({ note, deleteNote, toggleFavorites }: NoteItemProps): JSX.Element {
    const checkboxId = `checkbox-${note.id}`

    return (
        <li>
            <input 
                type="checkbox" 
                id={checkboxId} 
                onChange={() => toggleFavorites(note.id)} 
                checked={note.isFavorite} 
            />
            <h3>{note.title}</h3>
            <p>{note.note}</p>
            <button onClick={() => deleteNote(note.id)}>Delete Note</button>
        </li>
    )
}

export default NoteItem