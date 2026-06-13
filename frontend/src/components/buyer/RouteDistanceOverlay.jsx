import { Navigation, X } from 'lucide-react';

export const RouteDistanceOverlay = ({ routeDistance, onClose }) => {
  if (!routeDistance) return null;

  return (
    <div
      className="
        absolute
        top-36
        left-1/2
        -translate-x-1/2
        z-20
        animate-in
        slide-in-from-top-4
        duration-300
      "
    >
      <div
        className="
          flex
          items-center
          gap-3
          rounded-2xl
          border
          border-border
          bg-background/95
          backdrop-blur-md
          px-4
          py-3
          shadow-lg
        "
      >
        <div
          className="
            flex
            items-center
            justify-center
            w-8
            h-8
            rounded-full
            bg-primary/10
          "
        >
          <Navigation className="w-4 h-4 text-primary rotate-45" />
        </div>

        <div className="flex flex-col leading-tight">
          <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Route Distance
          </span>
          <span className="font-semibold text-sm text-foreground">
            {routeDistance} km away
          </span>
        </div>

        <button
          onClick={onClose}
          aria-label="Close route information"
          className="
            ml-1
            flex
            items-center
            justify-center
            w-7
            h-7
            rounded-full
            text-muted-foreground
            hover:bg-muted
            hover:text-foreground
            transition-colors
          "
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};