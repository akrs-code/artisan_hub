import React from 'react';
import { BadgeCheck } from 'lucide-react';

const BatchVerifyFAB = ({ count = 5, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="fixed bottom-8 right-8 px-6 h-14 bg-[#8C5233] hover:bg-[#7E4A2E] text-white rounded-full flex items-center justify-center gap-3 shadow-[0_8px_20px_rgba(140,82,51,0.4)] transition-transform hover:-translate-y-1 active:translate-y-0 outline-none focus-visible:ring-4 focus-visible:ring-primary/40 z-50"
    >
      <BadgeCheck className="w-6 h-6" />
      <span className="text-[14px] font-sans font-bold tracking-wide">
        Batch Verify ({count})
      </span>
    </button>
  );
};

export default BatchVerifyFAB;
