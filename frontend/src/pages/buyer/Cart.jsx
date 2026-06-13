import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { CartItem } from '@/components/buyer/cart/CartItem';
import { EmptyCart } from '@/components/buyer/cart/EmptyCart';

const formatPrice = (c) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(c / 100);

const SHIPPING_FEE = 15000;

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, updateItemOptions, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) return <EmptyCart />;

  const grandTotal = cartTotal + SHIPPING_FEE;

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 w-full animate-in fade-in duration-500">
      {/* Breadcrumb */}
      

      {/* Page Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className=" text-primary-dark text-3xl font-headline font-bold text-foreground tracking-tight mb-1">
            Shopping Cart
          </h1>
          <p className="text-muted-foreground font-sans text-xs">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-[10px] font-sans font-bold text-destructive hover:text-destructive/80 transition-colors duration-200 uppercase tracking-widest"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Table */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-card border border-border/80 rounded-2xl overflow-hidden shadow-[var(--shadow-soft)]">
            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-[56px_1fr_auto_auto_32px] gap-4 items-center px-5 py-3 bg-muted/30 border-b border-border/60">
              <span className="text-[9px] font-sans font-bold text-muted-foreground uppercase tracking-widest">Item</span>
              <span className="text-[9px] font-sans font-bold text-muted-foreground uppercase tracking-widest">Details</span>
              <span className="text-[9px] font-sans font-bold text-muted-foreground uppercase tracking-widest text-center">Qty</span>
              <span className="text-[9px] font-sans font-bold text-muted-foreground uppercase tracking-widest text-right">Total</span>
              <span />
            </div>

            {cartItems.map((item) => (
              <CartItem
                key={item.product._id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
                onUpdateOptions={updateItemOptions}
              />
            ))}
          </div>

          {/* Continue Shopping */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-sans font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
              <ArrowLeft className="w-3.5 h-3.5" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border/80 rounded-2xl p-5 sticky top-8 shadow-[var(--shadow-soft)]">
            <h2 className="text-base font-headline font-bold text-foreground mb-5">Order Summary</h2>

            <div className="space-y-2.5 mb-5">
              {[
                { label: `Subtotal (${cartItems.reduce((a, i) => a + i.quantity, 0)} items)`, value: formatPrice(cartTotal) },
                { label: 'Estimated Shipping', value: formatPrice(SHIPPING_FEE) },
                { label: 'Tax', value: 'Included' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-sans">{label}</span>
                  <span className="font-sans font-semibold text-foreground">{value}</span>
                </div>
              ))}
            </div>

            <div className="w-full h-px bg-border/60 mb-5" />

            <div className="flex justify-between items-end mb-6">
              <span className="text-sm font-headline font-bold text-foreground">Total</span>
              <div className="text-right">
                <span className="block text-2xl font-headline font-bold text-primary">
                  {formatPrice(grandTotal)}
                </span>
                <span className="text-[9px] text-muted-foreground font-sans uppercase tracking-wider">VAT included</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn-base btn-primary w-full py-3 text-sm gap-2 rounded-xl font-sans font-bold uppercase tracking-widest"
            >
              Proceed to Checkout
            </button>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-[9px] text-muted-foreground font-sans uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3 text-secondary-dark" />
              <span>Secure checkout · PayMongo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
