import React from 'react';
import { BadgeCheck } from 'lucide-react';

const BatchVerifyFAB = ({ count = 5, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 px-6 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full flex items-center justify-center gap-3 shadow-lg shadow-primary/30 transition-transform hover:-translate-y-1 active:translate-y-0 outline-none focus-visible:ring-4 focus-visible:ring-primary/40 z-50"
    >
      <BadgeCheck className="w-5 h-5" />
      <span className="text-sm font-sans font-semibold tracking-wide">
        Batch Verify ({count})
      </span>
    </button>
  );
};

export default BatchVerifyFAB;
