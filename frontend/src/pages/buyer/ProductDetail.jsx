import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockProducts, mockShops } from '../../lib/mockData';
import { ChevronLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';

import { ProductImagePanel }       from '@/components/buyer/products/ProductImagePanel';
import { ProductInfoHeader }       from '@/components/buyer/products/ProductInfoHeader';
import { ProductVariants }         from '@/components/buyer/products/ProductVariants';
import { ProductPurchaseCard }     from '@/components/buyer/products/ProductPurchaseCard';
import { ProductAboutSection }     from '@/components/buyer/products/ProductAboutSection';
import { ProductSellerCard }       from '@/components/buyer/products/ProductSellerCard';
import { ProductReviews }          from '@/components/buyer/products/ProductReviews';
import { ProductRecommendations }  from '@/components/buyer/products/ProductRecommendations';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, savedProductIds, toggleSaveProduct } = useCart();

  const [product, setProduct]             = useState(null);
  const [shop, setShop]                   = useState(null);
  const [quantity, setQuantity]           = useState(1);
  const [selectedSize, setSelectedSize]   = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    const found = mockProducts.find((p) => p._id === id);
    if (found) {
      setProduct(found);
      setShop(mockShops.find((s) => s._id === found.shop));
      setSelectedSize(found.sizes?.[0] || '');
      setSelectedColor(found.colors?.[0] || '');
      setQuantity(1);
    }
  }, [id]);

  if (!product || !shop) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-t-primary border-border" />
      </div>
    );
  }

  const isSaved = savedProductIds?.includes(product._id) ?? false;

  const handleAddToCart = () => {
    addToCart(product, quantity, { color: selectedColor, size: selectedSize });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, { color: selectedColor, size: selectedSize });
    navigate('/checkout');
  };

  const decrement = () => setQuantity((q) => Math.max(1, q - 1));
  const increment = () => setQuantity((q) =>
    product.stockQuantity ? Math.min(product.stockQuantity, q + 1) : q + 1
  );

  return (
    <div className="w-full pb-24 animate-in fade-in duration-500 bg-background min-h-full">
      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-8 w-full">

        {/* Back button */}
        <button
          onClick={() => window.history.length > 2 ? navigate(-1) : navigate(`/shop/${shop._id}`)}
          className="inline-flex items-center gap-1.5 mb-6 text-xs font-sans font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 text-primary" /> Back
        </button>

        {/* ── Hero grid: Image (left) + Info (right) ───────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 mb-10">

          {/* Left — image with thumbnail strip */}
          <ProductImagePanel
            product={product}
            isSaved={isSaved}
            onToggleSave={() => toggleSaveProduct?.(product._id)}
          />

          {/* Right — all purchase info */}
          <div className="flex flex-col">
            <ProductInfoHeader product={product} shop={shop} />

            <div className="w-full h-px bg-border/60 mb-5" />

            <ProductVariants
              product={product}
              selectedColor={selectedColor}
              onColorChange={setSelectedColor}
              selectedSize={selectedSize}
              onSizeChange={setSelectedSize}
            />

            <ProductPurchaseCard
              product={product}
              quantity={quantity}
              onDecrement={decrement}
              onIncrement={increment}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              addedFeedback={addedFeedback}
            />
          </div>
        </div>

        {/* ── About + Details ───────────────────────────────────────────── */}
        <ProductAboutSection product={product} />

        {/* ── Sold By banner ────────────────────────────────────────────── */}
        <ProductSellerCard shop={shop} />

        {/* ── Customer Reviews ──────────────────────────────────────────── */}
        <ProductReviews product={product} />

        {/* ── You May Also Like ─────────────────────────────────────────── */}
        <ProductRecommendations product={product} />

      </div>
    </div>
  );
};

export default ProductDetail;
