import type { JSX } from "react"

type NoteFormProps = {
    newNote: string
    setNewNote: (value: string) => void
    noteTitle: string
    setNoteTitle: (value: string) => void
    addNote: () => void
}

function NoteForm({ newNote, setNewNote, noteTitle, setNoteTitle, addNote }: NoteFormProps): JSX.Element {
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
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
            />
            <button onClick={addNote}>Add Note</button>
        </form>
    )
}

export default NoteForm