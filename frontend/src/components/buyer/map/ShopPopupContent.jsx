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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

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

        {/* Overlapping Logo */}
        <div className="absolute -bottom-6 left-4 z-10">
          <img
            src={artisan.logoUrl}
            alt={`${artisan.name} logo`}
            className="w-12 h-12 rounded-xl border-2 border-card shadow-sm object-cover bg-card"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 pt-8 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-headline font-bold text-base text-foreground line-clamp-1 leading-tight group-hover:text-primary transition-colors">
            {artisan.name}
          </h3>
          <span className="flex items-center text-[10px] font-sans font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded shrink-0">
            <Star className="w-2.5 h-2.5 fill-primary mr-0.5" />
            4.9
          </span>
        </div>

        {/* Category Pill */}
        <span className="inline-block text-[9px] font-sans font-bold text-primary uppercase tracking-wider bg-primary/5 px-2 py-1 rounded-md self-start mb-3">
          {artisan.category}
        </span>

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
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-[10px] font-sans font-bold uppercase tracking-wider transition-colors border border-border/50"
          >
            <Navigation className="w-3 h-3" />
            Directions
          </button>
          
          <Link
            to={`/shop/${artisan._id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary hover:bg-primary-dark text-primary-foreground rounded-lg text-[10px] font-sans font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            Visit Shop
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
