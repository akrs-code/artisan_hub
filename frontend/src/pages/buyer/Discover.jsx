import { useState, useEffect, useMemo } from 'react';
import { Compass, Package, Loader2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { shopsAPI, productsAPI, ordersAPI } from '../../services/api';

import { ProductCard } from '@/components/buyer/products/ProductCard';
import { DiscoverHero } from '@/components/buyer/discover/DiscoverHero';
import { DiscoverStats } from '@/components/buyer/discover/DiscoverStats';
import { DiscoverFilters } from '@/components/buyer/discover/DiscoverFilters';
import { ShopCard } from '@/components/buyer/shops/ShopCard';

const Discover = () => {
  const { addToCart, toggleSaveShop, savedShopIds, savedProductIds } = useCart();

  const [activeTab, setActiveTab] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

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
      return matchSearch && matchCat;
    });
    if (sortBy === 'rating_desc') list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortBy === 'price_asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === 'price_desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === 'newest') list = [...list].reverse();
    return list;
  }, [searchQuery, selectedCategory, sortBy, products]);

  const filteredShops = useMemo(() => {
    const q = searchQuery.toLowerCase();
    let list = shops.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.address?.toLowerCase().includes(q);
      const matchCat = selectedCategory === 'All' || s.category === selectedCategory;
      return matchSearch && matchCat;
    });
    if (sortBy === 'rating_desc') list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortBy === 'newest') list = [...list].reverse();
    return list;
  }, [searchQuery, selectedCategory, sortBy, shops]);

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'All' || sortBy !== 'featured';

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('featured');
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
    <div className="px-6 lg:px-10 py-10 max-w-7xl mx-auto w-full animate-in fade-in duration-500">

      
      <DiscoverHero onExploreShops={() => handleTabChange('shops')} />

      {/* Stats strip */}
      <DiscoverStats
        shopCount={shops.length}
        productCount={products.length}
        savedCount={(savedShopIds?.length || 0) + (savedProductIds?.length || 0)}
        ordersCount={orders.length}
      />

      
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
        shopCount={shops.length}
        productCount={products.length}
      />

      {/* ── Product Grid ─────────────────────────────────────────────── */}
      {activeTab === 'products' && (
        filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-xl border border-border/80 flex flex-col items-center">
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
          <div className="text-center py-20 bg-card rounded-xl border border-border/80 flex flex-col items-center">
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
              <ShopCard key={shop._id} shop={shop} />
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Discover;
