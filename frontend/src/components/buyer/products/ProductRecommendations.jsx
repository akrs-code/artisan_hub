import { useState, useEffect } from 'react';
import { productsAPI } from '@/services/api';
import { ProductCard } from '@/components/buyer/products/ProductCard';
import { Loader2 } from 'lucide-react';

export const ProductRecommendations = ({ product }) => {
  const [related, setRelated] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!product?.shop) return;

    const shopId = typeof product.shop === 'object' ? product.shop._id : product.shop;

    const fetchRelated = async () => {
      try {
        setIsLoading(true);
        const res = await productsAPI.getShopProducts(shopId);
        const all = res?.data || [];
        
        const filtered = all.filter((p) => p._id !== product._id).slice(0, 3);
        setRelated(filtered);
      } catch (err) {
        console.error('Failed to load recommendations:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelated();
  }, [product?._id, product?.shop]);

  if (isLoading) {
    return (
      <div className="mb-8 flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (related.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="page-title mb-4">You May Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {related.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
};
