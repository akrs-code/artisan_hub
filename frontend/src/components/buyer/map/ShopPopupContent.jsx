import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, Clock, Navigation, ArrowRight } from 'lucide-react';

export const ShopPopupContent = ({
  artisan,
  savedShopIds,
  toggleSaveShop,
  routeDistance,
  onDirections
}) => {
  const isSaved = savedShopIds.includes(artisan._id);

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Image Section */}
      <div className="relative h-32 w-full overflow-hidden shrink-0 bg-muted">
        <img
          src={artisan.coverUrl}
          alt={artisan.name}
          className="w-full h-full object-cover transition-transform duration-700"
        />
        <span className="top-3.5 left-2.5 inline-block absolute z-10 mb-2.5 text-[9px] font-sans font-bold text-primary uppercase tracking-wider px-1.5 py-0.5 rounded self-start bg-card">
          {artisan.category}
        </span>
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleSaveShop(artisan._id);
          }}
          aria-label="Save shop"
          className="absolute top-2.5 right-2.5 w-8 h-8 flex items-center justify-center bg-card/90 backdrop-blur-md rounded-full hover:bg-card hover:text-destructive transition-colors duration-200 border border-border shadow-sm z-10"
        >
          <Heart className={`w-4 h-4 transition-colors ${isSaved ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4 pt-4 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-headline font-bold text-base text-foreground line-clamp-1 leading-tight group-hover:text-primary transition-colors mb-2">
            {artisan.name}
          </h3>
          <div className="flex items-center gap-0.5">
            <Star className="w-2.5 h-2.5 fill-primary text-primary" />
            <span className="text-[10px] font-sans font-bold text-primary">{artisan.rating}</span>
          </div>
        </div>

        {/* Info Rows */}
        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-1.5 text-[10px] text-muted-foreground font-sans">
            <MapPin className="w-3 h-3 shrink-0 text-primary mt-0.5" />
            <span className="line-clamp-2 leading-relaxed">
              {routeDistance ? <strong className="text-foreground">{routeDistance} km away</strong> : '1.2 km away'}
              {' · '}
              {artisan.address}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-sans">
            <Clock className="w-3 h-3 shrink-0 text-primary" />
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              <span className="text-secondary-dark font-semibold">Open now</span>
              <span className="text-muted-foreground/40">·</span>
              <span>Closes 5:00 PM</span>
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto pt-3 border-t border-border/50">
          <button
            onClick={() => onDirections(artisan)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-tertiary hover:bg-tertiary-dark text-neutral rounded-md text-[10px] font-sans font-bold uppercase tracking-wider transition-colors border border-border/50"
          >
            <Navigation className="w-3 h-3" />
            Directions
          </button>

          <Link
            to={`/shop/${artisan._id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary hover:bg-primary-dark text-primary-foreground rounded-md text-[10px] font-sans font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            Visit Shop
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
