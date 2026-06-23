import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';

export const NearbyShopStrip = ({ shops, title = 'Nearby Shops' }) => {
  if (!shops || shops.length === 0) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none flex flex-col bg-linear-to-t from-background/30 via-background/10 to-transparent pt-12 pb-6">
      <div className="pointer-events-auto w-full px-6">
        
        <div className="flex items-end gap-2.5 mb-3 px-1">
          <h3 className="text-lg font-headline font-extrabold text-foreground leading-none">{title}</h3>
          <span className="text-xs text-muted-foreground font-sans font-medium mb-0.5">{shops.length} shops</span>
        </div>
      </div>

      
      <div className="pointer-events-auto w-full overflow-x-auto hide-scrollbar">
        <div className="flex gap-4 px-6 pb-2 w-max">
          {shops.map((shop) => (
            <Link
              key={shop._id}
              to={`/shop/${shop._id}`}
              className="w-60 bg-card rounded-md border border-border overflow-hidden hover:border-primary/40 hover:shadow-md transition-all duration-300 group shadow-sm flex flex-col shrink-0"
            >
              
              <div className="relative h-28 overflow-hidden bg-muted">
                <img
                  src={shop.coverUrl}
                  alt={shop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-card/95 backdrop-blur-sm rounded-md px-1.5 py-0.5 shadow-sm">
                  <Star className="w-2.5 h-2.5 fill-primary text-primary" />
                  <span className="text-[10px] font-sans font-bold text-primary">{shop.rating}</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-3 flex flex-col flex-1">
                <div className='flex justify-between'>
                  <h4 className="text-xs font-headline font-bold text-foreground leading-tight line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                    {shop.name}
                  </h4>
                  <span className="inline-block mb-2.5 text-[9px] font-sans font-bold text-primary uppercase tracking-wider bg-primary/10 px-1.5 py-0.5 rounded self-start">
                    {shop.category}
                  </span>
                </div>

                <div className="flex items-start gap-1 text-muted-foreground mt-auto pt-1.5 border-t border-border/50">
                  <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
                  <span className="text-[10px] font-sans line-clamp-1 leading-snug">{shop.address}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
