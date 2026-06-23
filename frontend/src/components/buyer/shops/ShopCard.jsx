import { Link } from 'react-router-dom';
import { Heart, MapPin, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const ShopCard = ({ shop }) => {
  const { savedShopIds, toggleSaveShop } = useCart();
  const isSaved = savedShopIds?.includes(shop._id) || false;

  return (
    <Link
      to={`/shop/${shop._id}`}
      className="bg-card border border-border/80 rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-[var(--shadow-soft-lg)] transition-all duration-300 group flex flex-col h-full cursor-pointer"
    >
      
      <div className="relative h-40 overflow-hidden bg-muted shrink-0">
        <img
          src={shop.coverUrl}
          alt={`${shop.name} cover`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

        
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSaveShop(shop._id);
          }}
          aria-label={isSaved ? "Remove from saved" : "Save shop"}
          className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center bg-card/90 backdrop-blur-md rounded-full hover:bg-card hover:text-primary transition-colors duration-200 border border-border/50 shadow-sm z-10"
        >
          <Heart className={`w-3.5 h-3.5 transition-colors ${isSaved ? 'text-destructive fill-destructive' : 'text-muted-foreground'}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-3.5 flex flex-col flex-1">
        <span className="inline-block text-[9px] font-sans font-bold text-primary uppercase tracking-widest bg-primary/5 border border-primary/10 px-2 py-0.5 rounded-full self-start mb-2">
          {shop.category}
        </span>
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-headline font-bold text-sm text-foreground line-clamp-1 leading-tight group-hover:text-primary transition-colors">
            {shop.name}
          </h3>
        </div>

        <p className="text-[10px] text-muted-foreground line-clamp-2 mb-3 flex-1 font-body leading-relaxed">
          {shop.description}
        </p>

        <div className="flex items-center justify-between pt-2.5 border-t border-border/50">
          <div className="flex items-center gap-1 text-[9px] text-muted-foreground font-sans max-w-[65%]">
            <MapPin className="w-3 h-3 shrink-0 text-primary/70" />
            <span className="line-clamp-1">{shop.address}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <Star className="w-2.5 h-2.5 fill-primary text-primary" />
            <span className="text-[10px] font-sans font-bold text-primary">{shop.rating}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
