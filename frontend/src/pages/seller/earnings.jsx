import { Wallet, Banknote, Landmark, Clock, CheckCircle, TrendingUp, Loader2 } from 'lucide-react';
import InventoryStatCard from '../../components/seller/inventory/InventoryStatCard';
import TransactionsTable from '../../components/seller/finance/TransactionsTable';
import WithdrawModal from '../../components/seller/finance/WithdrawModal';
import { useState, useEffect } from 'react';
import { shopsAPI, ordersAPI, walletAPI } from '../../services/api';
import { formatPrice } from '../../utils/formatters';

const Earnings = () => {
    const [orders, setOrders] = useState([]);
    const [walletStats, setWalletStats] = useState(null);
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [shop, setShop] = useState(null);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

    const fetchEarningsData = async () => {
        try {
            setLoading(true);
            const shopRes = await shopsAPI.getOwned();
            if (shopRes && shopRes.data) {
                setShop(shopRes.data);
                
                const [ordersRes, statsRes, historyRes] = await Promise.all([
                    ordersAPI.getShopOrders(shopRes.data._id),
                    walletAPI.getWalletStats(shopRes.data._id),
                    walletAPI.getWithdrawalHistory(shopRes.data._id)
                ]);

                if (ordersRes && ordersRes.data) setOrders(ordersRes.data);
                if (statsRes && statsRes.data) setWalletStats(statsRes.data);
                if (historyRes && historyRes.data) setWithdrawals(historyRes.data);
            }
        } catch (err) {
            setError(err.message || 'Failed to load shop earnings data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEarningsData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm font-sans text-muted-foreground">Loading earnings & payout details...</p>
            </div>
        );
    }

    
    const pendingOrders = orders.filter(o => ['pending', 'confirmed', 'shipped'].includes(o.status));

    const totalRevenueCentavos = walletStats?.totalEarnings || 0;
    const availableCentavos = walletStats?.availableBalance || 0;
    const pendingClearanceCentavos = pendingOrders.reduce((sum, o) => sum + o.total, 0);

    const revenueStr = formatPrice(totalRevenueCentavos);
    const availableStr = formatPrice(availableCentavos);
    const pendingStr = formatPrice(pendingClearanceCentavos);

    
    const orderTxns = orders.map(order => ({
        id: `ORD-${order._id.substring(0, 8).toUpperCase()}`,
        date: new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        type: 'Sale',
        orderId: `#${order._id.substring(0, 8).toUpperCase()}`,
        status: order.status,
        amount: `+${formatPrice(order.total)}`,
        timestamp: new Date(order.createdAt).getTime()
    }));

    const withdrawalTxns = withdrawals.map(w => ({
        id: `WD-${w._id.substring(0, 8).toUpperCase()}`,
        date: new Date(w.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        type: 'Payout',
        orderId: w.method.toUpperCase(),
        status: w.status,
        amount: `-${formatPrice(w.amount)}`,
        timestamp: new Date(w.createdAt).getTime()
    }));

    const transactions = [...orderTxns, ...withdrawalTxns].sort((a, b) => b.timestamp - a.timestamp);

    return (
        <div className="px-6 lg:px-10 py-10 max-w-7xl mx-auto w-full">

            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-headline font-bold text-foreground tracking-tight mb-1">
                        Earnings & Payouts
                    </h1>
                    <p className="text-muted-foreground font-sans text-xs">
                        Monitor your business growth, manage withdrawals, and track transactions.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsWithdrawModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-[13px] font-sans font-bold transition-colors shadow-sm"
                    >
                        <Wallet className="w-4 h-4" />
                        Request Payout
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-sm font-sans text-destructive">
                    {error}
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <InventoryStatCard
                    title="Total Revenue"
                    value={revenueStr}
                    subtext={
                        <span className="flex items-center gap-1 text-primary">
                            <TrendingUp className="w-3 h-3" />
                            Live balance
                        </span>
                    }
                    icon={Banknote}
                />
                <InventoryStatCard
                    title="Available for Payout"
                    value={availableStr}
                    subtext={
                        <span 
                            onClick={() => setIsWithdrawModalOpen(true)}
                            className="text-primary hover:text-primary/80 hover:underline cursor-pointer transition-all uppercase text-[10px] tracking-widest font-bold"
                        >
                            WITHDRAW NOW
                        </span>
                    }
                    icon={Landmark}
                />
                <InventoryStatCard
                    title="Pending Clearance"
                    value={pendingStr}
                    subtext="Processing orders"
                    icon={Clock}
                />
                <InventoryStatCard
                    title="Last Payout"
                    value="P0.00"
                    subtext="No payouts requested yet"
                    icon={CheckCircle}
                />
            </div>

            {/* Main Content Layout */}
            <div className="w-full">
                <TransactionsTable
                    transactions={transactions}
                />
            </div>

            {/* Withdraw Modal */}
            {shop && (
                <WithdrawModal
                    isOpen={isWithdrawModalOpen}
                    onClose={() => setIsWithdrawModalOpen(false)}
                    shopId={shop._id}
                    onSuccess={() => {
                        setIsWithdrawModalOpen(false);
                        fetchEarningsData();
                    }}
                />
            )}
        </div>
    );
};

export default Earnings;