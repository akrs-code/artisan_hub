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

export const ProductVariants = ({
  product,
  selectedColor,
  onColorChange,
  selectedSize,
  onSizeChange,
}) => (
  <div className="space-y-5 mb-6 bg-card border border-border/80 p-4 rounded-xl">
    {/* Color */}
    {product.colors?.length > 0 && (
      <div>
        <p className="text-xs font-sans font-bold text-foreground uppercase tracking-widest mb-3 flex items-center justify-between">
          <span>COLOR</span>
          <span className="text-primary font-semibold font-body normal-case tracking-normal">{selectedColor}</span>
        </p>
        <div className="flex flex-wrap gap-2.5">
          {product.colors.map((color) => {
            const isSelected = selectedColor === color;
            return (
              <button
                key={color}
                onClick={() => onColorChange(color)}
                className={`group relative flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'bg-primary/5 border-primary shadow-sm'
                    : 'bg-background hover:bg-muted/30 border-border'
                }`}
                title={color}
              >
                {/* Color Dot Swatch */}
                <span
                  className={`w-3.5 h-3.5 rounded-full border shadow-xs transition-transform group-hover:scale-115 shrink-0 ${
                    isSelected ? 'ring-2 ring-primary/40 border-primary' : 'border-border/80'
                  }`}
                  style={{ backgroundColor: getColorHex(color) }}
                />
                {/* Color Name */}
                <span className={`text-xs font-sans font-bold transition-colors ${
                  isSelected ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                }`}>
                  {color}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    )}

    {/* Size */}
    {product.sizes?.length > 0 && (
      <div>
        <p className="text-xs font-sans font-bold text-foreground uppercase tracking-widest mb-3 flex items-center justify-between">
          <span>SIZE</span>
          <span className="text-primary font-semibold font-body normal-case tracking-normal">{selectedSize}</span>
        </p>
        <div className="flex flex-wrap gap-2.5">
          {product.sizes.map((size) => {
            const isSelected = selectedSize === size;
            return (
              <button
                key={size}
                onClick={() => onSizeChange(size)}
                className={`px-4 py-2 rounded-xl text-xs font-sans font-bold border transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-background hover:bg-muted/30 text-muted-foreground hover:text-foreground border-border'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>
    )}
  </div>
);
