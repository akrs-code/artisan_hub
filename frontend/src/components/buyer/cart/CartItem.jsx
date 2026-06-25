import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { QuantityControl } from './QuantityControl';

const formatPrice = (centavos) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(centavos / 100);

const getColorHex = (colorName) => {
  const c = colorName.toLowerCase();
  if (c.includes('white'))      return '#F8F8F8';
  if (c.includes('black'))      return '#111827';
  if (c.includes('grey') || c.includes('gray')) return '#6B7280';
  if (c.includes('rust'))       return '#B45309';
  if (c.includes('ochre'))      return '#D4A017';
  if (c.includes('sand'))       return '#D6C5A4';
  if (c.includes('charcoal'))   return '#36454F';
  if (c.includes('green'))      return '#4D7C0F';
  if (c.includes('blue'))       return '#2563EB';
  if (c.includes('mahogany'))   return '#6B2E1A';
  if (c.includes('clay'))       return '#C96E48';
  if (c.includes('copper'))     return '#B87333';
  if (c.includes('brass'))      return '#B5A642';
  if (c.includes('terracotta')) return '#C97346';
  return '#9CA3AF';
};

export const CartItem = ({ item, onUpdateQuantity, onRemove, onUpdateOptions }) => {
  if (!item || !item.product) return null;

  const shop = typeof item.product.shop === 'object' ? item.product.shop : null;
  const shopId = shop?._id || item.product.shop;

  return (
    <div className="ec-card-img ec-card-hover flex flex-col h-full group relative bg-card">
      
      {/* Remove */}
      <button
        onClick={() => onRemove(item.product._id)}
        aria-label={`Remove ${item.product.name}`}
        className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-card/90 backdrop-blur-sm border border-border/50 flex items-center justify-center shadow-sm hover:text-destructive hover:bg-destructive/10 transition-colors z-10"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {/* Product image */}
      <Link
        to={`/product/${item.product._id}`}
        className="relative h-40 sm:h-48 bg-muted overflow-hidden block shrink-0"
      >
        <img
          src={item.product.imageUrl}
          alt={item.product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
      </Link>

      {/* Details & Actions */}
      <div className="flex flex-col flex-1 p-3.5">
        
        {/* Shop Name */}
        <Link
          to={`/shop/${shopId}`}
          className="text-[9px] font-bold font-sans text-primary uppercase tracking-widest mb-1.5 block hover:opacity-75 transition-opacity"
        >
          {shop?.name || 'Artisan Shop'}
        </Link>

        {/* Product Name */}
        <Link
          to={`/product/${item.product._id}`}
          className="font-headline font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-2 leading-snug mb-2 flex-1"
        >
          {item.product.name}
        </Link>

        {/* Variant selectors */}
        {(item.product.sizes?.length > 0 || item.product.colors?.length > 0) && (
          <div className="flex items-center justify-between gap-2 mb-3">
            {/* Sizes */}
            {item.product.sizes?.length > 0 ? (
              <div className="flex gap-1 overflow-x-auto hide-scrollbar">
                {item.product.sizes.slice(0, 4).map((size) => {
                  const isSelected = (item.size || item.product.sizes[0]) === size;
                  return (
                    <button
                      key={size}
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateOptions?.(item.product._id, item.color || item.product.colors?.[0], size);
                      }}
                      className={`min-w-[24px] h-5 px-1.5 rounded text-[8px] font-bold border transition-all ${isSelected
                        ? 'bg-primary text-white border-primary'
                        : 'border-border text-muted-foreground hover:border-primary/50'
                      }`}
                    >
                      {size.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            ) : <div />}

            {/* Colors */}
            {item.product.colors?.length > 0 && (
              <div className="flex gap-1 shrink-0">
                {item.product.colors.slice(0, 5).map((color) => {
                  const isSelected = (item.color || item.product.colors[0]) === color;
                  return (
                    <button
                      key={color}
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateOptions?.(item.product._id, color, item.size || item.product.sizes?.[0]);
                      }}
                      title={color}
                      className={`w-3.5 h-3.5 rounded-full border transition-all ${isSelected
                        ? 'ring-1 ring-offset-1 ring-foreground/40 border-foreground/30 scale-110'
                        : 'border-border/60'
                      }`}
                      style={{ backgroundColor: getColorHex(color) }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Pricing & Quantity */}
        <div className="flex items-center justify-between pt-2.5 border-t border-border/60 mt-auto gap-2">
          <div>
            <p className="text-[9px] text-muted-foreground font-sans uppercase tracking-widest leading-none mb-0.5">Total</p>
            <p className="text-sm font-headline font-bold text-foreground leading-none">
              {formatPrice(item.product.price * item.quantity)}
            </p>
          </div>
          <div className="shrink-0">
            <QuantityControl
              quantity={item.quantity}
              onDecrement={() => onUpdateQuantity(item.product._id, item.quantity - 1)}
              onIncrement={() => onUpdateQuantity(item.product._id, item.quantity + 1)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
