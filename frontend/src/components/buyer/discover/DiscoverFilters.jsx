import { Search, SlidersHorizontal, Store, Package, X, ChevronDown, Sparkles, Star, Clock, TrendingUp } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'featured',   label: 'Featured',           icon: Sparkles },
  { value: 'rating_desc',label: 'Top Rated',          icon: Star },
  { value: 'newest',     label: 'Newest',             icon: Clock },
  { value: 'price_asc',  label: 'Price: Low → High',  icon: TrendingUp },
  { value: 'price_desc', label: 'Price: High → Low',  icon: TrendingUp },
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
  showSortMenu,
  onToggleSortMenu,
  categories,
  selectedCategory,
  onCategoryChange,
  hasActiveFilters,
  onClearFilters,
  displayCount,
  totalCount,
}) => {
  const currentSort = SORT_OPTIONS.find((o) => o.value === sortBy);

  return (
    <>
      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border/60 mb-6">
        {[
          { key: 'products', icon: Package, label: 'Products', count: productCount },
          { key: 'shops',    icon: Store,   label: 'Shops',    count: shopCount },
        ].map(({ key, icon: Icon, label, count }) => (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            className={`flex items-center gap-1.5 pb-3 px-1 text-xs font-sans font-bold transition-colors border-b-2 mr-4 ${
              activeTab === key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
            <span className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
              activeTab === key ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
            }`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-2.5 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder={`Search ${activeTab}…`}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-card border border-border/70 rounded-xl text-xs font-sans focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="relative">
          <button
            onClick={onToggleSortMenu}
            className="flex items-center gap-2 pl-3 pr-3 py-2 bg-card border border-border/70 rounded-xl text-xs font-sans font-bold text-foreground hover:border-primary/40 transition-all shadow-sm whitespace-nowrap"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
            {currentSort?.label}
            <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
          </button>
          {showSortMenu && (
            <div className="absolute right-0 top-full mt-1.5 bg-card border border-border/80 rounded-xl shadow-lg z-20 w-48 py-1 animate-in fade-in slide-in-from-top-2 duration-150">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onSortChange(opt.value)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-sans transition-colors ${
                    sortBy === opt.value ? 'text-primary font-bold bg-primary/5' : 'text-foreground hover:bg-muted/50'
                  }`}
                >
                  <opt.icon className="w-3 h-3" />
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-7">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`chip-pill text-xs transition-all ${
              selectedCategory === cat
                ? 'chip-pill-primary'
                : 'bg-card border border-border text-foreground hover:border-primary/50'
            }`}
          >
            {cat}
          </button>
        ))}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 px-3 py-1.5 rounded-sm text-xs font-sans text-muted-foreground hover:text-destructive hover:border-destructive/40 border border-border/60 bg-card transition-all"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground font-sans mb-5">
        {displayCount === 0 ? 'No results' : `Showing ${displayCount} of ${totalCount} ${activeTab}`}
      </p>
    </>
  );
};
