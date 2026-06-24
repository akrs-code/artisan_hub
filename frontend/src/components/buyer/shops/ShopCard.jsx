import { Link } from 'react-router-dom';
import { Heart, MapPin, Star, BadgeCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const ShopCard = ({ shop }) => {
  const { savedShopIds, toggleSaveShop } = useCart();
  const isSaved = savedShopIds?.includes(shop._id) || false;

  return (
    <Link
      to={`/shop/${shop._id}`}
      className="ec-card-img ec-card-hover flex flex-col h-full cursor-pointer group"
    >
      {/* Cover image */}
      <div className="relative h-36 sm:h-40 overflow-hidden bg-muted shrink-0">
        <img
          src={shop.coverUrl}
          alt={`${shop.name} cover`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Save button */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSaveShop(shop._id); }}
          aria-label={isSaved ? 'Remove from saved' : 'Save shop'}
          className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center bg-card/90 backdrop-blur-md rounded-full border border-border/50 shadow-sm hover:bg-card hover:text-primary transition-colors z-10"
        >
          <Heart className={`w-3.5 h-3.5 transition-colors ${isSaved ? 'text-destructive fill-destructive' : 'text-muted-foreground'}`} />
        </button>

        {/* Logo on cover */}
        {shop.logoUrl && (
          <div className="absolute bottom-2.5 left-3.5 w-9 h-9 rounded-lg overflow-hidden border-2 border-card shadow-md bg-card">
            <img src={shop.logoUrl} alt={shop.name} className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`flex flex-col flex-1 p-3.5 ${shop.logoUrl ? 'pt-2' : ''}`}>
        {/* Category badge */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="badge-custom bg-primary/8 border border-primary/15 text-primary">
            {shop.category}
          </span>
          {shop.isVerified && (
            <BadgeCheck className="w-3.5 h-3.5 text-primary shrink-0" title="Verified Artisan" />
          )}
        </div>

        {/* Shop name */}
        <h3 className="font-headline font-bold text-sm text-foreground line-clamp-1 leading-tight group-hover:text-primary transition-colors mb-1">
          {shop.name}
        </h3>

        {/* Description */}
        <p className="text-[10px] text-muted-foreground line-clamp-2 mb-3 flex-1 leading-relaxed">
          {shop.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2.5 border-t border-border/60">
          <div className="flex items-center gap-1 text-[9px] text-muted-foreground max-w-[70%]">
            <MapPin className="w-3 h-3 shrink-0 text-muted-foreground/70" />
            <span className="line-clamp-1">{shop.address}</span>
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            <Star className="w-2.5 h-2.5 fill-primary text-primary" />
            <span className="text-[10px] font-sans font-bold text-foreground">{shop.rating}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
