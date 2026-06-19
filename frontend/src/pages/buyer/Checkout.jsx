import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Banknote, MapPin, Truck, CheckCircle, ArrowLeft, Lock, Check, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const formatPrice = (c) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(c / 100);

const SHIPPING_FEE = 15000; // 150 pesos

const Steps = ({ currentStep }) => {
  const steps = [
    { id: 'delivery', label: 'Delivery' },
    { id: 'payment', label: 'Payment' },
    { id: 'review', label: 'Review' }
  ];

  const getStepStatus = (stepId, index) => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'active';
    return 'inactive';
  };

  return (
    <div className="flex items-center gap-4 mb-8 select-none">
      {steps.map((s, idx) => {
        const status = getStepStatus(s.id, idx);
        return (
          <div key={s.id} className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-sans font-bold transition-all duration-300 border ${
                status === 'completed'
                  ? 'bg-secondary text-white border-secondary'
                  : status === 'active'
                  ? 'border-primary text-primary ring-2 ring-primary/20 bg-primary/5'
                  : 'border-border text-muted-foreground bg-muted/20'
              }`}
            >
              {status === 'completed' ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                idx + 1
              )}
            </div>
            <span
              className={`text-[10px] font-sans font-bold uppercase tracking-widest ${
                status === 'inactive' ? 'text-muted-foreground' : 'text-foreground'
              }`}
            >
              {s.label}
            </span>
            {idx < steps.length - 1 && (
              <div className="w-12 h-px bg-border/60 mx-1" />
            )}
          </div>
        );
      })}
    </div>
  );
};

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState('delivery'); // 'delivery', 'payment', 'review'
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'gcash', 'cod'
  const [formData, setFormData] = useState(() => {
    const savedProfile = localStorage.getItem('buyerProfile');
    let parsed = null;
    if (savedProfile) {
        try { parsed = JSON.parse(savedProfile); } catch (e) {}
    }
    
    return {
      firstName: parsed?.firstName || '',
      lastName: parsed?.lastName || '',
      email: parsed?.email || '',
      phone: parsed?.phone || '',
      address: parsed?.address?.street || '',
      city: parsed?.address?.city || '',
      province: parsed?.address?.state || '',
      zipCode: parsed?.address?.zipCode || '',
      region: '',
      deliveryNotes: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvv: '',
      cardholderName: parsed ? `${parsed.firstName} ${parsed.lastName}`.trim().toUpperCase() : ''
    };
  });

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 'delivery') {
      setStep('payment');
    } else if (step === 'payment') {
      setStep('review');
    }
  };

  const handlePrevStep = () => {
    if (step === 'payment') {
      setStep('delivery');
    } else if (step === 'review') {
      setStep('payment');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const orderDetails = {
        items: cartItems.map(item => ({
          product: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          color: item.color,
          size: item.size
        })),
        total: grandTotal,
        deliveryAddress: `${formData.address}, ${formData.city}, ${formData.province}, ${formData.zipCode}`,
        paymentMethod: paymentMethod,
        shop: cartItems[0]?.product?.shop || 'shop_1'
      };
      clearCart();
      navigate('/orders', { state: { orderPlaced: true, orderDetails } });
    }, 2000);
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const codHandlingFee = paymentMethod === 'cod' ? 3000 : 0; // 30 pesos in centavos
  const grandTotal = cartTotal + SHIPPING_FEE + codHandlingFee;

  const fieldLabel = 'text-[9px] font-sans font-bold text-muted-foreground uppercase tracking-widest block mb-1.5';
  const fieldInput = 'w-full px-3.5 py-2.5 bg-card border border-border/70 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all';

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 w-full animate-in fade-in duration-500">
      
      {/* Header back button */}
      <Link
        to="/cart"
        className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest mb-6"
      >
        <ArrowLeft className="w-4 h-4 text-primary" /> Back to Cart
      </Link>

      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-headline font-bold text-foreground tracking-tight mb-1">Checkout</h1>
      </div>

      {/* Steps Indicator */}
      <Steps currentStep={step} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Flow Form */}
        <div className="lg:col-span-2">
          
          {step === 'delivery' && (
            <form onSubmit={handleNextStep} className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-6">
              <h2 className="text-base font-headline font-bold text-foreground flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-primary" />
                Delivery Address
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className={fieldLabel}>First Name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Maria"
                    className={fieldInput}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className={fieldLabel}>Last Name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Santos"
                    className={fieldInput}
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="email" className={fieldLabel}>Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="maria@email.com"
                    className={fieldInput}
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="phone" className={fieldLabel}>Phone Number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+63 9XX XXX XXXX"
                    className={fieldInput}
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="address" className={fieldLabel}>Street Address</label>
                  <input
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Rizal Street"
                    className={fieldInput}
                  />
                </div>
                <div>
                  <label htmlFor="city" className={fieldLabel}>City / Municipality</label>
                  <input
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Cagayan de Oro"
                    className={fieldInput}
                  />
                </div>
                <div>
                  <label htmlFor="province" className={fieldLabel}>Province</label>
                  <input
                    id="province"
                    name="province"
                    required
                    value={formData.province}
                    onChange={handleChange}
                    placeholder="Misamis Oriental"
                    className={fieldInput}
                  />
                </div>
                <div>
                  <label htmlFor="zipCode" className={fieldLabel}>Zip Code</label>
                  <input
                    id="zipCode"
                    name="zipCode"
                    required
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="9000"
                    className={fieldInput}
                  />
                </div>
                <div>
                  <label htmlFor="region" className={fieldLabel}>Region</label>
                  <input
                    id="region"
                    name="region"
                    required
                    value={formData.region}
                    onChange={handleChange}
                    placeholder="Region X"
                    className={fieldInput}
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="deliveryNotes" className={fieldLabel}>Delivery Notes (Optional)</label>
                  <textarea
                    id="deliveryNotes"
                    name="deliveryNotes"
                    value={formData.deliveryNotes}
                    onChange={handleChange}
                    placeholder="e.g. Leave at the gate, call before delivery..."
                    rows={3}
                    className={`${fieldInput} resize-none`}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 text-xs font-sans font-bold uppercase tracking-widest bg-primary hover:bg-primary-dark text-white rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1"
              >
                Continue to Payment <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {step === 'payment' && (
            <form onSubmit={handleNextStep} className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-6">
              <h2 className="text-base font-headline font-bold text-foreground flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-primary" />
                Payment Method
              </h2>

              <div className="space-y-3">
                {/* Credit / Debit Card option */}
                <label
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-border hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className={`w-4 h-4 ${paymentMethod === 'card' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-sm font-headline font-bold text-foreground">Credit / Debit Card</span>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethodSelect"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="accent-primary w-4 h-4 cursor-pointer"
                  />
                </label>

                {/* GCash option */}
                <label
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                    paymentMethod === 'gcash'
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-border hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center font-sans font-black text-[9px]">G</span>
                    <span className="text-sm font-headline font-bold text-foreground">GCash</span>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethodSelect"
                    checked={paymentMethod === 'gcash'}
                    onChange={() => setPaymentMethod('gcash')}
                    className="accent-primary w-4 h-4 cursor-pointer"
                  />
                </label>

                {/* Cash on Delivery option */}
                <label
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-border hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Banknote className={`w-4 h-4 ${paymentMethod === 'cod' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-sm font-headline font-bold text-foreground">Cash on Delivery</span>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethodSelect"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-primary w-4 h-4 cursor-pointer"
                  />
                </label>
              </div>

              {/* Progressive Disclosures */}
              {paymentMethod === 'card' && (
                <div className="mt-4 p-5 border border-border/60 bg-muted/20 rounded-xl space-y-4 animate-in fade-in duration-200">
                  <h3 className="text-[10px] font-sans font-bold text-muted-foreground uppercase tracking-widest">Card Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="cardNumber" className={fieldLabel}>Card Number</label>
                      <input
                        id="cardNumber"
                        name="cardNumber"
                        required
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="1234 5678 9012 3456"
                        className={fieldInput}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="cardExpiry" className={fieldLabel}>Expiry</label>
                        <input
                          id="cardExpiry"
                          name="cardExpiry"
                          required
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          placeholder="MM / YY"
                          className={fieldInput}
                        />
                      </div>
                      <div>
                        <label htmlFor="cardCvv" className={fieldLabel}>CVV</label>
                        <input
                          id="cardCvv"
                          name="cardCvv"
                          type="password"
                          required
                          value={formData.cardCvv}
                          onChange={handleChange}
                          placeholder="***"
                          maxLength={4}
                          className={fieldInput}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="cardholderName" className={fieldLabel}>Cardholder Name</label>
                      <input
                        id="cardholderName"
                        name="cardholderName"
                        required
                        value={formData.cardholderName}
                        onChange={handleChange}
                        placeholder="MARIA L. SANTOS"
                        className={fieldInput}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'gcash' && (
                <div className="p-4 bg-blue-50 border border-blue-100 text-blue-800 text-xs rounded-xl font-sans mt-3 animate-in fade-in duration-200">
                  You will be redirected to GCash to complete your payment after confirming your order.
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-4 bg-amber-50 border border-amber-100 text-amber-800 text-xs rounded-xl font-sans mt-3 animate-in fade-in duration-200">
                  Prepare exact change upon delivery. COD orders are subject to a ₱30 handling fee.
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-5 py-3 text-xs font-sans font-bold uppercase tracking-widest border border-border text-muted-foreground hover:text-foreground rounded-xl transition-all cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-xs font-sans font-bold uppercase tracking-widest bg-primary hover:bg-primary-dark text-white rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1"
                >
                  Review Order <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {step === 'review' && (
            <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-6">
              <h2 className="text-base font-headline font-bold text-foreground flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-secondary-dark" />
                Review Your Order
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-muted/20 border border-border/50 rounded-xl space-y-2 text-xs font-sans">
                  <h3 className="font-bold text-foreground uppercase tracking-wide text-[10px] text-muted-foreground">Delivery Details</h3>
                  <p className="font-semibold text-foreground">{formData.firstName} {formData.lastName}</p>
                  <p className="text-muted-foreground">{formData.address}, {formData.city}, {formData.province}, {formData.zipCode}</p>
                  <p className="text-muted-foreground">Phone: {formData.phone}</p>
                  {formData.deliveryNotes && (
                    <p className="text-[11px] italic text-muted-foreground mt-2 border-t border-border/30 pt-2">
                      Notes: {formData.deliveryNotes}
                    </p>
                  )}
                </div>

                <div className="p-4 bg-muted/20 border border-border/50 rounded-xl space-y-1 text-xs font-sans">
                  <h3 className="font-bold text-foreground uppercase tracking-wide text-[10px] text-muted-foreground">Payment Method</h3>
                  <p className="font-semibold text-foreground capitalize">
                    {paymentMethod === 'card'
                      ? `Credit Card Ending in **** ${formData.cardNumber.slice(-4) || '4321'}`
                      : paymentMethod === 'gcash'
                      ? 'GCash E-Wallet'
                      : 'Cash on Delivery'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-5 py-3 text-xs font-sans font-bold uppercase tracking-widest border border-border text-muted-foreground hover:text-foreground rounded-xl transition-all cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="flex-1 py-3 text-xs font-sans font-bold uppercase tracking-widest bg-primary hover:bg-primary-dark text-white rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isProcessing ? (
                    <><div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Placing Order...</>
                  ) : (
                    <><Truck className="w-3.5 h-3.5" /> Place Order</>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border/80 rounded-2xl p-5 sticky top-8 shadow-sm">
            <h2 className="text-base font-headline font-bold text-foreground mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              {cartItems.map((item) => (
                <div key={item.product._id} className="flex items-center gap-3 py-3 border-b border-border/50 last:border-0">
                  <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-muted border border-border/50">
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-headline font-bold text-xs text-foreground line-clamp-1">{item.product.name}</h3>
                    {item.color || item.size ? (
                      <p className="text-[9px] text-muted-foreground font-sans uppercase tracking-wider mt-0.5">
                        {[item.color, item.size].filter(Boolean).join(' - ')}
                      </p>
                    ) : (
                      <span className="text-[9px] text-muted-foreground font-sans uppercase tracking-wider">Qty: {item.quantity}</span>
                    )}
                  </div>
                  <span className="font-bold font-sans text-xs text-foreground shrink-0">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="w-full h-px bg-border/60 mb-4" />

            <div className="space-y-2.5 mb-4 text-xs font-sans">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({cartItems.reduce((acc, val) => acc + val.quantity, 0)} items)</span>
                <span className="font-semibold text-foreground">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-semibold text-foreground">{formatPrice(SHIPPING_FEE)}</span>
              </div>
              {paymentMethod === 'cod' && (
                <div className="flex justify-between animate-in fade-in duration-200">
                  <span className="text-muted-foreground">COD Handling Fee</span>
                  <span className="font-semibold text-foreground">{formatPrice(3000)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-semibold text-foreground">Included</span>
              </div>
            </div>

            <div className="w-full h-px bg-border/60 mb-4" />

            <div className="flex justify-between items-end mb-5">
              <div>
                <span className="text-xs font-headline font-bold text-foreground">Total</span>
                <p className="text-[8px] text-muted-foreground uppercase tracking-wider leading-none mt-0.5">VAT INCLUDED</p>
              </div>
              <span className="text-xl font-headline font-bold text-primary">{formatPrice(grandTotal)}</span>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[9px] text-muted-foreground font-sans uppercase tracking-widest pt-2 border-t border-border/30">
              <Lock className="w-3 h-3 text-secondary-dark" />
              <span>Secured by SSL encryption</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
