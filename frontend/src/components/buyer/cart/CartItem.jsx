import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { mockShops } from '../../../lib/mockData';
import { QuantityControl } from './QuantityControl';

const formatPrice = (centavos) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(centavos / 100);

export const CartItem = ({ item, onUpdateQuantity, onRemove, onUpdateOptions }) => {
  if (!item || !item.product) return null;
  const shop = mockShops.find((s) => s._id === item.product.shop);

  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-border/60 last:border-b-0 hover:bg-muted/20 transition-colors duration-200 group">
      {/* Thumbnail */}
      <Link
        to={`/product/${item.product._id}`}
        className="w-14 h-14 shrink-0 rounded-xl overflow-hidden block bg-muted border border-border/50 group-hover:shadow-sm transition-all duration-300"
      >
        <img
          src={item.product.imageUrl}
          alt={item.product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/shop/${shop?._id}`}
          className="text-[9px] font-bold font-sans text-primary uppercase tracking-widest mb-0.5 block hover:opacity-80 transition-opacity"
        >
          {shop?.name || 'Artisan Shop'}
        </Link>
        <Link
          to={`/product/${item.product._id}`}
          className="font-headline font-bold text-sm text-foreground hover:text-primary transition-colors duration-200 line-clamp-1 leading-snug block"
        >
          {item.product.name}
        </Link>
        <span className="text-[10px] text-muted-foreground font-sans mt-0.5 block">
          {formatPrice(item.product.price)} each
        </span>

        {/* Variant Selectors */}
        {(item.product.colors?.length > 0 || item.product.sizes?.length > 0) && (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {item.product.colors?.length > 0 && (
              <select
                value={item.color || item.product.colors[0]}
                onChange={(e) => onUpdateOptions?.(item.product._id, e.target.value, item.size || item.product.sizes?.[0])}
                className="text-[9px] font-sans px-1.5 py-0.5 rounded-md bg-background border border-border/60 text-muted-foreground hover:text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer"
              >
                {item.product.colors.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
            {item.product.sizes?.length > 0 && (
              <select
                value={item.size || item.product.sizes[0]}
                onChange={(e) => onUpdateOptions?.(item.product._id, item.color || item.product.colors?.[0], e.target.value)}
                className="text-[9px] font-sans px-1.5 py-0.5 rounded-md bg-background border border-border/60 text-muted-foreground hover:text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer"
              >
                {item.product.sizes.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            )}
          </div>
        )}
      </div>

      {/* Quantity */}
      <div className="w-26 flex justify-center shrink-0">
        <QuantityControl
          quantity={item.quantity}
          onDecrement={() => onUpdateQuantity(item.product._id, item.quantity - 1)}
          onIncrement={() => onUpdateQuantity(item.product._id, item.quantity + 1)}
        />
      </div>

      {/* Line Total */}
      <div className="w-22 text-right font-headline font-bold text-sm text-foreground hidden sm:block shrink-0">
        {formatPrice(item.product.price * item.quantity)}
      </div>

      {/* Remove */}
      <div className="w-8 flex justify-center shrink-0">
        <button
          onClick={() => onRemove(item.product._id)}
          aria-label={`Remove ${item.product.name}`}
          className="p-1.5 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
