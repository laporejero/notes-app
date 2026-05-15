import type { JSX } from "react"
import type { Note } from "../types"

// components
import NoteEditForm from "./NoteEditForm"

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
    handleSaveEdit: (id: number) => void
    handleCancelEdit: () => void
}

function NoteItem({ 
            note, 
            deleteNote, 
            toggleFavorites, 
            editingNoteId, 
            setEditingNoteId, 
            editText, 
            setEditText, 
            handleSaveEdit,
            handleCancelEdit
        }: NoteItemProps): JSX.Element {
    const checkboxId = `checkbox-${note.id}`

    return (
        <li className="note"> 
            <h5> 
                {note.title} 
                <IonIcon icon={note.isFavorite ? star : starOutline} 
                id={checkboxId} 
                style={{ marginLeft: "1rem", fontSize: "1.5rem", color: note.isFavorite ? "gold" : "" }} 
                onClick={() => toggleFavorites(note.id)} /> 
            </h5> 
            
            {editingNoteId === note.id ? ( 
                <> 
                    <NoteEditForm 
                        note={note} 
                        editText={editText} 
                        setEditText={setEditText} 
                        handleSaveEdit={handleSaveEdit} 
                        handleCancelEdit={handleCancelEdit} 
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