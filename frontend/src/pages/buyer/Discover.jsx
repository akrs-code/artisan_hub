import { useState, useEffect, useMemo } from 'react';
import { Compass, Package, Loader2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { shopsAPI, productsAPI, ordersAPI } from '../../services/api';

import { ProductCard } from '@/components/buyer/products/ProductCard';
import { DiscoverHero } from '@/components/buyer/discover/DiscoverHero';
import { DiscoverFilters } from '@/components/buyer/discover/DiscoverFilters';
import { ShopCard } from '@/components/buyer/shops/ShopCard';
import { Button } from '@/components/ui/button';

const Discover = () => {
  const { addToCart, toggleSaveShop, savedShopIds, savedProductIds } = useCart();

  const [activeTab, setActiveTab] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState(0);

  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMarketplaceData = async () => {
      try {
        setIsLoading(true);
        const [shopsRes, productsRes, ordersRes] = await Promise.all([
          shopsAPI.getShops(),
          productsAPI.getProducts(),
          ordersAPI.getMyOrders()
        ]);

        const verifiedShops = (shopsRes?.data || []).filter(s => s.isVerified);
        setShops(verifiedShops);
        setProducts(productsRes?.data || []);
        setOrders(ordersRes?.data || []);
      } catch (err) {
        console.error("Failed to load marketplace data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadMarketplaceData();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedCategory('All');
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating(0);
  };


  const productCategories = useMemo(
    () => ['All', ...new Set(products.map((p) => p.category))],
    [products]
  );
  const shopCategories = useMemo(
    () => ['All', ...new Set(shops.map((s) => s.category))],
    [shops]
  );
  const categories = activeTab === 'products' ? productCategories : shopCategories;


  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase();
    let list = products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchMinPrice = minPrice === '' || p.price >= Number(minPrice);
      const matchMaxPrice = maxPrice === '' || p.price <= Number(maxPrice);
      const matchRating = minRating === 0 || (p.rating || 0) >= minRating;
      return matchSearch && matchCat && matchMinPrice && matchMaxPrice && matchRating;
    });
    if (sortBy === 'rating_desc') list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortBy === 'price_asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === 'price_desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === 'newest') list = [...list].reverse();
    return list;
  }, [searchQuery, selectedCategory, sortBy, minPrice, maxPrice, minRating, products]);

  const filteredShops = useMemo(() => {
    const q = searchQuery.toLowerCase();
    let list = shops.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.address?.toLowerCase().includes(q);
      const matchCat = selectedCategory === 'All' || s.category === selectedCategory;
      const matchRating = minRating === 0 || (s.rating || 0) >= minRating;
      return matchSearch && matchCat && matchRating;
    });
    if (sortBy === 'rating_desc') list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortBy === 'newest') list = [...list].reverse();
    return list;
  }, [searchQuery, selectedCategory, sortBy, minRating, shops]);

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'All' || sortBy !== 'featured' || minPrice !== '' || maxPrice !== '' || minRating !== 0;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('featured');
    setMinPrice('');
    setMaxPrice('');
    setMinRating(0);
  };

  const resultCount = activeTab === 'products' ? filteredProducts.length : filteredShops.length;

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm font-sans text-muted-foreground">Loading marketplace...</p>
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-10 py-10 max-w-7xl mx-auto w-full">


      <DiscoverHero onExploreShops={() => handleTabChange('shops')} />




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
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        minRating={minRating}
        setMinRating={setMinRating}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
        resultCount={resultCount}
        shopCount={shops.length}
        productCount={products.length}
      />

      {/* ── Product Grid ─────────────────────────────────────────────── */}
      {activeTab === 'products' && (
        filteredProducts.length === 0 ? (
          <div className="text-center py-20 glass-card flex flex-col items-center">
            <Package className="w-10 h-10 text-muted-foreground/20 mb-4" />
            <h3 className="text-lg font-headline font-bold text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground font-sans text-xs max-w-sm mb-5">
              Try adjusting your search or filters to discover more artisan creations.
            </p>
            <Button onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        )
      )}

      {/* ── Shop Grid ────────────────────────────────────────────────── */}
      {activeTab === 'shops' && (
        filteredShops.length === 0 ? (
          <div className="text-center py-20 glass-card flex flex-col items-center">
            <Compass className="w-10 h-10 text-muted-foreground/20 mb-4" />
            <h3 className="text-lg font-headline font-bold text-foreground mb-2">No shops found</h3>
            <p className="text-muted-foreground font-sans text-xs max-w-sm mb-5">
              Try adjusting your search or filters to find artisan shops near you.
            </p>
            <Button onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredShops.map((shop) => (
              <ShopCard key={shop._id} shop={shop} />
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Discover;
