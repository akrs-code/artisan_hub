import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Store, Package, Loader2 } from 'lucide-react';
import { shopsAPI, productsAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { ShopCard } from '@/components/buyer/shops/ShopCard';
import { ProductCard } from '@/components/buyer/products/ProductCard';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SavedShops = () => {
  const { savedShopIds, toggleSaveShop, savedProductIds, addToCart } = useCart();
  const [activeTab, setActiveTab] = useState('shops');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [allShops, setAllShops] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [shopsRes, productsRes] = await Promise.all([
          shopsAPI.getShops(),
          productsAPI.getProducts(),
        ]);
        setAllShops(shopsRes?.data || []);
        setAllProducts(productsRes?.data || []);
      } catch (err) {
        console.error('Failed to load saved items:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const baseShops = allShops.filter((shop) => savedShopIds.includes(shop._id));
  const baseProducts = allProducts.filter((prod) => savedProductIds?.includes(prod._id));

  const categories = ['All', ...new Set(
    activeTab === 'shops' ? baseShops.map(s => s.category).filter(Boolean) : baseProducts.map(p => p.category).filter(Boolean)
  )];

  const handleTabChange = (tab) => { setActiveTab(tab); setSelectedCategory('All'); setSearchQuery(''); };

  const filteredShops = baseShops.filter(shop => {
    const q = searchQuery.toLowerCase();
    return (shop.name?.toLowerCase().includes(q) || shop.description?.toLowerCase().includes(q))
      && (selectedCategory === 'All' || shop.category === selectedCategory);
  });

  const filteredProducts = baseProducts.filter(prod => {
    const q = searchQuery.toLowerCase();
    return (prod.name?.toLowerCase().includes(q) || prod.description?.toLowerCase().includes(q))
      && (selectedCategory === 'All' || prod.category === selectedCategory);
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-sans text-muted-foreground">Loading your saved items...</p>
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-10 py-10 max-w-7xl mx-auto w-full animate-in fade-in duration-500">

      
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold text-foreground tracking-tight mb-1">Saved Items</h1>
        <p className="text-muted-foreground font-sans text-xs">Your curated collection of favourite artisans and products.</p>
      </div>

      {/* TABS */}
      <Tabs>
        <TabsList>
          {[
            { key: 'shops', icon: Store, label: 'Shops', count: baseShops.length },
            { key: 'products', icon: Package, label: 'Products', count: baseProducts.length },
          ].map(({ key, icon: Icon, label, count }) => (
            <TabsTrigger
              key={key}
              active={activeTab === key}
              onClick={() => handleTabChange(key)}
              className="mr-4"
            >
              <Icon className="w-3.5 h-3.5" />
              {label} ({count})
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* SEARCH + FILTER */}
      {((activeTab === 'shops' && baseShops.length > 0) || (activeTab === 'products' && baseProducts.length > 0)) && (
        <div className="flex flex-col sm:flex-row gap-2.5 mb-7">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground z-10" />
            <Input
              type="text"
              placeholder={`Search saved ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs"
            />
          </div>
          {categories.length > 2 && (
            <div className="relative min-w-37.5">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none z-10" />
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-9 pr-8 py-2 text-xs"
              >
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </Select>
            </div>
          )}
        </div>
      )}

      {/* CONTENT */}
      {activeTab === 'shops' ? (
        baseShops.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-xl border border-border/80 flex flex-col items-center">
            <Store className="w-10 h-10 text-muted-foreground/20 mb-4" />
            <h3 className="text-lg font-headline font-bold text-foreground mb-2">Your Shop Collection is Empty</h3>
            <p className="text-muted-foreground font-sans text-xs max-w-md mb-6 leading-relaxed">
              You haven't saved any artisan shops yet. Explore our discover catalog to find unique craftsmen and local products.
            </p>
            <Link to="/discover" className="btn-base btn-primary px-6 py-2 rounded-xl font-sans font-bold text-xs uppercase tracking-widest">
              Explore Shops
            </Link>
          </div>
        ) : filteredShops.length === 0 ? (
          <div className="text-center py-12 text-xs text-muted-foreground font-sans bg-card border border-border/80 rounded-xl">
            No saved shops match your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredShops.map((shop) => (
              <ShopCard key={shop._id} shop={shop} />
            ))}
          </div>
        )
      ) : (
        baseProducts.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-xl border border-border/80 flex flex-col items-center">
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
          <div className="text-center py-12 text-xs text-muted-foreground font-sans bg-card border border-border/80 rounded-xl">
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
