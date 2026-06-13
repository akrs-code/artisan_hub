import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockProducts, mockShops } from '../../lib/mockData';
import {
  ChevronLeft, ShoppingCart, Star, ShieldCheck, Truck,
  Heart, MapPin, Package, Share2, ZoomIn,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

const formatPrice = (centavos) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(centavos / 100);

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [shop, setShop] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    const foundProduct = mockProducts.find((p) => p._id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setShop(mockShops.find((s) => s._id === foundProduct.shop));
      setSelectedSize(foundProduct.sizes?.[0] || '');
      setSelectedColor(foundProduct.colors?.[0] || '');
    }
  }, [id]);

  if (!product || !shop) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-t-primary border-border" />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const decrement = () => setQuantity((q) => Math.max(1, q - 1));
  const increment = () => setQuantity((q) => (product.stockQuantity ? Math.min(product.stockQuantity, q + 1) : q + 1));

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-10 py-10 w-full animate-in fade-in duration-500">
      <div className="flex items-center gap-2 text-sm font-sans font-medium text-muted-foreground mb-8">
        <Link to="/" className="hover:text-primary transition-colors">Discovery</Link>
        <span>/</span>
        <Link to={`/shop/${shop._id}`} className="hover:text-primary transition-colors">{shop.name}</Link>
        <span>/</span>
        <span className="text-foreground font-bold">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        <div className="flex flex-col gap-4">
          <div
            className="relative rounded-3xl overflow-hidden bg-muted aspect-square cursor-zoom-in group"
            onClick={() => setIsZoomed(!isZoomed)}
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
            <div className="absolute bottom-4 right-4 bg-card/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-sans font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ZoomIn className="w-3.5 h-3.5" />
              Zoom
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                aria-label="Save product"
                className="icon-square !w-9 !h-9 !rounded-full bg-card/80 backdrop-blur-sm !text-foreground hover:!text-primary border border-border/50 shadow-[var(--shadow-soft)]"
              >
                <Heart className="w-4 h-4" />
              </button>
              <button
                aria-label="Share product"
                className="icon-square !w-9 !h-9 !rounded-full bg-card/80 backdrop-blur-sm !text-foreground hover:!text-primary border border-border/50 shadow-[var(--shadow-soft)]"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-7">
            <Link
              to={`/shop/${shop._id}`}
              className="text-primary font-sans font-bold tracking-[0.2em] uppercase text-[10px] hover:text-primary-dark transition-colors duration-200 mb-3 inline-block"
            >
              {shop.name}
            </Link>
            <h1 className="text-4xl lg:text-5xl font-headline font-bold text-foreground tracking-tight mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-5">
              <div className="flex items-center gap-1.5 text-primary">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating || 0) ? 'fill-primary' : 'text-muted/40'}`} />
                ))}
                <span className="font-bold font-sans text-sm ml-1">{product.rating || '0'}</span>
                <span className="text-muted-foreground text-sm font-sans">({product.reviewCount || '0'} reviews)</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <span className="chip-pill chip-pill-primary text-xs !px-3 !py-1">
                {product.category}
              </span>
            </div>

            <p className="text-4xl font-headline font-bold text-foreground">
              {formatPrice(product.price)}
            </p>
          </div>

          <div className="w-full h-px bg-border mb-7" />

          <p className="text-base text-muted-foreground leading-relaxed mb-7 font-body">
            {product.description}
          </p>

          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground block mb-3">
                Size
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`chip-pill text-xs ${selectedSize === size
                      ? 'chip-pill-primary'
                      : 'bg-card border border-border text-foreground hover:border-primary/60'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors && product.colors.length > 0 && (
            <div className="mb-8">
              <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground block mb-3">
                Color
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`chip-pill text-xs ${selectedColor === color
                      ? 'chip-pill-primary'
                      : 'bg-card border border-border text-foreground hover:border-primary/60'
                      }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="card-custom !p-5 !rounded-2xl space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground">
                Quantity
              </span>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center border border-border rounded-lg overflow-hidden h-10 bg-background">
                  <button
                    onClick={decrement}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="w-10 h-full flex items-center justify-center text-foreground hover:bg-muted transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed text-lg font-light"
                  >
                    −
                  </button>
                  <div className="w-12 h-full flex items-center justify-center font-bold text-base border-x border-border font-sans">
                    {quantity}
                  </div>
                  <button
                    onClick={increment}
                    disabled={product.stockQuantity ? quantity >= product.stockQuantity : false}
                    aria-label="Increase quantity"
                    className="w-10 h-full flex items-center justify-center text-foreground hover:bg-muted transition-colors duration-150 text-lg font-light disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
                {product.stockQuantity !== undefined && (
                  <span className="text-[10px] text-muted-foreground font-sans">
                    {product.stockQuantity} items available
                  </span>
                )}
              </div>
            </div>

            <div className="w-full h-px bg-border" />

            <div className="space-y-3 text-sm font-body">
              <div className="flex items-center gap-3">
                <div className="icon-square icon-square-secondary !w-8 !h-8 !rounded-md shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-sans font-semibold text-foreground text-xs block">Nationwide Shipping</span>
                  <span className="text-xs text-muted-foreground">Estimated 3–7 business days</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="icon-square icon-square-primary !w-8 !h-8 !rounded-md shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-sans font-semibold text-foreground text-xs block">Authentic Artisan Craft</span>
                  <span className="text-xs text-muted-foreground">Verified heritage product</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="icon-square icon-square-tertiary !w-8 !h-8 !rounded-md shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-sans font-semibold text-foreground text-xs block">Pickup Available</span>
                  <span className="text-xs text-muted-foreground">{shop.address}</span>
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-border" />

            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-sans text-muted-foreground uppercase tracking-wider block mb-0.5">
                  Subtotal
                </span>
                <span className="text-2xl font-headline font-bold text-foreground">
                  {formatPrice(product.price * quantity)}
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  disabled={!product.inStock}
                  onClick={handleAddToCart}
                  className={`btn-base gap-2 text-sm h-12 px-6 transition-all duration-200 ${!product.inStock
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : addedFeedback
                      ? 'bg-secondary text-white'
                      : 'btn-primary'
                    }`}
                >
                  {addedFeedback ? (
                    <>
                      <Package className="w-4 h-4" />
                      Added!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </>
                  )}
                </button>
                {addedFeedback && (
                  <Link to="/cart" className="btn-base btn-outlined h-12 px-6 animate-in fade-in zoom-in duration-300">
                    View Cart <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
