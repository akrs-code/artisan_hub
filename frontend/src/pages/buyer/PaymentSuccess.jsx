import { CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="max-w-md w-full bg-card border border-border/80 rounded-2xl p-8 text-center shadow-lg transform scale-in duration-300">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 mb-6 shadow-inner">
          <CheckCircle className="w-10 h-10 stroke-[2.5]" />
        </div>
        
        <h1 className="text-3xl font-headline font-bold text-foreground mb-3">Payment Successful!</h1>
        <p className="text-muted-foreground font-sans text-sm mb-8">
          Thank you for supporting local artisans! Your payment has been confirmed and the seller is preparing your order.
        </p>

        <Link
          to="/orders"
          className="btn-base btn-primary w-full py-3.5 rounded-xl text-xs font-sans font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 transition-all"
        >
          View My Orders <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
