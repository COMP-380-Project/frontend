import {Button} from "./Button";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    description: string;
    confirmButtonText: string;
    cancelButtonText?: string;
    onConfirm: () => void;
    onClose: () => void;
}

export function ConfirmModal({
    isOpen,
    title,
    description,
    confirmButtonText,
    cancelButtonText = "Cancel",
    onConfirm,
    onClose,
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div 
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4"
        >
            <div 
                className="w-full max-w-md rounded-lg bg-white shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-gray-200 p-4">
                  <h2 className="text-lg font-semibold text-gray-800">{title}</h2>  
                </div>
                <div className="p-4">
                    <p className="mb-6 text-gray-600">{description}</p>
                    <div className="flex justify-end space-x-2">
                        <Button variant="secondary" onClick={onClose}>
                            {cancelButtonText}
                        </Button>
                        <Button 
                            variant="primary" 
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                        >
                            {confirmButtonText}
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
}