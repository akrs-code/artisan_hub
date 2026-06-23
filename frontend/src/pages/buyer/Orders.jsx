import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Package, PartyPopper, Search, Filter, Loader2 } from 'lucide-react';
import { ordersAPI } from '../../services/api';
import { OrderCard } from '@/components/buyer/orders/OrderCard';

const STATUS_OPTIONS = ['All', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const Orders = () => {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await ordersAPI.getMyOrders();
      setOrders(res?.data || []);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    if (location.state?.orderPlaced) {
      setShowBanner(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const filteredOrders = orders.filter((order) => {
    const shopName = order.shop?.name || 'Artisan Shop';
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      order._id.toLowerCase().includes(q) ||
      shopName.toLowerCase().includes(q) ||
      order.items.some((i) => i.name.toLowerCase().includes(q));
    const matchesStatus = selectedStatus === 'All' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm font-sans text-muted-foreground">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 w-full animate-in fade-in duration-500 bg-background min-h-full">

      
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold text-foreground tracking-tight mb-1">Your Orders</h1>
        <p className="text-muted-foreground font-sans text-xs">Track and manage your artisan purchases.</p>
      </div>

      {/* Success Banner */}
      {showBanner && (
        <div className="bg-secondary/10 border border-secondary/20 rounded-2xl flex items-center gap-3.5 mb-8 p-4">
          <div className="w-9 h-9 rounded-xl bg-secondary/20 flex items-center justify-center shrink-0">
            <PartyPopper className="w-4 h-4 text-secondary-dark" />
          </div>
          <div>
            <h3 className="font-headline font-bold text-secondary-dark text-sm leading-tight">Order Placed Successfully!</h3>
            <p className="text-[10px] text-muted-foreground font-sans mt-0.5">
              Your artisan order is confirmed and being prepared by the craftsman.
            </p>
          </div>
        </div>
      )}

      {/* Empty State (no orders at all) */}
      {orders.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border/80 flex flex-col items-center">
          <Package className="w-10 h-10 text-muted-foreground/20 mb-4" />
          <h3 className="text-lg font-headline font-bold text-foreground mb-2">No Orders Yet</h3>
          <p className="text-muted-foreground font-sans text-xs max-w-md mb-6 leading-relaxed">
            You haven't placed any orders yet. Start exploring artisan shops to find unique items.
          </p>
          <Link to="/discover" className="btn-base btn-primary px-6 py-2 rounded-xl font-sans font-bold text-xs uppercase tracking-widest">
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          {/* Search + Filter row */}
          <div className="flex flex-col sm:flex-row gap-2.5 mb-7">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search by shop, item, or order ID…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-card border border-border/70 rounded-xl text-xs font-sans focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
              />
            </div>
            <div className="relative min-w-[160px]">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-card border border-border/70 rounded-xl text-xs font-sans appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm cursor-pointer capitalize"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s} className="capitalize">
                    {s === 'All' ? 'All Statuses' : s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <p className="text-[10px] font-sans text-muted-foreground mb-4">
            {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
            {selectedStatus !== 'All' && ` · Status: ${selectedStatus}`}
            {searchQuery && ` · "${searchQuery}"`}
          </p>

          {/* Order Grid or no-results state */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-card border border-border/80 rounded-2xl flex flex-col items-center gap-3">
              <Package className="w-8 h-8 text-muted-foreground/20" />
              <p className="text-sm font-headline font-bold text-foreground">No orders match your search</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedStatus('All'); }}
                className="text-[10px] font-sans font-bold text-primary hover:underline uppercase tracking-widest"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredOrders.map((order) => (
                <OrderCard key={order._id} order={order} onOrderUpdate={fetchOrders} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;
