import React from 'react';
import { Plus, Minus } from 'lucide-react';

export const QuantityStepper = ({ 
  quantity, 
  onDecrement, 
  onIncrement, 
  min = 1, 
  max, 
  size = 'md' 
}) => {
  const isSm = size === 'sm';
  const btnSize = isSm ? 'w-9' : 'w-11';
  const containerHeight = isSm ? 'h-9 rounded-lg' : 'h-11 rounded-xl';
  const iconSize = isSm ? 'w-3 h-3' : 'w-3.5 h-3.5';

  return (
    <div className={`inline-flex items-center border border-border overflow-hidden bg-card shadow-sm shrink-0 ${containerHeight}`}>
      <button
        onClick={onDecrement}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
        className={`${btnSize} h-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer`}
      >
        <Minus className={iconSize} />
      </button>
      <span className={`${btnSize} h-full flex items-center justify-center text-sm font-semibold font-sans text-foreground select-none border-x border-border`}>
        {quantity}
      </span>
      <button
        onClick={onIncrement}
        disabled={max != null && quantity >= max}
        aria-label="Increase quantity"
        className={`${btnSize} h-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer`}
      >
        <Plus className={iconSize} />
      </button>
    </div>
  );
};
