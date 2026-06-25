import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info } from 'lucide-react';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  isDestructive = false, 
  confirmText = "Confirm", 
  cancelText = "Cancel" 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogClose onClick={onClose} />
        
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isDestructive ? (
              <AlertTriangle className="w-5 h-5 text-destructive" />
            ) : (
              <Info className="w-5 h-5 text-primary" />
            )}
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <p className="text-sm font-sans text-muted-foreground leading-relaxed">
            {message}
          </p>
        </div>

        <DialogFooter className="bg-muted/30 border-t border-border flex justify-end gap-3 p-4">
          <Button variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <Button
            variant={isDestructive ? "destructive" : "default"}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
