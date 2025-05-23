import React from 'react';

export default function Modal({ open, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg p-6 w-96">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl hover:text-gray-700"
          aria-label="Close modal"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
