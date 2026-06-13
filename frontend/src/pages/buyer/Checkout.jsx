import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Banknote, MapPin, Truck, CheckCircle2, ArrowLeft, Lock } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const formatPrice = (c) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(c / 100);

const SHIPPING_FEE = 15000;

const PaymentOption = ({ id, value, selected, onChange, icon: Icon, label, sublabel }) => (
  <label
    htmlFor={id}
    className={`relative flex items-center p-4 cursor-pointer rounded-2xl border-2 transition-all duration-200 ${selected ? 'border-primary bg-primary/5' : 'border-border/70 hover:border-primary/40 bg-background'
      }`}
  >
    <input id={id} type="radio" name="paymentMethod" value={value} checked={selected} onChange={onChange} className="sr-only" />
    <Icon className={`w-6 h-6 mr-3.5 shrink-0 transition-colors ${selected ? 'text-primary' : 'text-muted-foreground/40'}`} />
    <div className="flex-1">
      <span className={`block font-headline font-bold text-sm leading-tight ${selected ? 'text-primary' : 'text-foreground'}`}>{label}</span>
      <span className="block text-[10px] text-muted-foreground mt-0.5 font-sans">{sublabel}</span>
    </div>
    {selected && <CheckCircle2 className="absolute top-3 right-3 w-4 h-4 text-primary" />}
  </label>
);

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [formData, setFormData] = useState({ fullName: '', phone: '', address: '', city: '', zipCode: '' });

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => { setIsProcessing(false); clearCart(); navigate('/orders', { state: { orderPlaced: true } }); }, 2000);
  };

  if (cartItems.length === 0) { navigate('/cart'); return null; }

  const grandTotal = cartTotal + SHIPPING_FEE;

  const fieldLabel = 'text-[9px] font-sans font-bold text-muted-foreground uppercase tracking-widest block mb-1.5';
  const fieldInput = 'w-full px-3.5 py-2.5 bg-background border border-border/70 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all';

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 w-full animate-in fade-in duration-500">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-sans font-medium text-muted-foreground mb-8">
        <Link to="/" className="hover:text-primary transition-colors">Discovery</Link>
        <span className="text-border">/</span>
        <Link to="/cart" className="hover:text-primary transition-colors">Cart</Link>
        <span className="text-border">/</span>
        <span className="text-foreground font-bold">Checkout</span>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold text-foreground tracking-tight mb-1">Checkout</h1>
        <p className="text-muted-foreground font-sans text-xs">Securely complete your artisan purchase.</p>
        <div className="decorative-line decorative-line-primary w-16 mt-3" />
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">

          {/* Shipping Info */}
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-[var(--shadow-soft)]">
            <h2 className="text-base font-headline font-bold text-foreground mb-5 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="w-3.5 h-3.5 text-primary" />
              </div>
              Shipping Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className={fieldLabel}>Full Name</label>
                <input id="fullName" name="fullName" required value={formData.fullName} onChange={handleChange} placeholder="Juan Dela Cruz" className={fieldInput} />
              </div>
              <div>
                <label htmlFor="phone" className={fieldLabel}>Phone Number</label>
                <input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleChange} placeholder="+63 912 345 6789" className={fieldInput} />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="address" className={fieldLabel}>Complete Address</label>
                <input id="address" name="address" required value={formData.address} onChange={handleChange} placeholder="House/Unit No., Street, Barangay" className={fieldInput} />
              </div>
              <div>
                <label htmlFor="city" className={fieldLabel}>City / Municipality</label>
                <input id="city" name="city" required value={formData.city} onChange={handleChange} placeholder="e.g. Cebu City" className={fieldInput} />
              </div>
              <div>
                <label htmlFor="zipCode" className={fieldLabel}>Zip Code</label>
                <input id="zipCode" name="zipCode" required value={formData.zipCode} onChange={handleChange} placeholder="6000" className={fieldInput} />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-[var(--shadow-soft)]">
            <h2 className="text-base font-headline font-bold text-foreground mb-5 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-secondary/20 flex items-center justify-center shrink-0">
                <CreditCard className="w-3.5 h-3.5 text-secondary-dark" />
              </div>
              Payment Method
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <PaymentOption id="pay-cod" value="cod" selected={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} icon={Banknote} label="Cash on Delivery" sublabel="Pay when you receive" />
              <PaymentOption id="pay-online" value="paymongo" selected={paymentMethod === 'paymongo'} onChange={() => setPaymentMethod('paymongo')} icon={CreditCard} label="Online Payment" sublabel="GCash, Maya, Cards" />
            </div>
          </div>
        </div>

        {/* Summary Panel */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border/80 rounded-2xl p-5 sticky top-8 shadow-[var(--shadow-soft)]">
            <h2 className="text-base font-headline font-bold text-foreground mb-5">Order Summary</h2>

            <div className="space-y-3 mb-5 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
              {cartItems.map((item) => (
                <div key={item.product._id} className="flex items-center gap-3 py-3 border-b border-border/50 last:border-0">
                  <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-muted border border-border/50">
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-headline font-bold text-xs text-foreground line-clamp-1">{item.product.name}</h3>
                    <span className="text-[9px] text-muted-foreground font-sans uppercase tracking-wider">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-bold font-sans text-xs text-foreground shrink-0">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="w-full h-px bg-border/60 mb-4" />

            <div className="space-y-2.5 mb-4 text-xs font-sans">
              {[
                { label: 'Subtotal', value: formatPrice(cartTotal) },
                { label: 'Shipping', value: formatPrice(SHIPPING_FEE) },
                { label: 'Tax', value: 'Included' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-semibold text-foreground">{value}</span>
                </div>
              ))}
            </div>

            <div className="w-full h-px bg-border/60 mb-4" />

            <div className="flex justify-between items-end mb-5">
              <span className="text-sm font-headline font-bold text-foreground">Total</span>
              <span className="text-2xl font-headline font-bold text-primary">{formatPrice(grandTotal)}</span>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className={`btn-base w-full py-3 text-sm gap-2 rounded-xl font-sans font-bold uppercase tracking-widest transition-all duration-200 ${isProcessing ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'btn-primary'
                }`}
            >
              {isProcessing ? (
                <><div className="w-4 h-4 border-2 border-muted-foreground/40 border-t-muted-foreground rounded-full animate-spin" />Processing…</>
              ) : (
                <><Truck className="w-4 h-4" />Place Order</>
              )}
            </button>

            <Link to="/cart" className="mt-2.5 flex items-center justify-center gap-1.5 text-[9px] font-sans font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest w-full py-2">
              <ArrowLeft className="w-3 h-3" />Back to Cart
            </Link>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-[9px] text-muted-foreground font-sans uppercase tracking-widest">
              <Lock className="w-3 h-3 text-secondary-dark" />
              <span>Secured by SSL encryption</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
