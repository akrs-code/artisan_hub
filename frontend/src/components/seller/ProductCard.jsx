import React, { useState } from 'react';
import { Edit3, Trash2, Star } from 'lucide-react';

const formatPrice = (centavos) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(centavos / 100);

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

const ProductCard = ({ product, onEdit, onDelete }) => {
  const { name, category, price, stockQuantity, inStock, imageUrl, colors = [], sizes = [], rating = 0 } = product;

  // Determine status badge
  let statusBadge = { label: 'Active', classes: 'bg-[#8C5233] text-white' };
  if (!inStock || stockQuantity === 0) {
    statusBadge = { label: 'Out of Stock', classes: 'bg-destructive text-white' };
  }

  return (
    <div className="bg-card border border-border/80 rounded-xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-(--shadow-soft-lg) hover:border-primary/30 group relative">
      
      {/* IMAGE */}
      <div className="relative h-40 bg-muted overflow-hidden block shrink-0">
        <img
          src={imageUrl || 'https://placehold.co/400x300/F5F0E8/8C5233?text=Product+Image'}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Status Badge */}
        <div className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[8px] font-sans font-bold uppercase tracking-widest ${statusBadge.classes}`}>
          {statusBadge.label}
        </div>
      </div>

      {/* BODY */}
      <div className="flex flex-col flex-1 p-3.5">
        
        {/* Category */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] font-sans font-bold text-primary uppercase tracking-widest">
            {category || 'Uncategorized'}
          </span>
        </div>

        {/* Name */}
        <h3 className="font-headline font-bold text-sm text-foreground hover:text-primary transition-colors leading-snug line-clamp-1 mb-1">
          {name}
        </h3>

        {/* Variants */}
        {(sizes.length > 0 || colors.length > 0) && (
          <div className="flex items-center justify-between gap-2 py-2 mb-2.5">
            {sizes.length > 0 ? (
              <div className="flex gap-1 overflow-x-auto hide-scrollbar">
                {sizes.slice(0, 3).map((size) => (
                  <span
                    key={size}
                    className="h-4.5 min-w-5 px-1.5 rounded-md text-[8px] font-sans font-bold border border-border/60 text-muted-foreground flex items-center justify-center"
                  >
                    {size}
                  </span>
                ))}
              </div>
            ) : <div />}

            {colors.length > 0 && (
              <div className="flex gap-1 shrink-0">
                {colors.slice(0, 4).map((color) => (
                  <span
                    key={color}
                    title={color}
                    className="w-3.5 h-3.5 rounded-full border border-border/60"
                    style={{ backgroundColor: getColorHex(color) }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Price & Stock & Rating */}
        <div className="flex items-center justify-between pt-2.5 border-t border-border/50 mb-4 mt-auto">
          <div>
            <p className="text-[9px] text-muted-foreground font-sans uppercase tracking-widest leading-none mb-0.5">Price</p>
            <p className="text-sm font-headline font-bold text-foreground leading-none">
              {formatPrice(price)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[9px] text-muted-foreground font-sans uppercase tracking-widest leading-none mb-0.5">Stock</p>
            <p className="text-xs font-sans font-bold text-foreground leading-none">
              {stockQuantity} units
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
          <button
            onClick={() => onEdit(product)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-border/80 hover:bg-neutral-dark/5 hover:text-primary text-[10px] font-sans font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit
          </button>
          
          <button
            onClick={() => onDelete(product._id)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-red-200 bg-red-50/50 hover:bg-red-50 text-red-600 text-[10px] font-sans font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
