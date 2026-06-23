import { useState, useRef, useEffect } from 'react';
import { Search, SlidersHorizontal, Store, Package, X, ChevronDown, Sparkles, Star, Clock, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SORT_OPTIONS = [
  { value: 'featured',   label: 'Featured',          icon: Sparkles   },
  { value: 'rating_desc',label: 'Top Rated',         icon: Star       },
  { value: 'newest',     label: 'Newest',            icon: Clock      },
  { value: 'price_asc',  label: 'Price: Low → High', icon: TrendingUp },
  { value: 'price_desc', label: 'Price: High → Low', icon: TrendingUp },
];

export const DiscoverFilters = ({
  activeTab,
  onTabChange,
  productCount,
  shopCount,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  categories,
  selectedCategory,
  onCategoryChange,
  hasActiveFilters,
  onClearFilters,
  resultCount,
}) => {
  const [sortOpen, setSortOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentSort = SORT_OPTIONS.find((o) => o.value === sortBy) ?? SORT_OPTIONS[0];

  
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSortSelect = (value) => {
    onSortChange(value);
    setSortOpen(false);
  };

  return (
    <>
      
      <Tabs>
        <TabsList>
          {[
            { key: 'products', icon: Package, label: 'Products', count: productCount },
            { key: 'shops',    icon: Store,   label: 'Shops',    count: shopCount    },
          ].map(({ key, icon: Icon, label, count }) => (
            <TabsTrigger
              key={key}
              active={activeTab === key}
              onClick={() => onTabChange(key)}
              className="mr-4"
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
              <span
                className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                  activeTab === key ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                }`}
              >
                {count}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      
      <div className="flex flex-col sm:flex-row gap-2.5 mb-5">
        
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none z-10" />
          <Input
            type="text"
            placeholder={`Search ${activeTab}…`}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-8 py-2 text-xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer z-10"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setSortOpen((o) => !o)}
            className={`flex items-center gap-2 pl-3.5 pr-3 py-2.5 bg-card border rounded-xl text-xs font-sans font-bold transition-all shadow-sm whitespace-nowrap cursor-pointer ${
              sortOpen ? 'border-primary text-primary ring-2 ring-primary/20' : 'border-border/70 text-foreground hover:border-primary/40'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
            {currentSort.label}
            <ChevronDown
              className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {sortOpen && (
            <div className="absolute right-0 top-full mt-1.5 bg-card border border-border/80 rounded-xl shadow-lg z-30 w-52 py-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSortSelect(opt.value)}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-sans transition-colors cursor-pointer ${
                    sortBy === opt.value
                      ? 'text-primary font-bold bg-primary/8'
                      : 'text-foreground hover:bg-muted/50'
                  }`}
                >
                  <opt.icon className={`w-3.5 h-3.5 ${sortBy === opt.value ? 'text-primary' : 'text-muted-foreground'}`} />
                  {opt.label}
                  {sortBy === opt.value && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`chip-pill text-xs transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'chip-pill-primary'
                : 'bg-card border border-border text-foreground hover:border-primary/50 hover:text-primary'
            }`}
          >
            {cat}
          </button>
        ))}

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-sans text-muted-foreground hover:text-destructive hover:border-destructive/40 border border-border/60 bg-card transition-all cursor-pointer"
          >
            <X className="w-3 h-3" /> Clear filters
          </button>
        )}
      </div>

      {/* ── Results count ─────────────────────────────────────────── */}
      <p className="text-xs text-muted-foreground font-sans mb-5">
        {resultCount === 0
          ? `No ${activeTab} found`
          : `${resultCount} ${activeTab} found${hasActiveFilters ? ' · filtered' : ''}`}
      </p>
    </>
  );
};
