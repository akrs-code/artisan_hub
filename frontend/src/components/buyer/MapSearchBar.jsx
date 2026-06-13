import { Search } from 'lucide-react';

export const MapSearchBar = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories
}) => {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-[calc(100%-2rem)] max-w-lg">
      <div className="bg-background/95 backdrop-blur-md border border-border rounded-2xl shadow-lg p-3">

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

          <input
            type="text"
            placeholder="Search artisans, shops, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search artisans, shops, or categories"
            className="
              w-full
              h-11
              pl-11
              pr-4
              rounded-xl
              border
              border-border
              bg-background
              text-sm
              outline-none
              transition-all
              focus:ring-2
              focus:ring-primary/20
              focus:border-primary
            "
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pt-3 nav-hide-scrollbar">
          {categories.map((category) => {
            const isActive = selectedCategory === category;

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                aria-pressed={isActive}
                className={`
                  shrink-0
                  px-4
                  py-2
                  rounded-full
                  text-xs
                  font-medium
                  border
                  transition-all
                  duration-200
                  whitespace-nowrap
                  cursor-pointer
                  ${isActive
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                  }
                `}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};