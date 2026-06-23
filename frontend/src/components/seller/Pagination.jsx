import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = () => {
  return (
    <div className="flex items-center justify-center gap-2 mt-12 mb-8">
      
      <button className="w-8 h-8 flex items-center justify-center rounded-md border border-neutral-dark/15 text-neutral-dark/60 hover:bg-neutral-dark/5 transition-colors disabled:opacity-50" aria-label="Previous page">
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Page Numbers */}
      <button className="w-8 h-8 flex items-center justify-center rounded-md bg-[#8C5233] text-white text-[13px] font-sans font-medium transition-colors">
        1
      </button>
      <button className="w-8 h-8 flex items-center justify-center rounded-md border border-neutral-dark/15 text-neutral-dark/70 hover:bg-neutral-dark/5 hover:text-neutral-dark text-[13px] font-sans font-medium transition-colors">
        2
      </button>
      <button className="w-8 h-8 flex items-center justify-center rounded-md border border-neutral-dark/15 text-neutral-dark/70 hover:bg-neutral-dark/5 hover:text-neutral-dark text-[13px] font-sans font-medium transition-colors">
        3
      </button>
      
      {/* Ellipsis */}
      <span className="w-8 h-8 flex items-center justify-center text-neutral-dark/50 text-[13px] font-sans">
        ...
      </span>

      <button className="w-8 h-8 flex items-center justify-center rounded-md border border-neutral-dark/15 text-neutral-dark/70 hover:bg-neutral-dark/5 hover:text-neutral-dark text-[13px] font-sans font-medium transition-colors">
        12
      </button>

      {/* Next Button */}
      <button className="w-8 h-8 flex items-center justify-center rounded-md border border-neutral-dark/15 text-neutral-dark/60 hover:bg-neutral-dark/5 transition-colors" aria-label="Next page">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
