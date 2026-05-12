import type { JSX } from "react"
import type { Note } from "../types"

type NoteItemProps = {
    note: Note
    deleteNote: (id: number) => void
}

function NoteItem({ note, deleteNote }: NoteItemProps): JSX.Element {
    return (
        <li>
            <h3>{note.title}</h3>
            <p>{note.note}</p>
            <button onClick={() => deleteNote(note.id)}>Delete Note</button>
        </li>
    )
}

export default NoteItem