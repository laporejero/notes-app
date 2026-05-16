import { useState } from "react"
import type { JSX } from "react"
import type { Note } from "../types"

// components
import NoteEditForm from "./NoteEditForm"

// icons
import { IonIcon } from "@ionic/react"
import { trashOutline, star, starOutline, createOutline, bookmark, bookmarkOutline } from "ionicons/icons"

type NoteItemProps = {
    note: Note
    deleteNote: (id: number) => void
    togglePin: (id: number) => void
    toggleFavorites: (id: number) => void
    handleUpdateNote: (id: number, updatedText: string) => void
}

function NoteItem({ note, deleteNote, togglePin, toggleFavorites, handleUpdateNote }: NoteItemProps): JSX.Element {

    const [editingNoteId, setEditingNoteId] = useState<number>()
    const [editText, setEditText] = useState<string>("")
    const checkboxId = `checkbox-${note.id}`

    function handleSave():void {
        handleUpdateNote(note.id, editText)
        setEditingNoteId(undefined)
        setEditText("")
    }

    function handleCancel():void {
        setEditingNoteId(undefined)
        setEditText(note.note)
    }

    return (
        <li className="note"> 
            <h5> 
                {note.title} 
                {/* Star button */}
                <IonIcon 
                    icon={note.isFavorite ? star : starOutline} 
                    id={checkboxId} 
                    style={{ marginLeft: "1rem", fontSize: "1.5rem", color: note.isFavorite ? "gold" : "" }} 
                    onClick={() => toggleFavorites(note.id)} /> 
                {/* Pin button */}
                <IonIcon 
                    icon={note.pinned ? bookmark : bookmarkOutline}
                    style={{ marginLeft: "1rem", fontSize: "1.5rem" }}
                    onClick={() => togglePin(note.id)}
                />
            </h5> 
            
            {editingNoteId === note.id ? ( 
                <> 
                    <NoteEditForm 
                        editText={editText} 
                        setEditText={setEditText} 
                        handleSave={handleSave}
                        handleCancel={handleCancel} 
                    /> 
                </> ) : ( 
                <> 
                    <p className="note-content" > 
                        {note.note} 
                    </p> 
                    <div className="icons"> 
                        <IonIcon 
                            icon={createOutline} 
                            style={{ fontSize: '1.8rem', cursor: 'pointer' }} 
                            onClick={() => { setEditingNoteId(note.id), setEditText(note.note) }} 
                        /> 
                        <IonIcon 
                            icon={trashOutline} 
                            style={{ fontSize: '1.8rem', cursor: 'pointer' }} 
                            onClick={() => deleteNote(note.id)} 
                        /> 
                    </div> 
                </> 
            )} 
        </li>
    )
}

export default NoteItem