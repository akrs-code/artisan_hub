import { Plus, Minus } from 'lucide-react';

export const QuantityControl = ({ quantity, onDecrement, onIncrement, max }) => (
  <div className="inline-flex items-center border border-border rounded-lg overflow-hidden bg-card shadow-sm h-9">
    <button
      onClick={onDecrement}
      disabled={quantity <= 1}
      aria-label="Decrease quantity"
      className="w-9 h-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
    >
      <Minus className="w-3 h-3" />
    </button>
    <span className="w-9 h-full flex items-center justify-center text-sm font-semibold font-sans text-foreground select-none border-x border-border">
      {quantity}
    </span>
    <button
      onClick={onIncrement}
      disabled={max != null && quantity >= max}
      aria-label="Increase quantity"
      className="w-9 h-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
    >
      <Plus className="w-3 h-3" />
    </button>
  </div>
);
