import { Loader2, Banknote, ShoppingCart, TrendingUp, Package, Settings, Clock, ShieldAlert, FileText, Upload, Calendar, X, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import StatCard from '../../components/seller/dashboard/StatCard';
import SalesPerformance from '../../components/seller/analytics/SalesPerformance';
import TopProducts from '../../components/seller/products/TopProducts';
import RecentOrders from '../../components/seller/orders/RecentOrders';
import CustomerInsights from '../../components/seller/analytics/CustomerInsights';
import { useState, useEffect } from 'react';
import { shopsAPI, ordersAPI, categoriesAPI } from '../../services/api';
import { formatPrice } from '../../utils/formatters';
import { Button } from '@/components/ui/button';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [shop, setShop] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Settings Modal States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('hours'); // 'hours' or 'verification'
  const [storeHours, setStoreHours] = useState({
    monday:    { open: '09:00', close: '18:00', closed: false },
    tuesday:   { open: '09:00', close: '18:00', closed: false },
    wednesday: { open: '09:00', close: '18:00', closed: false },
    thursday:  { open: '09:00', close: '18:00', closed: false },
    friday:    { open: '09:00', close: '18:00', closed: false },
    saturday:  { open: '09:00', close: '18:00', closed: true },
    sunday:    { open: '09:00', close: '18:00', closed: true }
  });
  const [permitFile, setPermitFile] = useState(null);
  const [idFile, setIdFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [shopDetails, setShopDetails] = useState({
    name: '',
    description: '',
    category: '',
    address: ''
  });
  const [categories, setCategories] = useState([]);
  const [customCategory, setCustomCategory] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const shopRes = await shopsAPI.getOwned();
      if (shopRes && shopRes.data) {
        setShop(shopRes.data);
        setShopDetails({
          name: shopRes.data.name || '',
          description: shopRes.data.description || '',
          category: shopRes.data.category || '',
          address: shopRes.data.address || ''
        });
        if (shopRes.data.storeHours) {
          setStoreHours(shopRes.data.storeHours);
        }
        const [ordersRes, statsRes] = await Promise.all([
          ordersAPI.getShopOrders(shopRes.data._id),
          shopsAPI.getShopStats(shopRes.data._id)
        ]);
        if (ordersRes && ordersRes.data) {
          setOrders(ordersRes.data);
        }
        if (statsRes && statsRes.data) {
          setStats(statsRes.data);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard analytical data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const fetchCategories = async () => {
      try {
        const res = await categoriesAPI.getCategories();
        if (res && res.data) setCategories(res.data);
      } catch (err) {}
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (shopDetails.category && categories.length > 0) {
      const isKnown = categories.some(c => c.name === shopDetails.category) || 
                      ['Ceramics', 'Textiles', 'Woodwork', 'Home Decor', 'Glassware', 'Stationery', 'Clothings'].includes(shopDetails.category);
      if (!isKnown && shopDetails.category !== 'Other') {
        setCustomCategory(shopDetails.category);
        setShopDetails(prev => ({ ...prev, category: 'Other' }));
      }
    }
  }, [shopDetails.category, categories]);

  const handleHourToggle = (day) => {
    setStoreHours(prev => ({
      ...prev,
      [day]: { ...prev[day], closed: !prev[day].closed }
    }));
  };

  const handleHourChange = (day, field, value) => {
    setStoreHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      const data = new FormData();
      data.append('name', shopDetails.name);
      data.append('description', shopDetails.description);
      const finalCategory = shopDetails.category === 'Other' ? customCategory : shopDetails.category;
      data.append('category', finalCategory);
      data.append('address', shopDetails.address);
      data.append('storeHours', JSON.stringify(storeHours));
      
      if (permitFile) {
        data.append('businessPermit', permitFile);
      }
      if (idFile) {
        data.append('governmentId', idFile);
      }
      if (coverFile) {
        data.append('cover', coverFile);
      }
      if (logoFile) {
        data.append('logo', logoFile);
      }

      const res = await shopsAPI.updateShop(shop._id, data);
      toast.success('Shop settings updated successfully.');
      setShop(res.data);
      if (res.data.storeHours) {
        setStoreHours(res.data.storeHours);
      }
      setPermitFile(null);
      setIdFile(null);
      setCoverFile(null);
      setLogoFile(null);
      setIsSettingsOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to update shop settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-sans text-muted-foreground">Loading dashboard analytics...</p>
      </div>
    );
  }

  const completedOrders = orders.filter((o) => ['delivered', 'completed'].includes(o.status));
  const totalSalesCentavos = completedOrders.reduce((sum, o) => sum + o.total, 0);
  const totalSalesPHP = formatPrice(totalSalesCentavos);

  const ordersCount = orders.length;

  const completedOrdersCount = completedOrders.length;
  const avgOrderValueCentavos = completedOrdersCount > 0 ? Math.round(totalSalesCentavos / completedOrdersCount) : 0;
  const avgOrderValuePHP = formatPrice(avgOrderValueCentavos);

  return (
    <div className="px-6 lg:px-10 py-10 max-w-7xl mx-auto w-full">
      
      {/* Document Revision Alert Banner */}
      {shop?.verificationStatus === 'needs_documents' && (
        <div className="mb-6 p-5 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold font-sans">Document Revision Requested</h4>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                The administrator has requested updates to your verification documents. 
                <span className="block font-semibold mt-1">Reason: "{shop.verificationFeedback || 'No reason provided'}"</span>
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              setSettingsTab('verification');
              setIsSettingsOpen(true);
            }}
            className="bg-amber-600 hover:bg-amber-700 text-white shrink-0 self-start md:self-auto"
          >
            Update Documents
          </Button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-foreground tracking-tight mb-1">
            Welcome back, {shop?.name || 'Artisan Seller'}!
          </h1>
          <p className="text-muted-foreground font-sans text-xs">
            Your workshop performance is looking strong this week.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setSettingsTab('hours');
            setIsSettingsOpen(true);
          }}
          className="flex items-center gap-2 self-start sm:self-auto"
        >
          <Settings className="w-4 h-4" />
          <span>Shop Settings</span>
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-sm font-sans text-destructive">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Sales"
          value={totalSalesPHP}
          subtext="Completed orders"
          icon={Banknote}
        />
        <StatCard
          title="Total Orders"
          value={ordersCount.toString()}
          subtext="All time"
          icon={ShoppingCart}
        />
        <StatCard
          title="Avg. Order Value"
          value={avgOrderValuePHP}
          subtext="Per order"
          icon={TrendingUp}
        />
        <StatCard
          title="Total Products"
          value={stats?.totalProducts?.toString() || "0"}
          subtext="Live inventory"
          icon={Package}
        />
      </div>

      {/* Middle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <SalesPerformance
            dailySales={stats?.dailySales || []}
            monthlySales={stats?.monthlySales || []}
          />
        </div>
        <div className="lg:col-span-1">
          <TopProducts products={stats?.topProducts || []} />
        </div>
      </div>

      {/* Customer Insights Grid */}
      <CustomerInsights 
        insights={stats?.customerInsights} 
        demographics={stats?.demographics} 
      />

      {/* Bottom Section */}
      <div className="w-full">
        <RecentOrders orders={orders} />
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsSettingsOpen(false)}
          />
          <div className="relative bg-card rounded-2xl border border-border shadow-xl w-full max-w-xl overflow-hidden transform transition-all">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h3 className="text-lg font-headline font-bold text-foreground">
                  Shop Settings
                </h3>
                <p className="text-xs text-muted-foreground font-sans mt-0.5">
                  Configure scheduling and verify security records
                </p>
              </div>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full p-1.5 transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab navigation */}
            <div className="flex border-b border-border px-6 overflow-x-auto hide-scrollbar">
              <button
                type="button"
                onClick={() => setSettingsTab('details')}
                className={`py-3 px-4 font-sans text-xs font-bold border-b-2 transition-all flex shrink-0 items-center gap-1.5 ${
                  settingsTab === 'details' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <FileText className="w-4 h-4" />
                Store Details
              </button>
              <button
                type="button"
                onClick={() => setSettingsTab('hours')}
                className={`py-3 px-4 font-sans text-xs font-bold border-b-2 transition-all flex shrink-0 items-center gap-1.5 ${
                  settingsTab === 'hours' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Clock className="w-4 h-4" />
                Store Hours
              </button>
              <button
                type="button"
                onClick={() => setSettingsTab('verification')}
                className={`py-3 px-4 font-sans text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  settingsTab === 'verification' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                Verification Status
              </button>
              <button
                type="button"
                onClick={() => setSettingsTab('branding')}
                className={`py-3 px-4 font-sans text-xs font-bold border-b-2 transition-all flex shrink-0 items-center gap-1.5 ${
                  settingsTab === 'branding' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                Branding
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveSettings}>
              <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-4">

                {/* Store Details Tab Content */}
                {settingsTab === 'details' && (
                  <div className="space-y-4 font-sans">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Update your store's fundamental information and public identity.
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="field-label mb-1">Shop Name</label>
                        <input
                          type="text"
                          value={shopDetails.name}
                          onChange={(e) => setShopDetails({ ...shopDetails, name: e.target.value })}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="field-label mb-1">Description</label>
                        <textarea
                          rows={3}
                          value={shopDetails.description}
                          onChange={(e) => setShopDetails({ ...shopDetails, description: e.target.value })}
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="field-label mb-1">Category</label>
                          <select
                            value={shopDetails.category}
                            onChange={(e) => {
                              setShopDetails({ ...shopDetails, category: e.target.value });
                              if (e.target.value !== 'Other') setCustomCategory('');
                            }}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {categories.map((cat) => (
                              <option key={cat._id} value={cat.name}>{cat.name}</option>
                            ))}
                            {categories.length === 0 && (
                              <>
                                <option value="Ceramics">Ceramics</option>
                                <option value="Textiles">Textiles</option>
                                <option value="Woodwork">Woodwork</option>
                                <option value="Home Decor">Home Decor</option>
                                <option value="Glassware">Glassware</option>
                                <option value="Stationery">Stationery</option>
                                <option value="Clothings">Clothings</option>
                              </>
                            )}
                            <option value="Other">Other (Please specify)</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="field-label mb-1">Address</label>
                          <input
                            type="text"
                            value={shopDetails.address}
                            onChange={(e) => setShopDetails({ ...shopDetails, address: e.target.value })}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="e.g. Quezon City, Metro Manila"
                          />
                        </div>
                      </div>

                      {shopDetails.category === 'Other' && (
                        <div>
                          <label className="field-label mb-1">Custom Category</label>
                          <input
                            type="text"
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Store Hours Tab Content */}
                {settingsTab === 'hours' && (
                  <div className="space-y-4 font-sans">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Set operating schedules for your physical storefront or workshop. Closed days will be highlighted to buyers.
                    </p>
                    
                    <div className="space-y-3">
                      {DAYS.map((day) => {
                        const dayData = storeHours[day] || { open: '09:00', close: '18:00', closed: false };
                        return (
                          <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-border/60 bg-muted/10 rounded-xl gap-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`closed-${day}`}
                                checked={dayData.closed}
                                onChange={() => handleHourToggle(day)}
                                className="w-4 h-4 rounded text-primary focus:ring-primary border-border"
                              />
                              <label htmlFor={`closed-${day}`} className="text-xs font-bold text-foreground capitalize select-none w-20">
                                {day}
                              </label>
                            </div>
                            
                            <div className="flex items-center gap-2 self-end sm:self-auto">
                              <span className="text-[10px] text-muted-foreground font-semibold">Open:</span>
                              <input
                                type="time"
                                disabled={dayData.closed}
                                value={dayData.open}
                                onChange={(e) => handleHourChange(day, 'open', e.target.value)}
                                className="px-2 py-1.5 text-xs bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-primary disabled:opacity-40"
                              />
                              <span className="text-[10px] text-muted-foreground font-semibold ml-2">Close:</span>
                              <input
                                type="time"
                                disabled={dayData.closed}
                                value={dayData.close}
                                onChange={(e) => handleHourChange(day, 'close', e.target.value)}
                                className="px-2 py-1.5 text-xs bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-primary disabled:opacity-40"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Verification Tab Content */}
                {settingsTab === 'verification' && (
                  <div className="space-y-4 font-sans">
                    {/* Status Alert Banner */}
                    <div className="p-4 bg-muted/20 border border-border rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-muted-foreground uppercase">Verification Status:</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase ${
                          shop?.verificationStatus === 'verified'
                            ? 'bg-green-100 text-green-800'
                            : shop?.verificationStatus === 'needs_documents'
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {shop?.verificationStatus || 'pending'}
                        </span>
                      </div>
                      
                      {shop?.verificationStatus === 'needs_documents' && (
                        <p className="text-xs text-amber-700 font-medium mt-3 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                          <strong>Admin Feedback:</strong> "{shop.verificationFeedback}"
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="field-label flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" />
                          Business Permit (Re-upload)
                        </label>
                        <div className="mt-1 flex items-center gap-3">
                          <input
                            type="file"
                            id="permit-upload"
                            accept="image/*,.pdf"
                            onChange={(e) => setPermitFile(e.target.files?.[0])}
                            className="hidden"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <label 
                              htmlFor="permit-upload"
                              className="flex items-center gap-1.5 cursor-pointer"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              Select File
                            </label>
                          </Button>
                          <span className="text-xs text-muted-foreground truncate max-w-xs">
                            {permitFile ? permitFile.name : 'No file chosen'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="field-label flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" />
                          Government ID (Re-upload)
                        </label>
                        <div className="mt-1 flex items-center gap-3">
                          <input
                            type="file"
                            id="id-upload"
                            accept="image/*,.pdf"
                            onChange={(e) => setIdFile(e.target.files?.[0])}
                            className="hidden"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <label 
                              htmlFor="id-upload"
                              className="flex items-center gap-1.5 cursor-pointer"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              Select File
                            </label>
                          </Button>
                          <span className="text-xs text-muted-foreground truncate max-w-xs">
                            {idFile ? idFile.name : 'No file chosen'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Branding Tab Content */}
                {settingsTab === 'branding' && (
                  <div className="space-y-4 font-sans">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Personalize your shop's appearance to stand out in the marketplace.
                    </p>

                    <div className="space-y-6">
                      <div>
                        <label className="field-label flex items-center gap-1 mb-1">
                          <ImageIcon className="w-3.5 h-3.5" />
                          Shop Logo
                        </label>
                        <p className="text-[10px] text-muted-foreground mb-3">Recommended size: 400x400px (1:1 aspect ratio)</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="w-16 h-16 shrink-0 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden">
                            {logoFile ? (
                              <img src={URL.createObjectURL(logoFile)} alt="Logo Preview" className="w-full h-full object-cover" />
                            ) : shop?.logoUrl ? (
                              <img src={shop.logoUrl} alt="Current Logo" className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-muted-foreground/50" />
                            )}
                          </div>
                          <div className="flex flex-col gap-2 w-full">
                            <input
                              type="file"
                              id="logo-upload"
                              accept="image/*"
                              onChange={(e) => setLogoFile(e.target.files?.[0])}
                              className="hidden"
                            />
                            <div className="flex flex-wrap items-center gap-3">
                              <Button variant="outline" size="sm" asChild>
                                <label htmlFor="logo-upload" className="flex items-center gap-1.5 cursor-pointer">
                                  <Upload className="w-3.5 h-3.5" />
                                  Upload Logo
                                </label>
                              </Button>
                              <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {logoFile ? logoFile.name : 'No new file chosen'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border/40">
                        <label className="field-label flex items-center gap-1 mb-1">
                          <ImageIcon className="w-3.5 h-3.5" />
                          Shop Cover
                        </label>
                        <p className="text-[10px] text-muted-foreground mb-3">Recommended size: 1920x1080px (16:9 aspect ratio)</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="w-32 h-16 shrink-0 rounded-md bg-muted border border-border flex items-center justify-center overflow-hidden">
                            {coverFile ? (
                              <img src={URL.createObjectURL(coverFile)} alt="Cover Preview" className="w-full h-full object-cover" />
                            ) : shop?.coverUrl ? (
                              <img src={shop.coverUrl} alt="Current Cover" className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-muted-foreground/50" />
                            )}
                          </div>
                          <div className="flex flex-col gap-2 w-full">
                            <input
                              type="file"
                              id="cover-upload"
                              accept="image/*"
                              onChange={(e) => setCoverFile(e.target.files?.[0])}
                              className="hidden"
                            />
                            <div className="flex flex-wrap items-center gap-3">
                              <Button variant="outline" size="sm" asChild>
                                <label htmlFor="cover-upload" className="flex items-center gap-1.5 cursor-pointer">
                                  <Upload className="w-3.5 h-3.5" />
                                  Upload Cover
                                </label>
                              </Button>
                              <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {coverFile ? coverFile.name : 'No new file chosen'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Footer */}
              <div className="bg-muted/30 p-5 border-t border-border flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsSettingsOpen(false)}
                  disabled={savingSettings}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={savingSettings}
                >
                  {savingSettings ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin mr-1" />
                      Saving...
                    </>
                  ) : (
                    'Save Settings'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;