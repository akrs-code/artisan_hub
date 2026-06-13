import { Search } from 'lucide-react';

export const MapSearchBar = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories
}) => {
  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 w-[calc(100%-2rem)] max-w-md pointer-events-none">

      {/* Search Input */}
      <div className="relative pointer-events-auto bg-card rounded-xl shadow-lg border border-border/50 mb-3 flex items-center h-12 overflow-hidden">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search artisans, shops, or categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search artisans, shops, or categories"
          className="w-full h-full pl-11 pr-4 bg-transparent text-sm font-sans outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
        />
      </div>

      {/* Floating Category Pills */}
      <div className="pointer-events-auto flex gap-2 overflow-x-auto hide-scrollbar pb-2 px-1">
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              aria-pressed={isActive}
              className={`
                shrink-0 px-4 py-2 rounded-md text-xs font-label font-medium shadow-sm border transition-all duration-200 whitespace-nowrap cursor-pointer
                ${isActive
                  ? 'bg-primary text-primary-foreground border-primary shadow-md'
                  : 'bg-card text-foreground border-border hover:bg-muted'
                }
              `}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
};
