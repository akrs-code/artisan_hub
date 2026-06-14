import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

const CatalogFilterBar = () => {
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
          <select className="w-full bg-transparent border border-neutral-dark/15 rounded-md py-2.5 pl-4 pr-10 text-[13px] font-sans text-neutral-dark appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer">
            <option>All Categories</option>
            <option>Ceramics</option>
            <option>Textiles</option>
            <option>Woodwork</option>
            <option>Home Decor</option>
            <option>Glassware</option>
            <option>Stationery</option>
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
          <select className="w-full bg-transparent border border-neutral-dark/15 rounded-md py-2.5 pl-4 pr-10 text-[13px] font-sans text-neutral-dark appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer">
            <option>All Status</option>
            <option>Active</option>
            <option>Draft</option>
            <option>Out of Stock</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDown className="h-4 w-4 text-neutral-dark/40" />
          </div>
        </div>
      </div>

      {/* Filter Button */}
      <div className="flex items-end">
        <button className="btn-primary w-full md:w-auto h-[42px] px-6 text-[11px] tracking-widest uppercase font-bold bg-[#5B4F43] hover:bg-[#4A4036]">
          Filter Results
        </button>
      </div>
    </div>
  );
};

export default CatalogFilterBar;
