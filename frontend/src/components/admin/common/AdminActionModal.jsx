import React from 'react';
import { Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const AdminActionModal = ({ isOpen, onClose, title, message }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogClose onClick={onClose} />
        
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            {title}
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm font-sans text-muted-foreground leading-relaxed">
            {message || 'This feature is currently under development for the Admin Portal. Check back later!'}
          </p>
        </div>

        {/* Footer */}
        <DialogFooter className="bg-muted/30 border-t border-border">
          <Button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-sans font-bold tracking-wide transition-colors shadow-sm"
          >
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminActionModal;

