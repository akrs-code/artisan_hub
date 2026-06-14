import React from 'react';

const ProductCard = ({ product }) => {
  const { image, status, category, title, price, stock } = product;

  // Determine status badge color
  let badgeColor = 'bg-primary text-white'; // default to active
  if (status === 'DRAFT') {
    badgeColor = 'bg-[#6B5A4B] text-white';
  } else if (status === 'OUT OF STOCK') {
    badgeColor = 'bg-destructive text-white';
  }

  return (
    <div className="card-custom !p-0 overflow-hidden flex flex-col group hover:card-custom-hover h-full">
      {/* Image Area */}
      <div className="relative h-48 bg-neutral-dark/5 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Status Badge */}
        <div className={`absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase shadow-sm ${badgeColor}`}>
          {status}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="text-[10px] font-sans font-bold tracking-widest text-neutral-dark/50 uppercase mb-1.5">
          {category}
        </div>
        <h3 className="text-[15px] font-sans font-bold text-neutral-dark leading-snug mb-5 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Price & Stock Grid */}
        <div className="grid grid-cols-2 gap-4 mt-auto mb-5 border-t border-neutral-dark/5 pt-4">
          <div>
            <div className="text-[9px] font-sans font-bold tracking-widest text-neutral-dark/50 uppercase mb-0.5">
              Price
            </div>
            <div className="text-[14px] font-sans font-medium text-neutral-dark">
              {price}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[9px] font-sans font-bold tracking-widest text-neutral-dark/50 uppercase mb-0.5">
              Stock
            </div>
            <div className="text-[14px] font-sans font-medium text-neutral-dark">
              {stock} units
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <button className="btn-outlined py-2 text-[10px] font-bold tracking-widest uppercase">
            Edit
          </button>
          <button className="btn-primary py-2 text-[10px] font-bold tracking-widest uppercase bg-[#8C5233] hover:bg-[#7E4A2E]">
            Manage
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
