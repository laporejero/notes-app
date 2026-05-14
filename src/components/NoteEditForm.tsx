import type { JSX } from "react"
import type { Note } from "../types"

type NoteEditFormProps = {
    note: Note
    editText: string
    setEditText: (v: string) => void
    handleSaveEdit: (id: number) => void
    handleCancelEdit: () => void
}

function NoteEditForm({ note, editText, setEditText, handleSaveEdit, handleCancelEdit }: NoteEditFormProps): JSX.Element {
    return (
        <form className="edit-form">
            <textarea
                className="editInput"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
            />
            <button 
                type="button"
                className="edit-form-btn"
                onClick={() => handleSaveEdit(note.id)}
            >
                Save
            </button>
            <button 
                type="button"
                className="edit-form-btn"
                onClick={() => handleCancelEdit()}
            >
                Cancel
            </button>
        </form>
    )
}

export default NoteEditForm