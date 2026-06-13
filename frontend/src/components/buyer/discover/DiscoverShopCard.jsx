import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

export const DiscoverShopCard = ({ shop }) => (
  <Link
    to={`/shop/${shop._id}`}
    className="bg-card border border-border/80 rounded-md overflow-hidden hover:border-primary/40 hover:shadow-(--shadow-soft-lg) transition-all duration-300 group flex flex-col h-full"
  >
    {/* Cover */}
    <div className="relative h-40 overflow-hidden bg-muted shrink-0">
      <img
        src={shop.coverUrl}
        alt={`${shop.name} cover`}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

      {/* Rating badge */}
      <div className="absolute bottom-2.5 left-3 flex items-center gap-0.5 bg-card/90 backdrop-blur-md px-2 py-0.5 rounded-full border border-border/50 shadow-sm">
        <Star className="w-2.5 h-2.5 fill-primary text-primary" />
        <span className="text-[10px] font-sans font-bold text-foreground">{shop.rating}</span>
      </div>
    </div>

    {/* Content */}
    <div className="p-3.5 flex flex-col flex-1">
      <span className="inline-block text-[9px] font-sans font-bold text-primary uppercase tracking-widest bg-primary/5 border border-primary/10 px-2 py-0.5 rounded-full self-start mb-1.5">
        {shop.category}
      </span>
      <h3 className="font-headline font-bold text-sm text-foreground line-clamp-1 leading-tight group-hover:text-primary transition-colors mb-1">
        {shop.name}
      </h3>
      <p className="text-[10px] text-muted-foreground line-clamp-2 flex-1 font-body leading-relaxed mb-3">
        {shop.description}
      </p>
      <div className="flex items-center justify-between pt-2.5 border-t border-border/50">
        <span className="text-[9px] text-muted-foreground font-sans line-clamp-1 max-w-[70%]">
          {shop.address}
        </span>
        <span className="text-[9px] font-sans font-bold text-primary uppercase tracking-wide">
          View Shop →
        </span>
      </div>
    </div>
  </Link>
);
