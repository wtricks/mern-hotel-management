import { ReactNode, useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
}

const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
    const [showModal, setShowModal] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setShowModal(true);
        } else {
            setTimeout(() => setShowModal(false), 300); // delay for exit animation
        }
    }, [isOpen]);

    if (!showModal) return null;

    return (
        <div className={`fixed inset-0 z-50 py-10 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            <div
                className={`relative h-full max-h-max bg-white rounded-lg overflow-auto shadow-lg w-full max-w-lg mx-4 transition-transform transform duration-300 ${isOpen ? 'scale-100' : 'scale-90'}`}
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    {title && <h3 className="text-lg font-semibold">{title}</h3>}
                    <button
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        onClick={onClose}
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
