import { ShoppingCart, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { QuantityStepper } from '../../ui/quantity-stepper';
import { Button } from '@/components/ui/button';

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
  <div className="glass-card p-5 mt-8 space-y-4">
    {/* Qty + Add */}
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Quantity control */}
      <QuantityStepper
        quantity={quantity}
        onDecrement={onDecrement}
        onIncrement={onIncrement}
        max={product.stockQuantity}
        size="md"
      />

      {/* Add to Cart */}
      <Button
        onClick={onAddToCart}
        disabled={!product.inStock}
        className={`flex-1 ${addedFeedback ? 'bg-green-600 hover:bg-green-600 text-white' : ''}`}
      >
        <ShoppingCart className="w-4 h-4 mr-2" />
        {addedFeedback ? 'Added to Cart!' : 'Add to Cart'}
      </Button>
    </div>

    {/* Buy Now */}
    <Button
      variant="outline"
      onClick={onBuyNow}
      disabled={!product.inStock}
      className="w-full border-primary text-primary hover:bg-primary/5"
    >
      Buy Now
    </Button>

    {/* Stock warning */}
    {product.inStock && product.stockQuantity != null && product.stockQuantity <= 5 && (
      <div className="flex items-center justify-center p-2.5 bg-destructive/10 border border-destructive/20 rounded-xl">
        <span className="relative flex h-2.5 w-2.5 mr-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive"></span>
        </span>
        <p className="text-xs font-sans text-destructive font-bold uppercase tracking-widest">
          Only {product.stockQuantity} left in stock!
        </p>
      </div>
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
