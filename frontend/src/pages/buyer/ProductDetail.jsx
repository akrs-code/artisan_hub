import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { productsAPI } from '../../services/api';

import { Button } from '@/components/ui/button';
import { ProductImagePanel }   from '@/components/buyer/products/ProductImagePanel';
import { ProductDetailTabs }   from '@/components/buyer/products/ProductDetailTabs';
import { ProductVariants }     from '@/components/buyer/products/ProductVariants';
import { ProductPurchaseCard } from '@/components/buyer/products/ProductPurchaseCard';

const formatPrice = (centavos) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(centavos / 100);

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct]           = useState(null);
  const [shop, setShop]                 = useState(null);
  const [quantity, setQuantity]         = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isZoomed, setIsZoomed]         = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [activeTab, setActiveTab]       = useState('product');
  const [reviews, setReviews]           = useState([]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await productsAPI.getProductBySlug(id);
        const prod = res?.data;
        if (prod) {
          setProduct(prod);
          setShop(prod.shop);
          setSelectedSize(prod.sizes?.[0] || '');
          setSelectedColor(prod.colors?.[0] || '');

          try {
            const revRes = await productsAPI.getProductReviews(prod._id);
            if (revRes?.data) setReviews(revRes.data);
          } catch (e) {
            console.error('Failed to load reviews', e);
          }
        }
      } catch (err) {
        console.error("Failed to load product detail:", err);
      }
    };
    loadProduct();
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

  const handleReviewSubmit = async (rating, comment) => {
    try {
      await productsAPI.addProductReview(product._id, rating, comment);
      const revRes = await productsAPI.getProductReviews(product._id);
      if (revRes?.data) setReviews(revRes.data);
      alert('Review submitted successfully!');
      return true;
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to submit review. You may have already reviewed this product.');
      return false;
    }
  };

  const decrement = () => setQuantity((q) => Math.max(1, q - 1));
  const increment = () => setQuantity((q) =>
    product.stockQuantity ? Math.min(product.stockQuantity, q + 1) : q + 1
  );

  return (
    <div className="w-full pb-24 bg-background min-h-full">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 w-full">

        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => window.history.length > 2 ? navigate(-1) : navigate(`/shop/${shop._id}`)}
          className="mb-8 rounded-full"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* ── Left: Image ─────────────────────────────── */}
          <ProductImagePanel
            product={product}
            isZoomed={isZoomed}
            onZoomToggle={() => setIsZoomed((z) => !z)}
          />

          {/* ── Right: Info + Actions ────────────────────── */}
          <div className="flex flex-col">

            {/* Shop + Title + Rating + Price */}
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
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(product.rating || 0) ? 'fill-primary' : 'text-muted/40'}`}
                    />
                  ))}
                  <span className="font-bold font-sans text-sm ml-1">{product.rating || '0'}</span>
                  <span className="text-muted-foreground text-sm font-sans">
                    ({product.reviewCount || '0'} reviews)
                  </span>
                </div>
                <div className="h-4 w-px bg-border" />
                <span className="chip-pill chip-pill-primary text-xs !px-3 !py-1">{product.category}</span>
              </div>

              <p className="text-4xl font-headline font-bold text-foreground">
                {formatPrice(product.price)}
              </p>
            </div>

            <div className="w-full h-px bg-border mb-7" />

            {/* Detail tabs */}
            <ProductDetailTabs
              product={product}
              shop={shop}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              reviews={reviews}
              onReviewSubmit={handleReviewSubmit}
            />

            {/* Variants */}
            <ProductVariants
              product={product}
              selectedSize={selectedSize}
              onSizeChange={setSelectedSize}
              selectedColor={selectedColor}
              onColorChange={setSelectedColor}
            />

            {/* Purchase card */}
            <ProductPurchaseCard
              product={product}
              shop={shop}
              quantity={quantity}
              onDecrement={decrement}
              onIncrement={increment}
              onAddToCart={handleAddToCart}
              addedFeedback={addedFeedback}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
