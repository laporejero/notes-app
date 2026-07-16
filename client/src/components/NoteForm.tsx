import { useState } from "react"
import type { JSX } from "react"

type NoteFormProps = {
    addNote: (title: string, body: string) => void
}

function NoteForm({ addNote }: NoteFormProps): JSX.Element {
    const [noteTitle, setNoteTitle] = useState<string>("")
    const [noteBody, setNoteBody] = useState<string>("")

    return (
        <form className="note-form" onSubmit={(e) => e.preventDefault()}>
            <input 
                type="text" 
                placeholder="Title"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
            />
            <input 
                type="text" 
                placeholder="Take a note..."
                value={noteBody}
                onChange={(e) => setNoteBody(e.target.value)}
            />
            <button 
                onClick={() => {
                    addNote(noteTitle, noteBody)
                    setNoteTitle("")
                    setNoteBody("")
                }}
            >
                Add Note
            </button>
        </form>
    )
}

export default NoteForm