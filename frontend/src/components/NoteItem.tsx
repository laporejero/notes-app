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
    deleteNote: (id:string) => void
    togglePin: (id:string) => void
    toggleFavorites: (id:string) => void
    handleUpdateNote: (id:string, updatedTitle: string, updatedText: string) => void
}

function NoteItem({ note, deleteNote, togglePin, toggleFavorites, handleUpdateNote }: NoteItemProps): JSX.Element {

    const [editingNoteId, setEditingNoteId] = useState<string>()
    const [editTitle, setEditTitle] = useState<string>("")
    const [editText, setEditText] = useState<string>("")
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    const checkboxId = `checkbox-${note.id}`

    function handleSave():void {
        if (!editTitle.trim() || !editText.trim()) return

        handleUpdateNote(note.id, editTitle, editText)
        setEditingNoteId(undefined)
        setEditTitle("")
        setEditText("")
    }

    function handleCancel():void {
        setEditingNoteId(undefined)
        setEditTitle(note.title)
        setEditText(note.note)
    }

    function NoteTitle() {
        return (
            <h5> 
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between"
                    }}
                >
                    <div>
                        {note.title} 
                        {/* Star button */}
                        <IonIcon 
                            icon={note.isFavorite ? star : starOutline} 
                            id={checkboxId} 
                            style={{ 
                                marginLeft: "1rem", 
                                fontSize: isModalOpen ? "2rem" : "1.5rem", 
                                color: note.isFavorite ? "gold" : "",
                                cursor: "pointer"
                            }} 
                            onClick={(e) => { 
                                e.stopPropagation()
                                toggleFavorites(note.id)
                            }} 
                            title="Favorite"
                        /> 
                        {/* Pin button */}
                        <IonIcon 
                            icon={note.pinned ? bookmark : bookmarkOutline}
                            style={{ 
                                marginLeft: "1rem", 
                                fontSize: isModalOpen ? "2rem" : "1.5rem",
                                cursor: "pointer"
                            }}
                            onClick={(e) => {
                                e.stopPropagation()
                                togglePin(note.id)
                            }}
                            title="Pin"
                        />
                    </div>
                </div>
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
                <div style={{
                    display: "flex",
                    justifyContent: "space-between"
                }}>
                    <div>
                        <NoteTitle />
                    </div>
                    <div className="child">
                        {/* Delete Button */}
                        <IonIcon 
                            icon={trashOutline}
                            style={{ 
                                fontSize: isModalOpen ? "2rem" : "1.5rem", 
                                cursor: 'pointer' }}
                            onClick={(e) => {
                                e.stopPropagation()
                                deleteNote(note.id)
                            }}
                            title="Delete"
                        />
                    </div>
                </div>
                <p className="note-preview-text"> 
                    {note.note} 
                </p>
            </li>

            {/* 2. THE POPUP MODAL DETAILED VIEW */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} >
                
                {editingNoteId === note.id ? ( 
                    <NoteEditForm 
                        editTitle={editTitle}
                        setEditTitle={setEditTitle}
                        editText={editText} 
                        setEditText={setEditText} 
                        handleSave={handleSave}
                        handleCancel={handleCancel} 
                    /> 
                ) : ( 
                    <> 
                        <NoteTitle />
                        <p className="note-content" > 
                            {note.note} 
                        </p> 
                        <div className="icons"> 
                            <IonIcon 
                                icon={createOutline} 
                                style={{ fontSize: '2.5rem', cursor: 'pointer' }} 
                                onClick={(e) => { 
                                    e.stopPropagation()
                                    setEditingNoteId(note.id) 
                                    setEditTitle(note.title)
                                    setEditText(note.note) 
                                }} 
                                title="Edit"
                            /> 
                            <IonIcon 
                                icon={trashOutline} 
                                style={{ fontSize: '2.5rem', cursor: 'pointer' }} 
                                onClick={(e) => {
                                    e.stopPropagation()
                                    deleteNote(note.id)
                                    setIsModalOpen(false)
                                }} 
                                title="Delete"
                            /> 
                        </div> 
                    </> 
                )} 
            </Modal>
        </>
    )
}

export default NoteItem
