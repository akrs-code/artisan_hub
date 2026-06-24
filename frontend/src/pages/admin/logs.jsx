import React, { useState, useEffect } from 'react';
import { Banknote, CheckCircle, Hourglass, TrendingUp, Loader2 } from 'lucide-react';
import AdminStatCard from '../../components/admin/dashboard/AdminStatCard';
import TransactionLogsTable from '../../components/admin/finance/TransactionLogsTable';
import { adminAPI } from '../../services/api';
import { formatPrice } from '../../utils/formatters';


const LogsPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await adminAPI.getOrders();
                if (res?.data) setOrders(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const totalOrders = orders.length;
    const deliveredCount = orders.filter(o => o.status === 'delivered' || o.status === 'completed').length;
    const successRate = totalOrders > 0 ? ((deliveredCount / totalOrders) * 100).toFixed(1) : 0;
    const totalRevenue = orders.reduce((sum, o) =>
        sum + (o.status === 'delivered' || o.status === 'completed' ? (o.total || 0) : 0), 0);
    const pendingCount = orders.filter(o => o.status === 'pending').length;

    const formattedTransactions = orders.map(o => ({
        date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'Unknown Date',
        id: o._id ? o._id.substring(o._id.length - 8).toUpperCase() : 'UNKNOWN',
        shopName: o.shop?.name || 'Unknown Shop',
        type: 'SALE',
        amount: formatPrice(o.total || 0),
        status: o.status ? o.status.toUpperCase() : 'UNKNOWN'
    }));

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-sm font-sans text-muted-foreground">Loading transaction logs...</p>
            </div>
        );
    }

    return (
        <div className="px-6 lg:px-10 py-10 max-w-7xl mx-auto w-full">

            
            <div className="mb-8">
                <h1 className="text-3xl font-headline font-bold text-foreground tracking-tight mb-1">
                    Transaction Logs
                </h1>
                <p className="text-muted-foreground font-sans text-xs">
                    Monitor and audit all platform financial activity.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <AdminStatCard
                    title="Total Revenue"
                    value={formatPrice(totalRevenue)}
                    subtext={
                        <span className="flex items-center gap-1 text-muted-foreground text-xs">
                            From delivered orders
                        </span>
                    }
                    icon={Banknote}
                />
                <AdminStatCard
                    title="Success Rate"
                    value={`${successRate}%`}
                    subtext={
                        <span className="text-muted-foreground font-bold text-[9px] uppercase tracking-widest">
                            {deliveredCount} of {totalOrders} ORDERS
                        </span>
                    }
                    icon={CheckCircle}
                />
                <AdminStatCard
                    title="Pending Orders"
                    value={pendingCount.toString()}
                    subtext={
                        <span className="text-muted-foreground font-bold text-[9px] uppercase tracking-widest">
                            AWAITING PROCESSING
                        </span>
                    }
                    icon={Hourglass}
                />
            </div>

            {/* Transaction Table */}
            <TransactionLogsTable data={formattedTransactions} />
        </div>
    );
};

export default LogsPage;