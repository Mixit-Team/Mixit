import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string | React.ReactNode;
  buttonText?: string;
  onConfirm?: () => void;
  cancelText?: string;
  isLoading?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  buttonText,
  onConfirm,
  cancelText,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black opacity-20" />

      {/* Modal */}
      <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
        <div className="pointer-events-auto relative w-full max-w-sm rounded-md bg-white p-4 shadow-md">
          {/* Header */}
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-base font-medium text-gray-800">{title}</h2>
            <button onClick={onClose} className="text-gray-400">
              <X size={16} />
            </button>
          </div>
          {/* Message */}
          <div className="mb-5 text-center text-sm whitespace-pre-line text-gray-700">
            {message}
          </div>
          {/* Buttons */}
          <div className={`flex ${cancelText ? 'space-x-2' : ''}`}>
            {cancelText && (
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 rounded-md border border-gray-300 bg-white py-1.5 font-normal text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={onConfirm ? onConfirm : onClose}
              disabled={isLoading}
              className={`${
                cancelText ? 'flex-1' : 'w-full'
              } rounded-md bg-[#FF6B00] py-1.5 font-normal text-white hover:bg-[#E55C00] disabled:opacity-50`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  처리중...
                </div>
              ) : (
                buttonText
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
