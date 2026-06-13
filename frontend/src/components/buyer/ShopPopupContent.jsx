import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, Clock, Navigation, ExternalLink } from 'lucide-react';

export const ShopPopupContent = ({
  artisan,
  savedShopIds,
  toggleSaveShop,
  routeDistance,
  onDirections
}) => {
  return (
    <>
      {/* Image Section */}
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={artisan.coverUrl}
          alt={artisan.name}
          className="object-cover w-full h-full"
        />
        {/* Subtle scrim for legibility of bottom content */}
        <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />

        {/* UI/UX Standard Metadata Pill Badge */}
        <span className="absolute top-3 left-3 select-none pointer-events-none bg-card/90 backdrop-blur-md text-card-foreground text-[10px] font-sans font-bold tracking-wider px-2.5 py-1 rounded-md uppercase shadow-sm border border-border">
          {artisan.category}
        </span>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleSaveShop(artisan._id);
          }}
          className="absolute top-3 right-3 bg-card/95 p-1.5 rounded-full shadow-sm transition-colors hover:bg-card text-muted-foreground hover:text-destructive"
          aria-label="Save shop"
        >
          <Heart
            className={`size-3.5 transition-colors ${savedShopIds.includes(artisan._id)
              ? 'fill-destructive text-destructive'
              : 'text-muted-foreground hover:text-destructive'
              }`}
          />
        </button>
      </div>

      {/* Content Section */}
      <div className="px-4 pt-3.5 pb-4 space-y-3">
        {/* Name + Rating */}
        <div className="space-y-1">
          <h3 className="font-headline font-bold text-lg text-card-foreground leading-snug">
            {artisan.name}
          </h3>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-primary-light text-primary-dark text-[11px] font-sans font-bold px-1.5 py-0.5 rounded">
              <Star className="size-3 fill-primary text-primary" />
              4.9
            </span>
            <span className="text-[11px] font-sans text-muted-foreground">128 reviews</span>
          </div>
        </div>

        {/* Meta Info */}
        <div className="space-y-1.5">
          <div className="flex items-start gap-2 text-[12px] font-body text-muted-foreground">
            <MapPin className="size-3.5 text-primary shrink-0 mt-px" />
            <span className="leading-snug">
              {routeDistance ? `${routeDistance} km away` : '1.2 km away'}
              {' · '}
              {artisan.address}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[12px] font-body text-muted-foreground">
            <Clock className="size-3.5 text-primary shrink-0" />
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              <span className="text-secondary-dark font-semibold font-sans">Open now</span>
              <span className="text-muted-foreground/25">·</span>
              <span>Closes 5:00 PM</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3 border-t border-border">
          <button
            onClick={() => onDirections(artisan)}
            className="btn-base btn-primary flex-1 gap-1.5 py-2 rounded-xl text-[10px] font-sans font-bold uppercase tracking-wider"
          >
            <Navigation className="size-3.5 rotate-45" />
            Directions
          </button>

          <Link
            to={`/shop/${artisan._id}`}
            className="flex items-center justify-center w-9 border border-border rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
            title="View shop"
            aria-label="View shop"
          >
            <ExternalLink className="size-4" />
          </Link>
        </div>
      </div>
    </>
  );
};
