import type { JSX } from "react"
import type { Note } from "../types"
import NoteItem from "./NoteItem"

type NoteListProps = {
    notes: Note[]
    deleteNote: (id: number) => void
}

function NoteList({ notes, deleteNote }: NoteListProps): JSX.Element {
    return (
        <ul>
            {notes.map(note => (
                <NoteItem key={note.id} note={note} deleteNote={deleteNote} />
            ))}
        </ul>
    )
}

export default NoteList