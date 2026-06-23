import { Link } from 'react-router-dom';
import { MapPin, Store } from 'lucide-react';

export const ProductSellerCard = ({ shop }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 ec-card bg-card px-5 sm:px-6 py-5 mb-6 shadow-sm">
    <div className="flex items-center gap-4">
      <img
        src={shop.logoUrl}
        alt={shop.name}
        className="w-12 h-12 rounded-full object-cover border border-border shrink-0"
      />
      <div>
        <p className="text-[9px] font-sans font-bold text-muted-foreground uppercase tracking-widest mb-0.5">
          Sold by
        </p>
        <h3 className="text-base font-headline font-bold text-foreground leading-tight">{shop.name}</h3>
        <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-sans mt-0.5">
          <MapPin className="w-3 h-3 text-primary/70" /> {shop.address}
        </span>
      </div>
    </div>

    <Link
      to={`/shop/${shop._id}`}
      className="btn-sm btn-outline shrink-0 w-full sm:w-auto"
    >
      <Store className="w-3.5 h-3.5" />
      Visit Store
    </Link>
  </div>
);
