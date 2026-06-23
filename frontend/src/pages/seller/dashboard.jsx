import { Loader2, Banknote, ShoppingCart, TrendingUp, Package } from 'lucide-react';
import StatCard from '../../components/seller/StatCard';
import SalesPerformance from '../../components/seller/SalesPerformance';
import TopProducts from '../../components/seller/TopProducts';
import RecentOrders from '../../components/seller/RecentOrders';
import { useState, useEffect } from 'react';
import { shopsAPI, ordersAPI } from '../../services/api';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [shop, setShop] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const shopRes = await shopsAPI.getOwned();
        if (shopRes && shopRes.data) {
          setShop(shopRes.data);
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

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-sans text-muted-foreground">Loading dashboard analytics...</p>
      </div>
    );
  }

  
  const totalSalesCentavos = orders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0);
  const totalSalesPHP = (totalSalesCentavos / 100).toLocaleString('en-PH', {
    style: 'currency',
    currency: 'PHP',
  });

  const ordersCount = orders.length;

  const avgOrderValueCentavos = ordersCount > 0 ? Math.round(totalSalesCentavos / ordersCount) : 0;
  const avgOrderValuePHP = (avgOrderValueCentavos / 100).toLocaleString('en-PH', {
    style: 'currency',
    currency: 'PHP',
  });

  return (
    <div className="px-6 lg:px-10 py-10 max-w-7xl mx-auto w-full animate-in fade-in duration-500">

      
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold text-foreground tracking-tight mb-1">
          Welcome back, {shop?.name || 'Artisan Seller'}!
        </h1>
        <p className="text-muted-foreground font-sans text-xs">
          Your workshop performance is looking strong this week.
        </p>
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
          <SalesPerformance data={stats?.dailySales || []} />
        </div>
        <div className="lg:col-span-1">
          <TopProducts products={stats?.topProducts || []} />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full">
        <RecentOrders orders={orders} />
      </div>
    </div>
  );
};

export default Dashboard;