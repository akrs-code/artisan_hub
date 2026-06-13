import { MapPin, Star } from 'lucide-react';

export const ProductDetailTabs = ({ product, shop, activeTab, onTabChange }) => (
  <div className="border border-border/80 bg-card rounded-2xl p-4.5 mb-7 shadow-sm">
    {/* Tab headers */}
    <div className="flex border-b border-border/50 pb-2 mb-3 gap-4">
      {['product', 'store'].map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onTabChange(tab)}
          className={`text-[10px] font-sans font-bold uppercase tracking-widest pb-1 transition-all border-b-2 cursor-pointer ${
            activeTab === tab
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          {tab === 'product' ? 'Product Details' : 'Store Details'}
        </button>
      ))}
    </div>

    {/* Tab body */}
    <div className="max-h-32 overflow-y-auto pr-1.5 text-xs text-muted-foreground leading-relaxed custom-scrollbar font-body">
      {activeTab === 'product' ? (
        <div>
          <p className="mb-2 text-foreground font-semibold">{product.name}</p>
          <p>{product.description}</p>
          <div className="mt-3.5 grid grid-cols-2 gap-2 text-[10px] font-sans text-muted-foreground/80 border-t border-border/30 pt-3">
            <div>
              <span className="block font-bold uppercase tracking-widest text-[8px] text-muted-foreground/50">Category</span>
              <span className="text-foreground font-semibold">{product.category}</span>
            </div>
            <div>
              <span className="block font-bold uppercase tracking-widest text-[8px] text-muted-foreground/50">Availability</span>
              <span className={`font-semibold ${product.inStock ? 'text-secondary-dark' : 'text-destructive'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p className="mb-1 text-foreground font-semibold">{shop.name}</p>
          <p className="mb-2.5 text-[9px] font-sans text-primary uppercase tracking-widest font-bold">{shop.category}</p>
          <p className="mb-3.5">{shop.description}</p>
          <div className="space-y-2 text-[10px] font-sans border-t border-border/30 pt-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="text-foreground font-semibold">{shop.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-3.5 h-3.5 fill-primary text-primary shrink-0" />
              <span className="text-foreground font-semibold">{shop.rating || '4.8'} / 5.0 Rating</span>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
