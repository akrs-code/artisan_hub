import React from 'react';
import { Check, XCircle, CornerRightUp } from 'lucide-react';

const BulkActionOverlay = ({ selectedCount = 4, onActionClick }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-8 fade-in duration-300">
      <div className="bg-white rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-neutral-dark/10 px-4 py-3 flex items-center gap-6">
        
        
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-full bg-[#EBE5D9] flex items-center justify-center text-[#8C5233] font-headline font-bold text-[13px]">
            {selectedCount}
          </div>
          <span className="text-[10px] font-sans font-bold tracking-widest uppercase text-neutral-dark">
            SELECTED
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-neutral-dark/10"></div>

        {/* Quick Actions */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => onActionClick('Approve')}
            className="flex items-center gap-2 text-[10px] font-sans font-bold tracking-widest uppercase text-neutral-dark/60 hover:text-neutral-dark transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            APPROVE
          </button>
          <button 
            onClick={() => onActionClick('Reject')}
            className="flex items-center gap-2 text-[10px] font-sans font-bold tracking-widest uppercase text-destructive hover:text-red-700 transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" />
            REJECT
          </button>
          <button 
            onClick={() => onActionClick('Escalate')}
            className="flex items-center gap-2 text-[10px] font-sans font-bold tracking-widest uppercase text-neutral-dark/60 hover:text-neutral-dark transition-colors"
          >
            <CornerRightUp className="w-3.5 h-3.5" />
            ESCALATE
          </button>
        </div>

        {/* Primary Action */}
        <button 
          onClick={() => onActionClick('Bulk Resolve')}
          className="ml-2 px-6 py-2.5 rounded-full bg-[#8C5233] hover:bg-[#7E4A2E] text-white text-[13px] font-sans font-bold transition-colors shadow-sm"
        >
          Bulk Resolve
        </button>
      </div>
    </div>
  );
};

export default BulkActionOverlay;
