import { Link } from 'react-router-dom';
import { Heart, Map } from 'lucide-react';

export const EmptySavedShops = () => (
  <div className="text-center py-20 bg-card rounded-2xl border border-border/80 flex flex-col items-center shadow-[var(--shadow-soft)]">
    <Heart className="w-10 h-10 text-muted-foreground/20 mb-4" />
    <h3 className="text-lg font-headline font-bold text-foreground mb-2">Your Shop Collection is Empty</h3>
    <p className="text-muted-foreground font-sans text-xs max-w-md mb-6 leading-relaxed">
      You haven't saved any artisan shops yet. Explore the marketplace map to discover your favourite local creators.
    </p>
    <Link to="/" className="btn-base btn-primary px-6 py-2 rounded-xl font-sans font-bold text-xs uppercase tracking-widest gap-2">
      <Map className="w-3.5 h-3.5" />
      Explore Marketplace
    </Link>
  </div>
);
