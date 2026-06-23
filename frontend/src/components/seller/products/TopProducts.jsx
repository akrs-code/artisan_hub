import React from 'react';

const TopProducts = ({ products = [] }) => {
  return (
    <div className="ec-card ec-card-hover p-6 flex flex-col h-full group">
      <h2 className="text-lg font-headline font-bold text-foreground mb-6">Top Selling Products</h2>

      <div className="flex-1 flex flex-col gap-5">
        {products.length === 0 ? (
          <p className="text-xs text-muted-foreground">No sales data available yet.</p>
        ) : (
          products.map((product) => (
            <div key={product._id} className="flex items-center gap-4 group/item cursor-pointer">
              <div className="w-12 h-12 rounded-lg overflow-hidden border border-border shadow-sm transition-transform group-hover/item:scale-105 bg-muted flex items-center justify-center">
                <span className="text-[10px] text-muted-foreground">Image</span>
              </div>

              <div className="flex-1">
                <h4 className="text-[13px] font-sans font-bold text-foreground leading-tight group-hover/item:text-primary transition-colors">
                  {product.name}
                </h4>
                <p className="text-[11px] font-sans font-mono text-muted-foreground mt-1 flex items-center gap-1.5">
                  {product.sold} sold
                </p>
              </div>

              <div className="text-[14px] font-bold text-primary">
                {(product.revenue / 100).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
              </div>
            </div>
          ))
        )}
      </div>


    </div>
  );
};

export default TopProducts;
