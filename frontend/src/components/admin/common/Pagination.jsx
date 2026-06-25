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
    <div className="flex items-center justify-center gap-1.5">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40 cursor-pointer"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {getPages().map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="w-8 h-8 flex items-center justify-center text-muted-foreground text-xs font-sans">
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            onClick={() => onPageChange && onPageChange(page)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-sans font-semibold transition-colors cursor-pointer ${
              currentPage === page
                ? 'bg-primary text-primary-foreground'
                : 'border border-border text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40 cursor-pointer"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
