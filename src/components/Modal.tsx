import type { JSX, ReactNode } from "react"

type ModalProps = {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
}

function Modal({ isOpen, onClose, children }: ModalProps): JSX.Element | null {
    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>
                    &times;
                </button>
                {children}
            </div>
        </div>
    )
}

export default Modal