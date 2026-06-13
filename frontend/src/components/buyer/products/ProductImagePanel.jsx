import { ZoomIn, Heart, Share2 } from 'lucide-react';

export const ProductImagePanel = ({ product, isZoomed, onZoomToggle }) => (
  <div className="flex flex-col gap-4">
    <div
      className="relative rounded-3xl overflow-hidden bg-muted aspect-square cursor-zoom-in group"
      onClick={onZoomToggle}
    >
      <img
        src={product.imageUrl}
        alt={product.name}
        className={`w-full h-full object-cover transition-transform duration-700 ${isZoomed ? 'scale-110' : 'group-hover:scale-[1.03]'
          }`}
      />

      {!product.inStock && (
        <div className="absolute inset-0 bg-neutral-dark/60 flex items-center justify-center backdrop-blur-[2px]">
          <span className="bg-card text-foreground px-6 py-2.5 rounded-sm font-sans font-bold text-sm uppercase tracking-widest shadow-[var(--shadow-soft-lg)]">
            Out of Stock
          </span>
        </div>
      )}

      {/* Zoom hint */}
      <div className="absolute bottom-4 right-4 bg-card/80 backdrop-blur-md px-2.5 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-sans font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ZoomIn className="w-3.5 h-3.5" />
        Zoom
      </div>

      {/* Action buttons */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          aria-label="Save product"
          className="icon-square !w-9 !h-9 !rounded-full bg-card/80 backdrop-blur-sm !text-foreground hover:!text-primary border border-border/50 shadow-[var(--shadow-soft)]"
          onClick={(e) => e.stopPropagation()}
        >
          <Heart className="w-4 h-4" />
        </button>
        <button
          aria-label="Share product"
          className="icon-square !w-9 !h-9 !rounded-full bg-card/80 backdrop-blur-sm !text-foreground hover:!text-primary border border-border/50 shadow-[var(--shadow-soft)]"
          onClick={(e) => e.stopPropagation()}
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);
