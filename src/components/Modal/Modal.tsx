import type { JSX, ReactNode } from "react"
import styles from "./Modal.module.css"

type ModalProps = {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
}

function Modal({ isOpen, onClose, children }: ModalProps): JSX.Element | null {
    if (!isOpen) return null

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.modalCloseBtn} onClick={onClose}>
                    &times;
                </button>
                {children}
            </div>
        </div>
    )
}

export default Modal