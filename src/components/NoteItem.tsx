import { useState } from "react"
import type { JSX } from "react"
import type { Note } from "../types"
import Modal from "./Modal/Modal"

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
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

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

    function NoteTitle() {
        return (
            <h5> 
                {note.title} 
                {/* Star button */}
                <IonIcon 
                    icon={note.isFavorite ? star : starOutline} 
                    id={checkboxId} 
                    style={{ 
                        marginLeft: "1rem", 
                        fontSize: "1.5rem", 
                        color: note.isFavorite ? "gold" : "",
                        cursor: "pointer"
                    }} 
                    onClick={(e) => { 
                        e.stopPropagation()
                        toggleFavorites(note.id)
                    }} 
                /> 
                {/* Pin button */}
                <IonIcon 
                    icon={note.pinned ? bookmark : bookmarkOutline}
                    style={{ 
                        marginLeft: "1rem", 
                        fontSize: "1.5rem",
                        cursor: "pointer"
                    }}
                    onClick={(e) => {
                        e.stopPropagation()
                        togglePin(note.id)
                    }}
                />
            </h5> 
        )
    }

    return (
        <>
            {/* 1. THE VISIBLE CARD PREVIEW */}
            <li 
                className="note" 
                onClick={() => setIsModalOpen(true)}
                style={{ cursor: 'pointer' }}
            > 
                <NoteTitle />
                <p className="note-preview-text"> 
                    {note.note} 
                </p>
            </li>

            {/* 2. THE POPUP MODAL DETAILED VIEW */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} >
                <NoteTitle />
                
                {editingNoteId === note.id ? ( 
                    <NoteEditForm 
                        editText={editText} 
                        setEditText={setEditText} 
                        handleSave={handleSave}
                        handleCancel={handleCancel} 
                    /> 
                ) : ( 
                    <> 
                        <p className="note-content" > 
                            {note.note} 
                        </p> 
                        <div className="icons"> 
                            <IonIcon 
                                icon={createOutline} 
                                style={{ fontSize: '1.8rem', cursor: 'pointer' }} 
                                onClick={(e) => { 
                                    e.stopPropagation()
                                    setEditingNoteId(note.id) 
                                    setEditText(note.note) 
                                }} 
                            /> 
                            <IonIcon 
                                icon={trashOutline} 
                                style={{ fontSize: '1.8rem', cursor: 'pointer' }} 
                                onClick={(e) => {
                                    e.stopPropagation()
                                    deleteNote(note.id)
                                    setIsModalOpen(false)
                                }} 
                            /> 
                        </div> 
                    </> 
                )} 
            </Modal>
        </>
    )
}

export default NoteItem
