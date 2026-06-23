import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Store, Loader2, Sparkles } from 'lucide-react';
import CatalogFilterBar from '../../components/seller/CatalogFilterBar';
import ProductCard from '../../components/seller/ProductCard';
import ProductModal from '../../components/seller/ProductModal';
import { shopsAPI, productsAPI } from '../../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { usePHLocations } from '../../hooks/usePHLocations';

const Catalog = () => {
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState('');

  
  const [shopName, setShopName] = useState('');
  const [shopDescription, setShopDescription] = useState('');
  const [shopCategory, setShopCategory] = useState('Ceramics');
  const [shopProvince, setShopProvince] = useState('');
  const [shopCity, setShopCity] = useState('');

  const { provinces, cities, getCities, loadingProvinces, loadingCities } = usePHLocations();

  const handleProvinceChange = (e) => {
    const val = e.target.value;
    setShopProvince(val);
    setShopCity('');
    const prov = provinces.find(p => p.name === val);
    if (prov) {
      getCities(prov.code);
    } else {
      getCities(null);
    }
  };

  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  
  useEffect(() => {
    fetchOwnedShop();
  }, []);

  const fetchOwnedShop = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await shopsAPI.getOwned();
      if (response && response.data) {
        setShop(response.data);
        await fetchProducts(response.data._id);
      }
    } catch (err) {
      if (err.status === 404) {
        
        setShop(null);
      } else {
        setError(err.message || 'Failed to fetch shop details.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async (shopId) => {
    try {
      const response = await productsAPI.getShopProducts(shopId);
      if (response && response.data) {
        setProducts(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load products.');
    }
  };

  
  const handleCreateShop = async (e) => {
    e.preventDefault();
    setIsActionLoading(true);
    setError('');

    try {
      if (!shopName || !shopCity || !shopProvince) {
        throw new Error('Shop Name, City, and Province are required.');
      }

      
      
      const formData = new FormData();
      formData.append('name', shopName);
      formData.append('description', shopDescription);
      formData.append('category', shopCategory);
      formData.append('address', `${shopCity}, ${shopProvince}`);
      formData.append('lat', '14.5995'); 
      formData.append('lng', '121.0215');

      const response = await shopsAPI.createShop(formData);
      if (response && response.data) {
        setShop(response.data);
        await fetchProducts(response.data._id);
      }
    } catch (err) {
      setError(err.message || 'Failed to initialize your shop.');
    } finally {
      setIsActionLoading(false);
    }
  };

  
  const handleSaveProduct = async (formData, productId) => {
    setIsActionLoading(true);
    try {
      if (productId) {
        
        const response = await productsAPI.updateProduct(productId, formData);
        if (response && response.data) {
          setProducts((prev) =>
            prev.map((p) => (p._id === productId ? response.data : p))
          );
        }
      } else {
        
        const response = await productsAPI.createProduct(shop._id, formData);
        if (response && response.data) {
          setProducts((prev) => [response.data, ...prev]);
        }
      }
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      throw new Error(err.message || 'Failed to save product.');
    } finally {
      setIsActionLoading(false);
    }
  };

  
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await productsAPI.deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      alert(err.message || 'Failed to delete product.');
    }
  };

  
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const nameMatch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
      
      let statusMatch = true;
      if (selectedStatus === 'Active') {
        statusMatch = product.inStock && product.stockQuantity > 0;
      } else if (selectedStatus === 'OutOfStock') {
        statusMatch = !product.inStock || product.stockQuantity === 0;
      }

      return nameMatch && categoryMatch && statusMatch;
    });
  }, [products, searchQuery, selectedCategory, selectedStatus]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm font-sans text-muted-foreground">Loading your catalog details...</p>
      </div>
    );
  }

  
  if (!shop) {
    return (
      <div className="px-6 lg:px-10 py-10 max-w-2xl mx-auto w-full animate-in fade-in duration-500">
        <div className="bg-card border border-border rounded-2xl text-center p-8 space-y-6">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <Store className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-headline font-bold text-foreground">
              Create Your Artisan Shop
            </h1>
            <p className="text-sm text-muted-foreground font-sans max-w-md mx-auto">
              Before listing products, set up your shop's identity. This will establish your storefront for buyers.
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-destructive/10 border border-destructive/20 rounded-xl text-xs font-sans text-destructive font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleCreateShop} className="space-y-4 text-left pt-4">
            <div className="space-y-2">
              <Label htmlFor="shopName" className="text-xs font-semibold text-foreground uppercase tracking-wide">Shop Name</Label>
              <Input
                id="shopName"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="e.g. Clay & Co. Studio"
                required
                disabled={isActionLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shopCategory" className="text-xs font-semibold text-foreground uppercase tracking-wide">Primary Craft/Category</Label>
              <select
                id="shopCategory"
                value={shopCategory}
                onChange={(e) => setShopCategory(e.target.value)}
                disabled={isActionLoading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Ceramics">Ceramics</option>
                <option value="Textiles">Textiles</option>
                <option value="Woodwork">Woodwork</option>
                <option value="Home Decor">Home Decor</option>
                <option value="Glassware">Glassware</option>
                <option value="Stationery">Stationery</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shopProvince" className="text-xs font-semibold text-foreground uppercase tracking-wide">Province</Label>
                <select
                  id="shopProvince"
                  value={shopProvince}
                  onChange={handleProvinceChange}
                  disabled={isActionLoading || loadingProvinces}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="" disabled>Select Province</option>
                  {provinces.map(prov => (
                    <option key={prov.code} value={prov.name}>{prov.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shopCity" className="text-xs font-semibold text-foreground uppercase tracking-wide">City / Municipality</Label>
                <select
                  id="shopCity"
                  value={shopCity}
                  onChange={(e) => setShopCity(e.target.value)}
                  disabled={!shopProvince || isActionLoading || loadingCities}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="" disabled>{loadingCities ? 'Loading...' : 'Select City'}</option>
                  {cities.map(city => (
                    <option key={city.code} value={city.name}>{city.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shopDescription" className="text-xs font-semibold text-foreground uppercase tracking-wide">Shop Description</Label>
              <Textarea
                id="shopDescription"
                value={shopDescription}
                onChange={(e) => setShopDescription(e.target.value)}
                placeholder="Tell buyers about your history, style, and materials..."
                disabled={isActionLoading}
                className="h-24"
              />
            </div>

            <Button
              type="submit"
              disabled={isActionLoading}
              className="w-full py-6 mt-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider rounded-xl shadow-md"
            >
              {isActionLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Shop...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Initialize My Storefront
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-10 py-10 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      
      {/* Verification Notice Banner */}
      {!shop.isVerified && (
        <div className="mb-8 p-5 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-sans font-bold text-amber-800 uppercase tracking-wide">Shop Verification Pending</h4>
            <p className="text-xs font-sans text-amber-700 leading-relaxed">
              Your shop verification documents are currently being reviewed by our administrators. You will be able to add or edit products once your shop has been verified and activated.
            </p>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold tracking-widest bg-amber-100 text-amber-800 uppercase">
            Pending
          </span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Store className="w-5 h-5 text-primary" />
            <span className="text-xs font-sans font-bold text-primary uppercase tracking-widest">{shop.category}</span>
          </div>
          <h1 className="text-3xl font-headline font-bold text-foreground tracking-tight mb-1">
            {shop.name}
          </h1>
          <p className="text-muted-foreground font-sans text-xs">
            Manage your listings and catalog inventory for this shop.
          </p>
        </div>

        {/* Add Product Button */}
        <button 
          onClick={() => {
            if (!shop.isVerified) {
              alert('Your shop is pending verification. You cannot add products yet.');
              return;
            }
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          disabled={!shop.isVerified}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-xs font-sans font-bold uppercase tracking-wider shadow-sm transition-all ${
            !shop.isVerified 
              ? 'bg-muted text-muted-foreground cursor-not-allowed' 
              : 'bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer'
          }`}
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </button>
      </div>

      {/* Interactive Filters */}
      <CatalogFilterBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-dashed border-border flex flex-col items-center justify-center text-center p-12">
          <p className="font-headline font-bold text-lg text-foreground mb-1">No products found</p>
          <p className="text-xs text-muted-foreground font-sans max-w-sm mb-4">
            {products.length === 0 
              ? "You haven't listed any products yet! Click 'Add New Product' to list your first item."
              : "No products match your search/filter parameters."}
          </p>
          {products.length === 0 && (
            <button 
              onClick={() => {
                if (!shop.isVerified) {
                  alert('Your shop is pending verification. You cannot add products yet.');
                  return;
                }
                setEditingProduct(null);
                setIsModalOpen(true);
              }}
              disabled={!shop.isVerified}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-sans font-bold uppercase tracking-wider transition-all ${
                !shop.isVerified 
                  ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                  : 'bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer'
              }`}
            >
              <Plus className="w-4 h-4" />
              Add Your First Product
            </button>
          )}
        </div>
      )}

      {/* Product Add/Edit Modal */}
      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        product={editingProduct}
      />
    </div>
  );
};

export default Catalog;