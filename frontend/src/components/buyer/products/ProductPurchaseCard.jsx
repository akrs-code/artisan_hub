import { ShoppingCart, Minus, Plus, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

const formatPrice = (centavos) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(centavos / 100);

const TRUST_BADGES = [
  { icon: ShieldCheck, label: 'Secure Payment' },
  { icon: Truck, label: 'Fast Delivery' },
  { icon: RotateCcw, label: 'Easy Returns' },
];

export const ProductPurchaseCard = ({
  product, quantity, onDecrement, onIncrement, onAddToCart, onBuyNow, addedFeedback,
}) => (
  <div className="space-y-4">
    
    <div className="flex items-center gap-3">
      
      <div className="flex items-center border border-border rounded-full overflow-hidden bg-card shadow-sm shrink-0">
        <button
          onClick={onDecrement}
          className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
          aria-label="Decrease quantity"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="w-9 text-center text-sm font-sans font-bold text-foreground select-none">
          {quantity}
        </span>
        <button
          onClick={onIncrement}
          disabled={product.stockQuantity != null && quantity >= product.stockQuantity}
          className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Increase quantity"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      
      <button
        onClick={onAddToCart}
        disabled={!product.inStock}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-sans font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer border ${addedFeedback
            ? 'bg-secondary text-white border-secondary'
            : 'bg-primary hover:bg-primary-dark text-white border-primary'
          } disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        <ShoppingCart className="w-4 h-4" />
        {addedFeedback ? 'Added!' : 'Add to Cart'}
      </button>

      {/* Buy Now */}
      <button
        onClick={onBuyNow}
        disabled={!product.inStock}
        className="flex-1 py-2.5 rounded-full text-xs font-sans font-bold uppercase tracking-widest border border-primary text-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Buy Now
      </button>
    </div>

    {/* Trust badges */}
    <div className="grid grid-cols-3 gap-2">
      {TRUST_BADGES.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-1.5 py-3 px-2 bg-muted/30 border border-border/50 rounded-xl"
        >
          <Icon className="w-4 h-4 text-primary/70" />
          <span className="text-[9px] font-sans font-bold text-muted-foreground uppercase tracking-wider text-center leading-tight">
            {label}
          </span>
        </div>
      ))}
    </div>

    {/* Stock warning */}
    {product.inStock && product.stockQuantity != null && product.stockQuantity <= 5 && (
      <p className="text-xs font-sans text-destructive font-semibold text-center">
        Only {product.stockQuantity} left in stock!
      </p>
    )}
  </div>
);
