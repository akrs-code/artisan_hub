import { Card, CardTitle } from '@/components/ui/card';

export const ProductAboutSection = ({ product }) => {
  // Build a details table from available product fields
  const details = [
    product.material && { label: 'Material', value: product.material },
    product.dimensions && { label: 'Dimensions', value: product.dimensions },
    product.capacity && { label: 'Capacity', value: product.capacity },
    product.care && { label: 'Care', value: product.care },
    product.origin && { label: 'Origin', value: product.origin },
    product.category && { label: 'Category', value: product.category },
  ].filter(Boolean);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
      {/* About this piece */}
      <Card className="border-border/70">
        <CardTitle className="text-lg mb-3">About this piece</CardTitle>
        <p className="text-sm font-body text-muted-foreground leading-relaxed">
          {product.description}
        </p>
      </Card>

      {/* Product Details table */}
      <Card className="border-border/70">
        <CardTitle className="text-lg mb-3">Product Details</CardTitle>
        {details.length > 0 ? (
          <dl className="space-y-3">
            {details.map(({ label, value }) => (
              <div key={label} className="flex items-start justify-between gap-4">
                <dt className="text-xs font-sans text-muted-foreground shrink-0">{label}</dt>
                <dd className="text-xs font-sans font-semibold text-foreground text-right">{value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          /* Fallback when no structured fields — show colours/sizes */
          <dl className="space-y-3">
            {product.colors?.length > 0 && (
              <div className="flex justify-between gap-4">
                <dt className="text-xs font-sans text-muted-foreground">Available Colors</dt>
                <dd className="text-xs font-sans font-semibold text-foreground text-right">{product.colors.join(', ')}</dd>
              </div>
            )}
            {product.sizes?.length > 0 && (
              <div className="flex justify-between gap-4">
                <dt className="text-xs font-sans text-muted-foreground">Available Sizes</dt>
                <dd className="text-xs font-sans font-semibold text-foreground text-right">{product.sizes.join(', ')}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <dt className="text-xs font-sans text-muted-foreground">Category</dt>
              <dd className="text-xs font-sans font-semibold text-foreground text-right">{product.category}</dd>
            </div>
            {product.stockQuantity != null && (
              <div className="flex justify-between gap-4">
                <dt className="text-xs font-sans text-muted-foreground">In Stock</dt>
                <dd className="text-xs font-sans font-semibold text-foreground text-right">{product.stockQuantity} units</dd>
              </div>
            )}
          </dl>
        )}
      </Card>
    </div>
  );
};

