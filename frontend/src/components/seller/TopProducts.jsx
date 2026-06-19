import React from 'react';

const products = [
  {
    id: 1,
    name: 'Hand-thrown Stoneware Bowl',
    category: 'Ceramics',
    sold: 42,
    price: 'P48',
    image: 'https://placehold.co/100x100/A0522D/F5F0E8?text=Bowl'
  },
  {
    id: 2,
    name: 'Linen Table Runner',
    category: 'Textiles',
    sold: 28,
    price: 'P32',
    image: 'https://placehold.co/100x100/70341B/F5F0E8?text=Linen'
  },
  {
    id: 3,
    name: 'Leather Journal',
    category: 'Accessories',
    sold: 21,
    price: 'P55',
    image: 'https://placehold.co/100x100/362E25/F5F0E8?text=Journal'
  }
];

const TopProducts = () => {
  return (
    <div className="card-custom !p-6 flex flex-col h-full group hover:card-custom-hover">
      <h2 className="text-lg font-headline font-bold text-neutral-dark mb-6">Top Selling Products</h2>

      <div className="flex-1 flex flex-col gap-5">
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-4 group/item cursor-pointer">
            <div className="w-12 h-12 rounded-lg overflow-hidden border border-neutral-dark/10 shadow-sm transition-transform group-hover/item:scale-105">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1">
              <h4 className="text-[13px] font-sans font-bold text-neutral-dark leading-tight group-hover/item:text-primary transition-colors">
                {product.name}
              </h4>
              <p className="text-[11px] font-sans font-mono text-neutral-dark/60 mt-1 flex items-center gap-1.5">
                {product.category}
                <span className="w-1 h-1 rounded-full bg-neutral-dark/30 block" />
                {product.sold} sold
              </p>
            </div>

            <div className="text-[14px] font-bold text-primary">
              {product.price}
            </div>
          </div>
        ))}
      </div>

      <button className="btn-outlined w-full mt-8 py-3 text-[11px] font-bold tracking-widest uppercase">
        View All Inventory
      </button>
    </div>
  );
};

export default TopProducts;
