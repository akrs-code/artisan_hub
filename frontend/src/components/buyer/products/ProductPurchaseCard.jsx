import { ShoppingCart, Minus, Plus, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

const formatPrice = (centavos) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(centavos / 100);

const TRUST_BADGES = [
  { icon: ShieldCheck, label: 'Secure Payment' },
  { icon: Truck,       label: 'Fast Delivery'  },
  { icon: RotateCcw,   label: 'Easy Returns'   },
];

export const ProductPurchaseCard = ({
  product, quantity, onDecrement, onIncrement, onAddToCart, onBuyNow, addedFeedback,
}) => (
  <div className="space-y-4">
    {/* Qty + Add */}
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Quantity control */}
      <div className="inline-flex items-center border border-border rounded-xl overflow-hidden bg-card shadow-sm shrink-0 h-11">
        <button
          onClick={onDecrement}
          className="w-11 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          aria-label="Decrease quantity"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="w-11 text-center text-sm font-semibold font-sans text-foreground select-none border-x border-border">
          {quantity}
        </span>
        <button
          onClick={onIncrement}
          disabled={product.stockQuantity != null && quantity >= product.stockQuantity}
          className="w-11 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Increase quantity"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Add to Cart */}
      <button
        onClick={onAddToCart}
        disabled={!product.inStock}
        className={`flex-1 flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-sans font-semibold transition-all cursor-pointer ${
          addedFeedback
            ? 'bg-green-600 text-white'
            : 'bg-primary hover:bg-primary/90 text-white shadow-sm'
        } disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        <ShoppingCart className="w-4 h-4" />
        {addedFeedback ? 'Added to Cart!' : 'Add to Cart'}
      </button>
    </div>

    {/* Buy Now */}
    <button
      onClick={onBuyNow}
      disabled={!product.inStock}
      className="w-full h-11 rounded-xl border border-primary text-primary hover:bg-primary/5 text-sm font-sans font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
    >
      Buy Now
    </button>

    {/* Stock warning */}
    {product.inStock && product.stockQuantity != null && product.stockQuantity <= 5 && (
      <p className="text-xs font-sans text-destructive font-semibold text-center">
        Only {product.stockQuantity} left in stock!
      </p>
    )}

    {/* Divider */}
    <div className="border-t border-border/60 pt-3">
      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-2">
        {TRUST_BADGES.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1.5 py-3 px-2 bg-muted/40 border border-border/50 rounded-xl"
          >
            <Icon className="w-4 h-4 text-primary/70" />
            <span className="text-[9px] font-sans font-semibold text-muted-foreground text-center leading-tight">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);
