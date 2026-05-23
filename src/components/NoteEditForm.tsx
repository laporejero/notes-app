import type { JSX } from "react"
// Icons
import { IonIcon } from "@ionic/react"
import { checkmark, close } from "ionicons/icons"; 

type NoteEditFormProps = {
    editTitle: string
    setEditTitle: (v: string) => void
    editText: string
    setEditText: (v: string) => void
    handleSave: () => void
    handleCancel: () => void
}

function NoteEditForm({ editTitle, setEditTitle, editText, setEditText, handleSave, handleCancel }: NoteEditFormProps): JSX.Element {
    return (
        <form className="edit-form">
            <input
                type="text"
                className="edit-title-input"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
            />
            <textarea
                className="edit-note-input"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
            />
            <div className="edit-form-btn-container">
                <IonIcon 
                    icon={checkmark}
                    style={{  
                        fontSize: "2.5rem",
                        cursor: "pointer"
                    }}
                    onClick={() => handleSave()}
                    title="Save Edit"
                />
                <IonIcon 
                    icon={close}
                    style={{ 
                        marginLeft: "1rem", 
                        fontSize: "2.5rem",
                        cursor: "pointer"
                    }}
                    onClick={() => handleCancel()}
                    title="Cancel Edit"
                />
            </div>
        </form>
    )
}

export default NoteEditForm