import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

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

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { cartItems, addToCart, savedProductIds, toggleSaveProduct } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
  const [added, setAdded] = useState(false);

  const isInCart = cartItems.some((item) => item.product._id === product._id);
  const isSaved = savedProductIds?.includes(product._id) || false;

  const handleCardClick = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) return;
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1, selectedColor, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      onClick={handleCardClick}
      className="ec-card-img ec-card-hover flex flex-col h-full cursor-pointer group"
    >
      {/* Image */}
      <Link to={`/product/${product._id}`} className="relative h-44 sm:h-48 bg-muted overflow-hidden block shrink-0">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSaveProduct(product._id); }}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-card/90 backdrop-blur-sm border border-border/50 flex items-center justify-center shadow-sm hover:text-primary transition-colors z-10"
          aria-label={isSaved ? 'Remove from saved' : 'Save product'}
        >
          <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
        </button>

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/75 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="px-3 py-1 rounded-full bg-card border border-border text-[9px] uppercase tracking-widest font-bold text-muted-foreground">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 p-3.5">
        {/* Category */}
        <span className="text-[9px] font-sans font-bold text-primary uppercase tracking-widest mb-1.5 block">
          {product.category}
        </span>

        {/* Name */}
        <Link
          to={`/product/${product._id}`}
          className="font-headline font-bold text-sm text-foreground hover:text-primary transition-colors leading-snug line-clamp-2 mb-2 flex-1"
        >
          {product.name}
        </Link>

        {/* Variants row */}
        {(product.sizes?.length > 0 || product.colors?.length > 0) && (
          <div className="flex items-center justify-between gap-2 mb-3">
            {/* Sizes */}
            {product.sizes?.length > 0 ? (
              <div className="flex gap-1 overflow-x-auto hide-scrollbar">
                {product.sizes.slice(0, 4).map((size) => (
                  <button
                    key={size}
                    onClick={(e) => { e.stopPropagation(); setSelectedSize(size); }}
                    className={`min-w-[24px] h-5 px-1.5 rounded text-[8px] font-bold border transition-all ${selectedSize === size
                      ? 'bg-primary text-white border-primary'
                      : 'border-border text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    {size.split(' ')[0]}
                  </button>
                ))}
              </div>
            ) : <div />}

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="flex gap-1 shrink-0">
                {product.colors.slice(0, 5).map((color) => (
                  <button
                    key={color}
                    onClick={(e) => { e.stopPropagation(); setSelectedColor(color); }}
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
        <div className="flex items-center justify-between pt-2.5 border-t border-border/60 mt-auto">
          <div>
            <p className="text-[9px] text-muted-foreground font-sans uppercase tracking-widest leading-none mb-0.5">Price</p>
            <p className="text-sm font-headline font-bold text-foreground leading-none">
              {formatPrice(product.price)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5 fill-primary text-primary" />
              <span className="text-[10px] font-sans font-bold text-foreground">{product.rating || '—'}</span>
            </div>
            {product.inStock && (
              <button
                onClick={handleAddToCart}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${added
                  ? 'bg-green-600 text-white'
                  : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                }`}
                title="Add to cart"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};