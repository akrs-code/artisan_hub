import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';

const formatPrice = (centavos) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(centavos / 100);

export const ProductInfoHeader = ({ product, shop }) => (
  <div className="mb-5">
    
    <Link
      to={`/shop/${shop._id}`}
      className="inline-flex items-center gap-2 mb-3 group"
    >
      <img
        src={shop.logoUrl}
        alt={shop.name}
        className="w-6 h-6 rounded-full object-cover border border-border/50"
      />
      <span className="text-sm font-sans font-bold text-primary group-hover:text-primary-dark transition-colors">
        {shop.name}
      </span>
      <span className="text-muted-foreground text-sm">›</span>
    </Link>

    {/* Product name */}
    <h1 className="text-3xl lg:text-4xl font-headline font-bold text-foreground tracking-tight mb-3 leading-tight">
      {product.name}
    </h1>

    
    <div className="flex flex-wrap items-center gap-3 mb-4 text-sm font-sans">
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < Math.round(product.rating || 0) ? 'fill-primary text-primary' : 'text-muted/30'}`}
          />
        ))}
        <span className="font-bold text-foreground ml-1">{product.rating || '0'}</span>
        <span className="text-muted-foreground">({product.reviewCount || '0'} reviews)</span>
      </div>
      {product.stockQuantity != null && (
        <>
          <span className="text-muted-foreground/40">·</span>
          <span className="text-muted-foreground">{product.stockQuantity} sold</span>
        </>
      )}
      <span className="text-muted-foreground/40">·</span>
      <span className="flex items-center gap-1 text-muted-foreground">
        <MapPin className="w-3.5 h-3.5" /> {shop.address}
      </span>
    </div>

    {/* Price */}
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-headline font-bold text-primary">
        {formatPrice(product.price)}
      </span>
      <span className="text-sm text-muted-foreground font-sans">per piece</span>
    </div>
  </div>
);
