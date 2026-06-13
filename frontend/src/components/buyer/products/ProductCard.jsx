import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const formatPrice = (centavos) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(centavos / 100);

const getColorHex = (colorName) => {
  const c = colorName.toLowerCase();
  if (c.includes('white')) return '#F8F8F8';
  if (c.includes('black')) return '#111827';
  if (c.includes('grey') || c.includes('gray')) return '#6B7280';
  if (c.includes('rust')) return '#B45309';
  if (c.includes('ochre')) return '#D4A017';
  if (c.includes('sand')) return '#D6C5A4';
  if (c.includes('charcoal')) return '#36454F';
  if (c.includes('green')) return '#4D7C0F';
  if (c.includes('blue')) return '#2563EB';
  if (c.includes('mahogany')) return '#6B2E1A';
  if (c.includes('clay')) return '#C96E48';
  if (c.includes('copper')) return '#B87333';
  if (c.includes('brass')) return '#B5A642';
  if (c.includes('terracotta')) return '#C97346';
  return '#9CA3AF';
};

export const ProductCard = ({ product, onAddToCart }) => {
  const { cartItems, addToCart, removeFromCart, savedProductIds, toggleSaveProduct } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);

  const isInCart = cartItems.some((item) => item.product._id === product._id);
  const isSaved = savedProductIds?.includes(product._id) || false;

  return (
    <div className="bg-card border border-border/80 rounded-md overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-(--shadow-soft-lg) hover:border-primary/30 group">

      {/* IMAGE */}
      <Link to={`/product/${product._id}`} className="relative h-40 bg-muted overflow-hidden block shrink-0">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Save Button */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSaveProduct(product._id); }}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-card/90 backdrop-blur-sm border border-border/50 flex items-center justify-center shadow-sm hover:text-primary transition-colors"
        >
          <Heart className={`w-3 h-3 ${isSaved ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
        </button>

        {/* Out of Stock */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/75 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-2.5 py-1 rounded-full bg-card border border-border text-[9px] uppercase tracking-widest font-bold text-muted-foreground">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* BODY */}
      <div className="flex flex-col flex-1 p-3.5">

        {/* Category + Rating */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] font-sans font-bold text-primary uppercase tracking-widest">
            {product.category}
          </span>
        </div>

        {/* Name */}
        <Link
          to={`/product/${product._id}`}
          className="font-headline font-bold text-sm text-foreground hover:text-primary transition-colors leading-snug line-clamp-1 mb-1"
        >
          {product.name}
        </Link>

        {/* Variants */}
        {(product.sizes?.length > 0 || product.colors?.length > 0) && (
          <div className="flex items-center justify-between gap-2 py-2 mb-2.5">
            {product.sizes?.length > 0 ? (
              <div className="flex gap-1 overflow-x-auto hide-scrollbar">
                {product.sizes.slice(0, 3).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-4.5 min-w-5 px-1.5 rounded-md text-[8px] font-sans font-bold border transition-all ${selectedSize === size
                      ? 'bg-primary text-white border-primary'
                      : 'border-border/60 hover:border-primary/50 text-muted-foreground'
                      }`}
                  >
                    {size.split(' ')[0]}
                  </button>
                ))}
              </div>
            ) : <div />}

            {product.colors?.length > 0 && (
              <div className="flex gap-1 shrink-0">
                {product.colors.slice(0, 4).map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                    className={`w-3.5 h-3.5 rounded-full border transition-all ${selectedColor === color
                      ? 'ring-1 ring-offset-1 ring-foreground/40 border-foreground/30 scale-110'
                      : 'border-border/60'
                      }`}
                    style={{ backgroundColor: getColorHex(color) }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-2.5 border-t border-border/50">
          <div>
            <p className="text-[9px] text-muted-foreground font-sans uppercase tracking-widest leading-none mb-0.5">Price</p>
            <p className="text-sm font-headline font-bold text-foreground leading-none">
              {formatPrice(product.price)}
            </p>
          </div>

          <div className="flex items-center gap-0.5">
            <Star className="w-2.5 h-2.5 fill-primary text-primary" />
            <span className="text-[10px] font-sans font-bold text-foreground">{product.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};