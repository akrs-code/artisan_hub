import React, { useEffect } from 'react';
import { X, Info } from 'lucide-react';

const AdminActionModal = ({ isOpen, onClose, title, message }) => {
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
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-card rounded-2xl border border-border shadow-xl w-full max-w-md overflow-hidden transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-base font-headline font-bold text-foreground flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm font-sans text-muted-foreground leading-relaxed">
            {message || 'This feature is currently under development for the Admin Portal. Check back later!'}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 bg-muted/30 border-t border-border">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-sans font-bold tracking-wide transition-colors shadow-sm"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminActionModal;
