import React from 'react';
import { Check, XCircle, CornerRightUp } from 'lucide-react';

const BulkActionOverlay = ({ selectedCount = 4, onActionClick }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-8 fade-in duration-300">
      <div className="bg-card rounded-full shadow-xl border border-border px-4 py-3 flex items-center gap-5">
        {/* Count Badge */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-headline font-bold text-sm">
            {selectedCount}
          </div>
          <span className="text-[10px] font-sans font-bold tracking-widest uppercase text-foreground">
            Selected
          </span>
        </div>

        <div className="w-px h-8 bg-border" />

        {/* Quick Actions */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => onActionClick('Approve')}
            className="flex items-center gap-1.5 text-[10px] font-sans font-bold tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            Approve
          </button>
          <button
            onClick={() => onActionClick('Reject')}
            className="flex items-center gap-1.5 text-[10px] font-sans font-bold tracking-widest uppercase text-destructive hover:text-destructive/70 transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" />
            Reject
          </button>
          <button
            onClick={() => onActionClick('Escalate')}
            className="flex items-center gap-1.5 text-[10px] font-sans font-bold tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            <CornerRightUp className="w-3.5 h-3.5" />
            Escalate
          </button>
        </div>

        {/* Primary Action */}
        <button
          onClick={() => onActionClick('Bulk Resolve')}
          className="ml-1 px-5 py-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-sans font-semibold transition-colors shadow-sm"
        >
          Bulk Resolve
        </button>
      </div>
    </div>
  );
};

export default BulkActionOverlay;
