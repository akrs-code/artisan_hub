import { Link } from 'react-router-dom';
import { ShoppingCart, Package, Truck, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';

const formatPrice = (centavos) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(centavos / 100);

const SHIPPING_INFO = (shopAddress) => [
  { icon: Truck,       color: 'icon-square-secondary', title: 'Nationwide Shipping',    sub: 'Estimated 3–7 business days' },
  { icon: ShieldCheck, color: 'icon-square-primary',   title: 'Authentic Artisan Craft', sub: 'Verified heritage product' },
  { icon: MapPin,      color: 'icon-square-tertiary',  title: 'Pickup Available',        sub: shopAddress },
];

export const ProductPurchaseCard = ({
  product,
  shop,
  quantity,
  onDecrement,
  onIncrement,
  onAddToCart,
  addedFeedback,
}) => (
  <div className="card-custom !p-5 !rounded-2xl space-y-5">

    {/* Quantity stepper */}
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground">
        Quantity
      </span>
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center border border-border rounded-md overflow-hidden h-10 bg-background">
          <button
            onClick={onDecrement}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="w-10 h-full flex items-center justify-center text-foreground hover:bg-muted transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed text-lg font-light"
          >
            −
          </button>
          <div className="w-12 h-full flex items-center justify-center font-bold text-base border-x border-border font-sans">
            {quantity}
          </div>
          <button
            onClick={onIncrement}
            disabled={product.stockQuantity ? quantity >= product.stockQuantity : false}
            aria-label="Increase quantity"
            className="w-10 h-full flex items-center justify-center text-foreground hover:bg-muted transition-colors duration-150 text-lg font-light disabled:opacity-30 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
        {product.stockQuantity !== undefined && (
          <span className="text-[10px] text-muted-foreground font-sans">
            {product.stockQuantity} items available
          </span>
        )}
      </div>
    </div>

    <div className="w-full h-px bg-border" />

    {/* Shipping info */}
    <div className="space-y-3 text-sm font-body">
      {SHIPPING_INFO(shop.address).map(({ icon: Icon, color, title, sub }) => (
        <div key={title} className="flex items-center gap-3">
          <div className={`icon-square ${color} !w-8 !h-8 !rounded-md shrink-0`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <span className="font-sans font-semibold text-foreground text-xs block">{title}</span>
            <span className="text-xs text-muted-foreground">{sub}</span>
          </div>
        </div>
      ))}
    </div>

    <div className="w-full h-px bg-border" />

    {/* Subtotal + CTA */}
    <div className="flex items-center justify-between">
      <div>
        <span className="text-[10px] font-sans text-muted-foreground uppercase tracking-wider block mb-0.5">
          Subtotal
        </span>
        <span className="text-2xl font-headline font-bold text-foreground">
          {formatPrice(product.price * quantity)}
        </span>
      </div>

      <div className="flex gap-3">
        <button
          disabled={!product.inStock}
          onClick={onAddToCart}
          className={`btn-base gap-2 text-sm h-12 px-6 transition-all duration-200 ${
            !product.inStock
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : addedFeedback
              ? 'bg-secondary text-white'
              : 'btn-primary'
          }`}
        >
          {addedFeedback ? (
            <><Package className="w-4 h-4" /> Added!</>
          ) : (
            <><ShoppingCart className="w-4 h-4" /> {product.inStock ? 'Add to Cart' : 'Out of Stock'}</>
          )}
        </button>

        {addedFeedback && (
          <Link
            to="/cart"
            className="btn-base btn-outlined h-12 px-6 animate-in fade-in zoom-in duration-300"
          >
            View Cart <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        )}
      </div>
    </div>
  </div>
);
