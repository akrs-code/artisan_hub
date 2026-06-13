import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Store, Package } from 'lucide-react';
import { mockShops, mockProducts } from '../../lib/mockData';
import { useCart } from '../../context/CartContext';
import { SavedShopCard } from '@/components/buyer/saved-shops/SavedShopCard';
import { EmptySavedShops } from '@/components/buyer/saved-shops/EmptySavedShops';
import { ProductCard } from '@/components/buyer/products/ProductCard';

const SavedShops = () => {
  const { savedShopIds, toggleSaveShop, savedProductIds, addToCart } = useCart();
  const [activeTab, setActiveTab] = useState('shops');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const baseShops = mockShops.filter((shop) => savedShopIds.includes(shop._id));
  const baseProducts = mockProducts.filter((prod) => savedProductIds?.includes(prod._id));

  const categories = ['All', ...new Set(
    activeTab === 'shops' ? baseShops.map(s => s.category) : baseProducts.map(p => p.category)
  )];

  const handleTabChange = (tab) => { setActiveTab(tab); setSelectedCategory('All'); setSearchQuery(''); };

  const filteredShops = baseShops.filter(shop => {
    const q = searchQuery.toLowerCase();
    return (shop.name.toLowerCase().includes(q) || shop.description.toLowerCase().includes(q))
      && (selectedCategory === 'All' || shop.category === selectedCategory);
  });

  const filteredProducts = baseProducts.filter(prod => {
    const q = searchQuery.toLowerCase();
    return (prod.name.toLowerCase().includes(q) || prod.description.toLowerCase().includes(q))
      && (selectedCategory === 'All' || prod.category === selectedCategory);
  });

  return (
    <div className="px-6 lg:px-10 py-10 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-sans font-medium text-muted-foreground mb-8">
        <Link to="/" className="hover:text-primary transition-colors">Discovery</Link>
        <span className="text-border">/</span>
        <span className="text-foreground font-bold">Saved Items</span>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold text-foreground tracking-tight mb-1">Saved Items</h1>
        <p className="text-muted-foreground font-sans text-xs">Your curated collection of favourite artisans and products.</p>
        <div className="decorative-line decorative-line-primary w-16 mt-3" />
      </div>

      {/* TABS */}
      <div className="flex items-center gap-1 border-b border-border/60 mb-6">
        {[
          { key: 'shops', icon: Store, label: 'Shops', count: baseShops.length },
          { key: 'products', icon: Package, label: 'Products', count: baseProducts.length },
        ].map(({ key, icon: Icon, label, count }) => (
          <button
            key={key}
            onClick={() => handleTabChange(key)}
            className={`flex items-center gap-1.5 pb-3 px-1 text-xs font-sans font-bold transition-colors border-b-2 mr-4 ${
              activeTab === key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label} ({count})
          </button>
        ))}
      </div>

      {/* SEARCH + FILTER */}
      {((activeTab === 'shops' && baseShops.length > 0) || (activeTab === 'products' && baseProducts.length > 0)) && (
        <div className="flex flex-col sm:flex-row gap-2.5 mb-7">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder={`Search saved ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-card border border-border/70 rounded-xl text-xs font-sans focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
            />
          </div>
          {categories.length > 2 && (
            <div className="relative min-w-[150px]">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-card border border-border/70 rounded-xl text-xs font-sans appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm cursor-pointer"
              >
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          )}
        </div>
      )}

      {/* CONTENT */}
      {activeTab === 'shops' ? (
        baseShops.length === 0 ? (
          <EmptySavedShops />
        ) : filteredShops.length === 0 ? (
          <div className="text-center py-12 text-xs text-muted-foreground font-sans bg-card border border-border/80 rounded-2xl">
            No saved shops match your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredShops.map((shop) => (
              <SavedShopCard key={shop._id} shop={shop} onUnsave={toggleSaveShop} />
            ))}
          </div>
        )
      ) : (
        baseProducts.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-border/80 flex flex-col items-center">
            <Package className="w-10 h-10 text-muted-foreground/20 mb-4" />
            <h3 className="text-lg font-headline font-bold text-foreground mb-2">Your Product Collection is Empty</h3>
            <p className="text-muted-foreground font-sans text-xs max-w-md mb-6 leading-relaxed">
              You haven't saved any products yet. Explore our artisan catalog to discover unique, handcrafted pieces.
            </p>
            <Link to="/" className="btn-base btn-primary px-6 py-2 rounded-xl font-sans font-bold text-xs uppercase tracking-widest">
              Explore Catalog
            </Link>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-xs text-muted-foreground font-sans bg-card border border-border/80 rounded-2xl">
            No saved products match your search.
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((prod) => (
              <ProductCard key={prod._id} product={prod} onAddToCart={addToCart} />
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default SavedShops;
