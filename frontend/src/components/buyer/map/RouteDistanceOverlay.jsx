import { Navigation, X } from 'lucide-react';

export const RouteDistanceOverlay = ({ routeDistance, onClose }) => {
  if (!routeDistance) return null;

  return (
    <div className="absolute top-36 left-1/2 -translate-x-1/2 z-20 animate-in slide-in-from-top-2 duration-300 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-border/50 bg-card/95 backdrop-blur-md px-3 py-1.5 shadow-sm">
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10">
          <Navigation className="w-3 h-3 text-primary rotate-45" />
        </div>

        <span className="font-sans text-[11px] font-bold text-foreground">
          {routeDistance} km away
        </span>

        <div className="w-px h-3.5 bg-border mx-0.5" />

        <button
          onClick={onClose}
          aria-label="Close route information"
          className="flex items-center justify-center w-5 h-5 rounded-full text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
