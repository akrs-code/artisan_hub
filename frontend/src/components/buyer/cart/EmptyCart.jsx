import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

export const EmptyCart = () => (
  <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 w-full animate-in fade-in duration-500">
    <div className="mb-8">
      <h1 className="text-3xl font-headline font-bold text-foreground tracking-tight mb-1">Shopping Cart</h1>
      <p className="text-muted-foreground font-sans text-xs">Review and manage your selected artisan products.</p>
      <div className="decorative-line decorative-line-primary w-16 mt-3" />
    </div>

    <div className="text-center py-20 bg-card rounded-2xl border border-border/80 flex flex-col items-center shadow-(--shadow-soft)">
      <ShoppingBag className="w-10 h-10 text-muted-foreground/20 mb-4" />
      <h3 className="text-lg font-headline font-bold text-foreground mb-2">Your Cart is Empty</h3>
      <p className="text-muted-foreground font-sans text-xs max-w-md mb-6 leading-relaxed">
        You haven't added any items yet. Discover unique handmade pieces from local craftsmen.
      </p>
      <Link to="/" className="btn-base btn-primary px-6 py-2 rounded-xl font-sans font-bold text-xs uppercase tracking-widest">
        Explore Catalog
      </Link>
    </div>
  </div>
);
