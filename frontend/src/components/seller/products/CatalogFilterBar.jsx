import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X, Package } from 'lucide-react';

const CATEGORIES = ['All', 'Ceramics', 'Textiles', 'Woodwork', 'Home Decor', 'Glassware', 'Stationery'];
const STATUS_OPTIONS = [
  { value: 'All', label: 'All Status' },
  { value: 'Active', label: 'Active (In Stock)' },
  { value: 'OutOfStock', label: 'Out of Stock' },
];

const CatalogFilterBar = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
}) => {
  const [statusOpen, setStatusOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setStatusOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const currentStatus = STATUS_OPTIONS.find(o => o.value === selectedStatus) || STATUS_OPTIONS[0];
  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'All' || selectedStatus !== 'All';

  const onClearFilters = () => {
    onSearchChange('');
    onCategoryChange('All');
    onStatusChange('All');
  };

  return (
    <div className="space-y-4 mb-6 mt-6">
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, SKU..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="field-input pl-9 pr-9 py-2.5 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Stock Status Dropdown */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setStatusOpen((o) => !o)}
            className={`flex items-center gap-2 px-3.5 py-2.5 bg-card border rounded-xl text-xs font-sans font-semibold transition-all whitespace-nowrap cursor-pointer w-full sm:w-auto ${
              statusOpen
                ? 'border-primary text-primary ring-2 ring-primary/20'
                : 'border-border text-foreground hover:border-primary/40 hover:text-primary'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-muted-foreground" />
            <span>{currentStatus.label}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground ml-auto sm:ml-0 transition-transform duration-200 ${statusOpen ? 'rotate-180' : ''}`} />
          </button>

          {statusOpen && (
            <div className="absolute right-0 top-full mt-1.5 bg-card border border-border rounded-xl shadow-lg z-30 w-52 py-1 animate-in fade-in slide-in-from-top-2 duration-150">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { onStatusChange(opt.value); setStatusOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-sans transition-colors cursor-pointer ${
                    selectedStatus === opt.value
                      ? 'text-primary font-semibold bg-primary/8'
                      : 'text-foreground hover:bg-muted/60'
                  }`}
                >
                  {opt.label}
                  {selectedStatus === opt.value && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-sans font-semibold border transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-card text-foreground border-border hover:border-primary/50 hover:text-primary'
            }`}
          >
            {cat}
          </button>
        ))}

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-sans font-semibold border border-destructive/25 bg-destructive/8 text-destructive hover:bg-destructive/15 transition-all cursor-pointer"
          >
            <X className="w-3 h-3" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
};

export default CatalogFilterBar;
