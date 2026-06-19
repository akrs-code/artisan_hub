import { Link } from 'react-router-dom';
import { MapPin, Store } from 'lucide-react';

export const ProductSellerCard = ({ shop }) => (
  <div className="flex items-center justify-between gap-4 bg-[#2C1A0E] rounded-xl px-6 py-5 mb-6 shadow-lg">
    <div className="flex items-center gap-4">
      <img
        src={shop.logoUrl}
        alt={shop.name}
        className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shrink-0"
      />
      <div>
        <p className="text-[9px] font-sans font-bold text-white/50 uppercase tracking-widest mb-0.5">
          Sold by
        </p>
        <h3 className="text-base font-headline font-bold text-white leading-tight">{shop.name}</h3>
        <span className="flex items-center gap-1 text-[11px] text-white/60 font-sans mt-0.5">
          <MapPin className="w-3 h-3" /> {shop.address}
        </span>
      </div>
    </div>

    <Link
      to={`/shop/${shop._id}`}
      className="flex items-center gap-2 px-4 py-2 bg-white text-[#2C1A0E] rounded-full text-xs font-sans font-bold hover:bg-white/90 transition-colors shrink-0"
    >
      <Store className="w-3.5 h-3.5" />
      Visit Store
    </Link>
  </div>
);
