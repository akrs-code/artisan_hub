import { Plus, Minus } from 'lucide-react';

export const QuantityControl = ({ quantity, onDecrement, onIncrement }) => (
  <div className="flex items-center border border-border rounded-lg overflow-hidden h-8 bg-background shadow-sm">
    <button
      onClick={onDecrement}
      disabled={quantity <= 1}
      aria-label="Decrease quantity"
      className="w-8 h-full flex items-center justify-center text-foreground hover:bg-muted transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
    >
      <Minus className="w-2.5 h-2.5" />
    </button>
    <div className="w-9 h-full flex items-center justify-center font-bold text-xs border-x border-border font-sans select-none">
      {quantity}
    </div>
    <button
      onClick={onIncrement}
      aria-label="Increase quantity"
      className="w-8 h-full flex items-center justify-center text-foreground hover:bg-muted transition-colors duration-150"
    >
      <Plus className="w-2.5 h-2.5" />
    </button>
  </div>
);
