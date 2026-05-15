import type { JSX } from "react"
import type { Note } from "../types"

type NoteEditFormProps = {
    note: Note
    editText: string
    setEditText: (v: string) => void
    handleSave: () => void
    handleCancel: () => void
}

function NoteEditForm({ note, editText, setEditText, handleSave, handleCancel }: NoteEditFormProps): JSX.Element {
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
                onClick={() => handleSave()}
            >
                Save
            </button>
            <button 
                type="button"
                className="edit-form-btn"
                onClick={() => handleCancel()}
            >
                Cancel
            </button>
        </form>
    )
}

export default NoteEditForm