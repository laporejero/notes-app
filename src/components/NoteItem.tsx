import type { JSX } from "react"
import type { Note } from "../types"
// icons
import { IonIcon } from "@ionic/react"
import { trashOutline, star, starOutline, createOutline } from "ionicons/icons"

type NoteItemProps = {
    note: Note
    deleteNote: (id: number) => void
    toggleFavorites: (id: number) => void
    editingNoteId: number | undefined
    setEditingNoteId: (id: number) => void
    editText: string
    setEditText: (value: string) => void
    handleSave: (id: number) => void
}

function NoteItem({ note, deleteNote, toggleFavorites, editingNoteId, setEditingNoteId, editText, setEditText, handleSave }: NoteItemProps): JSX.Element {
    const checkboxId = `checkbox-${note.id}`

    return (
        <li className="note">
            <h5>
                {note.title}
                <IonIcon 
                    icon={note.isFavorite ? star : starOutline}
                    id={checkboxId}
                    style={{
                        marginLeft: "1rem",
                        fontSize: "1.5rem",
                        color: note.isFavorite ? "gold" : ""
                    }}
                    onClick={() => toggleFavorites(note.id)} 
                />
            </h5>

            {editingNoteId === note.id ? (
                <>
                    <input
                        className="editInput"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                    />
                    <button onClick={() => handleSave(note.id)}>
                        Save
                    </button>
                </>
            ) : (
                <>
                    <p>{note.note}</p>
                    <div className="icons">
                        <IonIcon 
                            icon={createOutline}
                            style={{
                                fontSize: '1.8rem',
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                setEditingNoteId(note.id)
                                setEditText(note.note)
                            }}
                        />
                        <IonIcon 
                            icon={trashOutline}
                            style={{
                                fontSize: '1.8rem',
                                cursor: 'pointer'
                            }}
                            onClick={() => deleteNote(note.id)}
                        />
                    </div>
                </>
            )}
        </li>
    )
}

export default NoteItem