import React, { useEffect } from 'react';
import { X, Info } from 'lucide-react';

const ActionModal = ({ isOpen, onClose, title, message }) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-dark/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Dialog */}
      <div className="relative bg-background rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-dark/10">
          <h3 className="text-lg font-headline font-bold text-neutral-dark flex items-center gap-2">
            <Info className="w-5 h-5 text-[#8C5233]" />
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="text-neutral-dark/50 hover:text-neutral-dark hover:bg-neutral-dark/5 rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#8C5233]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-[14px] font-sans text-neutral-dark/70 leading-relaxed">
            {message || "This feature is currently under development. Check back later!"}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 bg-neutral-dark/5 border-t border-neutral-dark/10">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-md bg-[#8C5233] hover:bg-[#7E4A2E] text-white text-[13px] font-sans font-bold tracking-wide transition-colors shadow-sm"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;
