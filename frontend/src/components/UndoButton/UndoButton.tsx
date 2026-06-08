import type { JSX } from "react"
import styles from "./UndoButton.module.css"

type UndoButtonProps = {
    undo: () => void
    show: boolean
}

function UndoButton({ undo, show }:UndoButtonProps):JSX.Element {
    return (
        <div className={`${styles.undoBtnContainer} ${show ? styles.show : ""}`}>
            <button
                className={styles.undoBtn}
                onClick={undo}
            >
                Undo Delete
            </button>
        </div>
    )
}

export default UndoButton