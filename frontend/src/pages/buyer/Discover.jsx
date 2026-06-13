import { useState, useMemo } from 'react';
import { Compass, Package } from 'lucide-react';
import { mockShops, mockProducts } from '../../lib/mockData';
import { useCart } from '../../context/CartContext';

import { ProductCard }      from '@/components/buyer/products/ProductCard';
import { DiscoverHero }     from '@/components/buyer/discover/DiscoverHero';
import { DiscoverStats }    from '@/components/buyer/discover/DiscoverStats';
import { DiscoverFilters }  from '@/components/buyer/discover/DiscoverFilters';
import { DiscoverShopCard } from '@/components/buyer/discover/DiscoverShopCard';

const Discover = () => {
  const { addToCart, toggleSaveShop, savedShopIds, savedProductIds } = useCart();

  const [activeTab, setActiveTab]           = useState('products');
  const [searchQuery, setSearchQuery]       = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy]                 = useState('featured');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedCategory('All');
    setSearchQuery('');
  };

  // ── Derived category lists ────────────────────────────────────────────────
  const productCategories = useMemo(
    () => ['All', ...new Set(mockProducts.map((p) => p.category))],
    []
  );
  const shopCategories = useMemo(
    () => ['All', ...new Set(mockShops.map((s) => s.category))],
    []
  );
  const categories = activeTab === 'products' ? productCategories : shopCategories;

  // ── Filter + sort ─────────────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase();
    let list = mockProducts.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      return matchSearch && matchCat;
    });
    if (sortBy === 'rating_desc') list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortBy === 'price_asc')   list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === 'price_desc')  list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === 'newest')      list = [...list].reverse();
    return list;
  }, [searchQuery, selectedCategory, sortBy]);

  const filteredShops = useMemo(() => {
    const q = searchQuery.toLowerCase();
    let list = mockShops.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.address?.toLowerCase().includes(q);
      const matchCat = selectedCategory === 'All' || s.category === selectedCategory;
      return matchSearch && matchCat;
    });
    if (sortBy === 'rating_desc') list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortBy === 'newest')      list = [...list].reverse();
    return list;
  }, [searchQuery, selectedCategory, sortBy]);

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'All' || sortBy !== 'featured';

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('featured');
  };

  const resultCount = activeTab === 'products' ? filteredProducts.length : filteredShops.length;

  return (
    <div className="px-6 lg:px-10 py-10 max-w-7xl mx-auto w-full animate-in fade-in duration-500">

      {/* Hero banner */}
      <DiscoverHero onExploreShops={() => handleTabChange('shops')} />

      {/* Stats strip */}
      <DiscoverStats
        shopCount={mockShops.length}
        productCount={mockProducts.length}
        savedCount={(savedShopIds?.length || 0) + (savedProductIds?.length || 0)}
        ordersCount={2}
      />

      {/* Tabs + Search + Sort + Category pills */}
      <DiscoverFilters
        activeTab={activeTab}
        onTabChange={handleTabChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
        resultCount={resultCount}
        shopCount={mockShops.length}
        productCount={mockProducts.length}
      />

      {/* ── Product Grid ─────────────────────────────────────────────── */}
      {activeTab === 'products' && (
        filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-border/80 flex flex-col items-center">
            <Package className="w-10 h-10 text-muted-foreground/20 mb-4" />
            <h3 className="text-lg font-headline font-bold text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground font-sans text-xs max-w-sm mb-5">
              Try adjusting your search or filters to discover more artisan creations.
            </p>
            <button onClick={clearFilters} className="btn-base btn-primary text-xs px-5 py-2 rounded-xl font-sans font-bold uppercase tracking-widest">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        )
      )}

      {/* ── Shop Grid ────────────────────────────────────────────────── */}
      {activeTab === 'shops' && (
        filteredShops.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-border/80 flex flex-col items-center">
            <Compass className="w-10 h-10 text-muted-foreground/20 mb-4" />
            <h3 className="text-lg font-headline font-bold text-foreground mb-2">No shops found</h3>
            <p className="text-muted-foreground font-sans text-xs max-w-sm mb-5">
              Try adjusting your search or filters to find artisan shops near you.
            </p>
            <button onClick={clearFilters} className="btn-base btn-primary text-xs px-5 py-2 rounded-xl font-sans font-bold uppercase tracking-widest">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredShops.map((shop) => (
              <DiscoverShopCard key={shop._id} shop={shop} />
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Discover;
