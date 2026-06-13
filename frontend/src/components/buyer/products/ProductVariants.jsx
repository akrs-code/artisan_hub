export const ProductVariants = ({
  product,
  selectedSize,
  onSizeChange,
  selectedColor,
  onColorChange,
}) => (
  <>
    {product.sizes?.length > 0 && (
      <div className="mb-6">
        <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground block mb-3">
          Size
        </label>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => onSizeChange(size)}
              className={`chip-pill text-xs ${
                selectedSize === size
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

    {product.colors?.length > 0 && (
      <div className="mb-8">
        <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground block mb-3">
          Color
        </label>
        <div className="flex flex-wrap gap-2">
          {product.colors.map((color) => (
            <button
              key={color}
              onClick={() => onColorChange(color)}
              className={`chip-pill text-xs ${
                selectedColor === color
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
  </>
);
