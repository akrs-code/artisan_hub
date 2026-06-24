import React, { useState, useEffect } from 'react';
import { Store, Banknote, BadgeCheck, Users, Loader2 } from 'lucide-react';
import AdminStatCard from '../../components/admin/dashboard/AdminStatCard';
import PlatformGrowthChart from '../../components/admin/analytics/PlatformGrowthChart';
import SystemAlerts from '../../components/admin/dashboard/SystemAlerts';
import CategoryPerformanceTable from '../../components/admin/analytics/CategoryPerformanceTable';
import { adminAPI } from '../../services/api';
import { formatPrice } from '../../utils/formatters';

const Overview = () => {
    const [stats, setStats] = useState({
        users: 0,
        shops: 0,
        orders: 0,
        revenue: 0,
        pendingVerifications: 0,
        growthData: [],
        categoryPerformance: []
    });
    const [recentShops, setRecentShops] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const loadOverviewData = async () => {
        try {
            setIsLoading(true);
            setError('');
            const [statsRes, shopsRes] = await Promise.all([
                adminAPI.getStats(),
                adminAPI.getShops()
            ]);

            const shopsList = shopsRes?.data || [];
            const pendingCount = shopsList.filter(s => s.verificationStatus === 'pending').length;

            setStats({
                users: statsRes?.data?.users || 0,
                shops: statsRes?.data?.shops || 0,
                orders: statsRes?.data?.orders || 0,
                revenue: statsRes?.data?.revenue || 0,
                pendingVerifications: pendingCount,
                growthData: statsRes?.data?.growthData || [],
                categoryPerformance: statsRes?.data?.categoryPerformance || []
            });

            const pendingShops = shopsList.filter(s => s.verificationStatus === 'pending').slice(0, 4);
            setRecentShops(pendingShops);
        } catch (err) {
            setError(err.message || 'Failed to load stats.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadOverviewData(); }, []);

    const systemAlerts = recentShops.length > 0
        ? recentShops.map(shop => ({
            title: shop.name,
            message: `Submitted verification documents and is waiting for review.`,
            timeAgo: new Date(shop.createdAt).toLocaleDateString(),
            isUrgent: false
        }))
        : [{
            title: 'No pending verifications',
            message: 'All shop verification requests have been reviewed.',
            timeAgo: 'Up to date',
            isUrgent: false
        }];

    if (isLoading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-sm font-sans text-muted-foreground">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="px-6 lg:px-10 py-10 max-w-7xl mx-auto w-full">

            
            <div className="mb-8">
                <h1 className="text-3xl font-headline font-bold text-foreground tracking-tight mb-1">
                    Dashboard
                </h1>
                <p className="text-muted-foreground font-sans text-xs">
                    A live overview of the Artisan Hub platform.
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-xs font-sans">
                    {error}
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <AdminStatCard
                    title="Total Shops"
                    value={stats.shops}
                    subtext="Registered stores"
                    icon={Store}
                />
                <AdminStatCard
                    title="Total Revenue"
                    value={formatPrice(stats.revenue)}
                    subtext="From delivered orders"
                    icon={Banknote}
                />
                <AdminStatCard
                    title="Pending Verifications"
                    value={stats.pendingVerifications}
                    subtext={
                        <span className="text-primary font-bold text-xs">Needs review</span>
                    }
                    icon={BadgeCheck}
                />
                <AdminStatCard
                    title="Total Users"
                    value={stats.users}
                    subtext="Buyers and sellers"
                    icon={Users}
                />
            </div>

            {/* Chart + Alerts */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                <div className="xl:col-span-2">
                    <PlatformGrowthChart data={stats.growthData} />
                </div>
                <div className="xl:col-span-1">
                    <SystemAlerts alerts={systemAlerts} />
                </div>
            </div>

            {/* Category Table */}
            <CategoryPerformanceTable data={stats.categoryPerformance} />
        </div>
    );
};

export default Overview;