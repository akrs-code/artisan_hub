import React from 'react';
import { Wallet, Banknote, Landmark, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import DashboardHeader from '../../components/seller/DashboardHeader';
import InventoryStatCard from '../../components/seller/InventoryStatCard';
import TransactionsTable from '../../components/seller/TransactionsTable';
import RevenueTrendChart from '../../components/seller/RevenueTrendChart';
import PayoutDetails from '../../components/seller/PayoutDetails';

// --- Dummy Data (Data Contract for Backend) ---
const pageData = {
    userProfile: {
        name: 'Julian Marks',
        role: 'Master Weaver',
        initials: 'JM'
    },
    stats: {
        revenue: { value: 'P24,850.40' },
        available: { value: 'P4,120.00' },
        pending: { value: 'P1,840.50', subtext: '3-5 days arrival' },
        lastPayout: { value: 'P3,200.00', subtext: 'Oct 12, 2023' }
    },
    recentTransactions: [
        {
            id: 'TXN-9021834',
            date: 'Oct 24, 2023',
            type: 'Sale',
            orderId: '#AH-22941',
            status: 'COMPLETED',
            amount: '+P120.00'
        },
        {
            id: 'TXN-9021822',
            date: 'Oct 23, 2023',
            type: 'Payout',
            orderId: null,
            status: 'PROCESSING',
            amount: '-P3,200.00'
        },
        {
            id: 'TXN-9021810',
            date: 'Oct 22, 2023',
            type: 'Sale',
            orderId: '#AH-22938',
            status: 'COMPLETED',
            amount: '+P45.50'
        },
        {
            id: 'TXN-9021795',
            date: 'Oct 21, 2023',
            type: 'Refund',
            orderId: '#AH-22912',
            status: 'COMPLETED',
            amount: '-P24.00'
        }
    ],
    revenueTrend: [
        { label: 'W1', bars: [45, 65, 55] },
        { label: 'W2', bars: [85, 75, 95] },
        { label: 'W3', bars: [60, 70, { value: 100, isHighlighted: true }] },
        { label: 'W4', bars: [80] }
    ],
    payoutInfo: {
        nextPayoutDate: 'October 28, 2023',
        scheduleType: 'Weekly Schedule',
        bankName: 'Artisans National Bank',
        accountEnding: '5821'
    }
};

const Earnings = () => {
    return (
        <div className="relative min-h-full bg-background px-8 pb-12 w-full max-w-[1400px] mx-auto">
            <DashboardHeader
                user={pageData.userProfile}
                searchPlaceholder="Search transactions..."
                showSettings={true}
            />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mt-8 mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-headline font-bold text-neutral-dark mb-1">
                        Earnings & Payouts
                    </h1>
                    <p className="text-[13px] font-sans text-neutral-dark/60 font-medium">
                        Monitor your business growth, manage withdrawals, and track transactions.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 rounded-md bg-[#8C5233] hover:bg-[#7E4A2E] text-white text-[13px] font-sans font-bold transition-colors shadow-sm">
                        <Wallet className="w-4 h-4" />
                        Request Payout
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <InventoryStatCard
                    title="TOTAL REVENUE"
                    value={pageData.stats.revenue.value}
                    subtext={
                        <span className="flex items-center gap-1 text-[#4A6478]">
                            <TrendingUp className="w-3 h-3" />
                            +12.5%
                        </span>
                    }
                    icon={Banknote}
                />
                <InventoryStatCard
                    title="AVAILABLE FOR PAYOUT"
                    value={pageData.stats.available.value}
                    subtext={
                        <span className="text-[#8C5233] hover:text-[#7E4A2E] hover:underline cursor-pointer transition-all">
                            WITHDRAW NOW
                        </span>
                    }
                    icon={Landmark}
                    iconBgClass="bg-[#F8E2DF]"
                />
                <InventoryStatCard
                    title="PENDING CLEARANCE"
                    value={pageData.stats.pending.value}
                    subtext={pageData.stats.pending.subtext}
                    icon={Clock}
                    iconBgClass="bg-[#F8E2DF]"
                />
                <InventoryStatCard
                    title="LAST PAYOUT"
                    value={pageData.stats.lastPayout.value}
                    subtext={pageData.stats.lastPayout.subtext}
                    icon={CheckCircle}
                />
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column (Table) */}
                <div className="lg:col-span-2">
                    <TransactionsTable
                        transactions={pageData.recentTransactions}
                    />
                </div>

                {/* Right Column (Sidebar Cards) */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <RevenueTrendChart data={pageData.revenueTrend} />
                    <PayoutDetails
                        nextPayoutDate={pageData.payoutInfo.nextPayoutDate}
                        scheduleType={pageData.payoutInfo.scheduleType}
                        bankName={pageData.payoutInfo.bankName}
                        accountEnding={pageData.payoutInfo.accountEnding}
                    />
                </div>
            </div>

        </div>
    );
};

export default Earnings;