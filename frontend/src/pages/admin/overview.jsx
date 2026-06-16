import React, { useState } from 'react';
import {
    Store,
    Banknote,
    BadgeCheck,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    Armchair,
    Gem,
    Palette
} from 'lucide-react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminStatCard from '../../components/admin/AdminStatCard';
import PlatformGrowthChart from '../../components/admin/PlatformGrowthChart';
import SystemAlerts from '../../components/admin/SystemAlerts';
import CategoryPerformanceTable from '../../components/admin/CategoryPerformanceTable';
import AdminActionModal from '../../components/admin/AdminActionModal';

// --- Dummy Data (Data Contract for Backend) ---
const pageData = {
    stats: {
        shops: { value: '4,281', subtext: '+12%', isPositive: true },
        gmv: { value: 'P1.2M', subtext: '+8.4%', isPositive: true },
        verifications: { value: '84', subtext: 'REVIEW QUEUE' },
        disputes: { value: '12', subtext: '-2.1%', isPositive: false }
    },
    growthData: [
        { label: 'OCT 01', showLabel: true, value: 30 },
        { label: '', showLabel: false, value: 40 },
        { label: '', showLabel: false, value: 35 },
        { label: 'OCT 10', showLabel: true, value: 50 },
        { label: '', showLabel: false, value: 65 },
        {
            label: '', showLabel: false, value: 100,
            isHighlighted: true,
            tooltip: { value: 'P42,800.00', date: 'Oct 12, 2023' }
        },
        { label: 'OCT 20', showLabel: true, value: 55 },
        { label: '', showLabel: false, value: 45 },
        { label: '', showLabel: false, value: 75 },
        { label: 'OCT 30', showLabel: true, value: 60 }
    ],
    systemAlerts: [
        {
            title: 'New verification request',
            message: 'The "Highland Loom" shop has submitted premium papers.',
            timeAgo: '2 MINUTES AGO',
            isUrgent: false
        },
        {
            title: 'Dispute Escalation',
            message: 'Order #8821 from "Ceramic Echoes" marked as undelivered.',
            timeAgo: '45 MINUTES AGO',
            isUrgent: true
        },
        {
            title: 'Server maintenance',
            message: 'Database optimization scheduled for 02:00 UTC.',
            timeAgo: '2 HOURS AGO',
            isUrgent: false
        }
    ],
    categoryPerformance: [
        {
            category: { name: 'Handcrafted Furniture', icon: Armchair },
            activeShops: '1,120',
            avgSales: 'P4,250',
            growth: '+14.2%',
            status: 'TRENDING'
        },
        {
            category: { name: 'Artisanal Jewelry', icon: Gem },
            activeShops: '845',
            avgSales: 'P1,980',
            growth: '+5.8%',
            status: 'STABLE'
        },
        {
            category: { name: 'Ceramics & Pottery', icon: Palette },
            activeShops: '562',
            avgSales: 'P2,110',
            growth: '-1.2%',
            status: 'STABLE'
        }
    ]
};

const Overview = () => {
    const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '' });

    const openModal = (title, message) => {
        setModalState({ isOpen: true, title, message });
    };

    const closeModal = () => {
        setModalState(prev => ({ ...prev, isOpen: false }));
    };

    return (
        <div className="relative min-h-full bg-background px-8 pb-12 w-full max-w-[1400px] mx-auto">
            <AdminHeader onPrimaryActionClick={() => openModal('Export Report', 'The report generation and export feature is coming soon.')} />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mt-8 mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-headline font-bold text-neutral-dark mb-1">
                        System Overview
                    </h1>
                    <p className="text-[13px] font-sans text-neutral-dark/60 font-medium">
                        Real-time health and performance metrics for the Artisan Hub ecosystem.
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <AdminStatCard
                    title="TOTAL ACTIVE SHOPS"
                    value={pageData.stats.shops.value}
                    subtext={
                        <span className="flex items-center gap-1 text-neutral-dark">
                            <TrendingUp className="w-3 h-3" />
                            {pageData.stats.shops.subtext}
                        </span>
                    }
                    icon={Store}
                />
                <AdminStatCard
                    title="PLATFORM GMV"
                    value={pageData.stats.gmv.value}
                    subtext={
                        <span className="flex items-center gap-1 text-neutral-dark">
                            <TrendingUp className="w-3 h-3" />
                            {pageData.stats.gmv.subtext}
                        </span>
                    }
                    icon={Banknote}
                />
                <AdminStatCard
                    title="PENDING VERIFICATIONS"
                    value={pageData.stats.verifications.value}
                    subtext={
                        <span className="text-[#8C5233] font-bold">
                            {pageData.stats.verifications.subtext}
                        </span>
                    }
                    icon={BadgeCheck}
                />
                <AdminStatCard
                    title="ACTIVE DISPUTES"
                    value={pageData.stats.disputes.value}
                    subtext={
                        <span className="flex items-center gap-1 text-destructive">
                            <TrendingDown className="w-3 h-3" />
                            {pageData.stats.disputes.subtext}
                        </span>
                    }
                    icon={AlertTriangle}
                    iconBgClass="bg-[#F8E2DF]"
                    iconColorClass="text-destructive"
                />
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                {/* Left Column (Chart) */}
                <div className="xl:col-span-2">
                    <PlatformGrowthChart data={pageData.growthData} />
                </div>

                {/* Right Column (Alerts) */}
                <div className="xl:col-span-1">
                    <SystemAlerts
                        alerts={pageData.systemAlerts}
                        onViewAllClick={() => openModal('System Activity Log', 'Full system activity log and filters will be displayed here.')}
                    />
                </div>
            </div>

            {/* Bottom Layout (Table) */}
            <div className="w-full">
                <CategoryPerformanceTable
                    data={pageData.categoryPerformance}
                    onAllRegionsClick={() => openModal('Region Filter', 'Geographic filtering options will be available soon.')}
                    onViewDetailedAnalyticsClick={() => openModal('Detailed Analytics', 'Comprehensive category analytics dashboard is under construction.')}
                />
            </div>

            {/* Action Modal */}
            <AdminActionModal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                title={modalState.title}
                message={modalState.message}
            />
        </div>
    );
};

export default Overview;