import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1 && onPageChange) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages && onPageChange) onPageChange(currentPage + 1);
  };

  const getPages = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-6 mb-4">
      <button 
        onClick={handlePrev} 
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center rounded-md border border-neutral-dark/15 text-neutral-dark/60 hover:bg-neutral-dark/5 transition-colors disabled:opacity-50 cursor-pointer" 
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {getPages().map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="w-8 h-8 flex items-center justify-center text-neutral-dark/50 text-[13px] font-sans">
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            onClick={() => onPageChange && onPageChange(page)}
            className={`w-8 h-8 flex items-center justify-center rounded-md text-[13px] font-sans font-medium transition-colors cursor-pointer ${
              currentPage === page
                ? 'bg-primary text-white'
                : 'border border-neutral-dark/15 text-neutral-dark/70 hover:bg-neutral-dark/5 hover:text-neutral-dark'
            }`}
          >
            {page}
          </button>
        );
      })}

      <button 
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-md border border-neutral-dark/15 text-neutral-dark/60 hover:bg-neutral-dark/5 transition-colors disabled:opacity-50 cursor-pointer" 
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
