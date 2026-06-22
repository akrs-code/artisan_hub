import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

const CatalogFilterBar = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
}) => {
  return (
    <div className="card-custom !p-6 flex flex-col md:flex-row gap-6 mb-8 mt-6">
      {/* Search By Name */}
      <div className="flex-1">
        <label className="block text-[11px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase mb-2">
          Search by Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-neutral-dark/40" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-transparent border border-neutral-dark/15 rounded-md py-2.5 pl-9 pr-4 text-[13px] font-sans text-neutral-dark placeholder:text-neutral-dark/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            placeholder="e.g. Stoneware Bowl"
          />
        </div>
      </div>

      {/* Category */}
      <div className="w-full md:w-48">
        <label className="block text-[11px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase mb-2">
          Category
        </label>
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full bg-transparent border border-neutral-dark/15 rounded-md py-2.5 pl-4 pr-10 text-[13px] font-sans text-neutral-dark appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Ceramics">Ceramics</option>
            <option value="Textiles">Textiles</option>
            <option value="Woodwork">Woodwork</option>
            <option value="Home Decor">Home Decor</option>
            <option value="Glassware">Glassware</option>
            <option value="Stationery">Stationery</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDown className="h-4 w-4 text-neutral-dark/40" />
          </div>
        </div>
      </div>

      {/* Stock Status */}
      <div className="w-full md:w-48">
        <label className="block text-[11px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase mb-2">
          Stock Status
        </label>
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full bg-transparent border border-neutral-dark/15 rounded-md py-2.5 pl-4 pr-10 text-[13px] font-sans text-neutral-dark appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Active">Active (In Stock)</option>
            <option value="OutOfStock">Out of Stock</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDown className="h-4 w-4 text-neutral-dark/40" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogFilterBar;
