import React from 'react';
import { Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const ActionModal = ({ isOpen, onClose, title, message }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogClose onClick={onClose} />
        
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-neutral-dark">
            <Info className="w-5 h-5 text-primary" />
            {title}
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div className="p-6">
          <p className="text-[14px] font-sans text-neutral-dark/70 leading-relaxed">
            {message || "This feature is currently under development. Check back later!"}
          </p>
        </div>

        {/* Footer */}
        <DialogFooter className="bg-neutral-dark/5 border-t border-neutral-dark/10">
          <Button
            onClick={onClose}
            className="px-6 py-2.5 rounded-md bg-[#8C5233] hover:bg-[#7E4A2E] text-white text-[13px] font-sans font-bold tracking-wide transition-colors shadow-sm"
          >
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActionModal;

