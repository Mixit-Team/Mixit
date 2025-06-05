import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: React.ReactNode;
  buttonText?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, message, buttonText = '확인' }) => {
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
          {/* Button */}
          <button
            onClick={onClose}
            className="w-full rounded-md bg-[#FF6B00] py-3 font-normal text-white"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </>
  );
};

export default Modal;
