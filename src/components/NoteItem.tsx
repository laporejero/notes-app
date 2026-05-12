import type { JSX } from "react"
import type { Note } from "../types"
// icons
import { IonIcon } from "@ionic/react"
import { trashOutline, star, starOutline } from "ionicons/icons"

type NoteItemProps = {
    note: Note
    deleteNote: (id: number) => void
    toggleFavorites: (id: number) => void
}

function NoteItem({ note, deleteNote, toggleFavorites }: NoteItemProps): JSX.Element {
    const checkboxId = `checkbox-${note.id}`

    return (
        <li className="note">
            <h5>{note.title}</h5>
            <p>{note.note}</p>
            <div className="icons">
                {/* <input 
                    type="checkbox" 
                    id={checkboxId} 
                    onChange={() => toggleFavorites(note.id)} 
                    checked={note.isFavorite} 
                /> */}
                <IonIcon 
                    icon={note.isFavorite ? star : starOutline}
                    id={checkboxId}
                    style={{
                        color: note.isFavorite ? "gold" : ""
                    }}
                    onClick={() => toggleFavorites(note.id)} 
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
        </li>
    )
}

export default NoteItem