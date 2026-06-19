import { mockProducts } from '@/lib/mockData';
import { ProductCard } from '@/components/buyer/products/ProductCard';

export const ProductRecommendations = ({ product }) => {
  // Pick up to 3 products from the same shop, excluding current
  const related = mockProducts
    .filter((p) => p.shop === product.shop && p._id !== product._id)
    .slice(0, 3);

  // If not enough from same shop, fill with other products
  if (related.length < 3) {
    const others = mockProducts
      .filter((p) => p._id !== product._id && p.shop !== product.shop)
      .slice(0, 3 - related.length);
    related.push(...others);
  }

  if (related.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-headline font-bold text-foreground mb-4">You May Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {related.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
};
