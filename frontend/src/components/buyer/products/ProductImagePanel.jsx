import { useState } from 'react';
import { Heart, Share2, ZoomIn } from 'lucide-react';

// Generates a small set of "gallery" images from the single imageUrl
const getGalleryImages = (imageUrl) => [
  imageUrl,
  imageUrl.replace('w=800', 'w=400').replace('q=80', 'q=60'),
  imageUrl.replace('photo-', 'photo-alt-').replace('w=800', 'w=600'),
  imageUrl.replace('w=800', 'w=300'),
];

export const ProductImagePanel = ({ product, isSaved, onToggleSave }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const gallery = getGalleryImages(product.imageUrl);

  return (
    <div className="flex gap-3">
      {/* Thumbnails strip */}
      <div className="flex flex-col gap-2 shrink-0">
        {gallery.map((src, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 ${activeIdx === i
                ? 'border-primary shadow-md scale-105'
                : 'border-border/50 hover:border-primary/40 opacity-70 hover:opacity-100'
              }`}
          >
            <img src={src} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = product.imageUrl; }} />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="relative flex-1 aspect-square rounded-xl overflow-hidden bg-muted border border-border/40 group">
        <img
          src={gallery[activeIdx]}
          alt={product.name}
          onError={(e) => { e.target.src = product.imageUrl; }}
          className={`w-full h-full object-cover transition-transform duration-700 ${isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in group-hover:scale-[1.03]'
            }`}
          onClick={() => setIsZoomed((z) => !z)}
        />

        {/* Out-of-stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex items-center justify-center">
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-muted-foreground bg-card border border-border px-4 py-2 rounded-full">
              Out of Stock
            </span>
          </div>
        )}

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={onToggleSave}
            className="w-9 h-9 rounded-full bg-card/90 backdrop-blur-md border border-border/50 flex items-center justify-center hover:bg-card transition-colors shadow-sm"
            aria-label="Save product"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
          </button>
          <button
            className="w-9 h-9 rounded-full bg-card/90 backdrop-blur-md border border-border/50 flex items-center justify-center hover:bg-card transition-colors shadow-sm"
            aria-label="Share product"
          >
            <Share2 className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Zoom hint */}
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="flex items-center gap-1 text-[9px] font-sans text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
            <ZoomIn className="w-3 h-3" /> Click to zoom
          </span>
        </div>
      </div>
    </div>
  );
};
