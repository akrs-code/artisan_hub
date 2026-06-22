import React, { useState } from 'react';
import { Scale, Clock, BadgeCheck, AlertCircle, TrendingUp, Filter } from 'lucide-react';
import AdminStatCard from '../../components/admin/AdminStatCard';
import ActiveDisputeQueue from '../../components/admin/ActiveDisputeQueue';
import DisputeReasonsCard from '../../components/admin/DisputeReasonsCard';
import RecentActivityCard from '../../components/admin/RecentActivityCard';
import AdminActionModal from '../../components/admin/AdminActionModal';

// --- Dummy Data (Data Contract for Backend) ---
const pageData = {
    stats: {
        open: { value: '24', subtext: '12% VS LAST WEEK' },
        avgResolution: { value: '3.2 Days', subtext: '-0.4 DAYS IMPROVEMENT' },
        resolutionRate: { value: '94%', subtext: 'TARGET: 90%' },
        appeals: { value: '8', subtext: 'REQUIRES SENIOR ADMIN' }
    },
    queue: [
        {
            id: '#DISP-9021',
            shopName: 'Terra Ceramics',
            shopImg: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=100&q=80',
            customerName: 'Elena Rodriguez',
            reason: 'DAMAGED',
            amount: '$145.00'
        },
        {
            id: '#DISP-8942',
            shopName: 'Loom & Leaf',
            shopImg: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=100&q=80',
            customerName: 'Jameson Blake',
            reason: 'DELIVERY',
            amount: '$89.20'
        },
        {
            id: '#DISP-8710',
            shopName: 'Silver Lining',
            shopImg: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=100&q=80',
            customerName: 'Sarah Jenkins',
            reason: 'QUALITY',
            amount: '$320.00'
        },
        {
            id: '#DISP-8604',
            shopName: 'Kiln & Kin',
            shopImg: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=100&q=80',
            customerName: 'David Miller',
            reason: 'DAMAGED',
            amount: '$64.00'
        }
    ],
    reasons: [
        { reason: 'DAMAGED ITEM', percentage: 42 },
        { reason: 'ITEM NOT RECEIVED', percentage: 28 },
        { reason: 'QUALITY ISSUE', percentage: 20 }
    ],
    trendAnalysis: "Damaged item reports are up by 8%. Recommend updating 'Packaging Guidelines'.",
    activities: [
        {
            type: 'resolution',
            text: '<strong>#DISP-8590</strong> was resolved in favor of the customer.',
            timeAgo: '2 hours ago'
        },
        {
            type: 'message',
            text: '<strong>Elena R.</strong> added a photo to dispute #DISP-9021.',
            timeAgo: '4 hours ago'
        }
    ]
};

const DisputesPage = () => {
    const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '' });

    const openModal = (title, message) => {
        setModalState({ isOpen: true, title, message });
    };

    const closeModal = () => {
        setModalState(prev => ({ ...prev, isOpen: false }));
    };

    return (
        <div className="px-6 lg:px-10 py-10 max-w-7xl mx-auto w-full animate-in fade-in duration-500">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-headline font-bold text-foreground tracking-tight mb-1">
                        Disputes & Complaints
                    </h1>
                    <p className="text-muted-foreground font-sans text-xs">
                        Review and resolve customer conflicts within the artisan marketplace.
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <AdminStatCard
                    title="OPEN DISPUTES"
                    value={pageData.stats.open.value}
                    subtext={
                        <span className="flex items-center gap-1 text-[#8C5233] font-bold">
                            <TrendingUp className="w-3 h-3" />
                            {pageData.stats.open.subtext}
                        </span>
                    }
                    icon={Scale}
                />
                <AdminStatCard
                    title="AVG. RESOLUTION"
                    value={pageData.stats.avgResolution.value}
                    subtext={
                        <span className="text-neutral-dark/60 font-bold text-[9px] uppercase tracking-widest">
                            {pageData.stats.avgResolution.subtext}
                        </span>
                    }
                    icon={Clock}
                />
                <AdminStatCard
                    title="RESOLUTION RATE"
                    value={pageData.stats.resolutionRate.value}
                    subtext={
                        <span className="text-neutral-dark/60 font-bold text-[9px] uppercase tracking-widest">
                            {pageData.stats.resolutionRate.subtext}
                        </span>
                    }
                    icon={BadgeCheck}
                />
                <AdminStatCard
                    title="PENDING APPEALS"
                    value={pageData.stats.appeals.value}
                    subtext={
                        <span className="text-destructive font-bold text-[9px] uppercase tracking-widest">
                            {pageData.stats.appeals.subtext}
                        </span>
                    }
                    icon={AlertCircle}
                    iconBgClass="bg-[#F8E2DF]"
                    iconColorClass="text-destructive"
                    accentClass="border-l-4 border-l-destructive"
                />
            </div>

            {/* Main Content Area (2-column layout) */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Left Column: Active Dispute Queue */}
                <div className="xl:col-span-2 flex flex-col">
                    <ActiveDisputeQueue
                        data={pageData.queue}
                        onFilterClick={() => openModal('Filter Queue', 'Filter table by dispute reason or amount.')}
                        onSortClick={() => openModal('Sort Queue', 'Sort table by newest or oldest.')}
                        onRowClick={(id) => openModal('Review Dispute', `Opening full workspace for dispute ${id}.`)}
                    />
                </div>

                {/* Right Column: Sidebar Cards */}
                <div className="xl:col-span-1 flex flex-col gap-6">
                    <DisputeReasonsCard
                        data={pageData.reasons}
                        trend={pageData.trendAnalysis}
                    />
                    <RecentActivityCard
                        activities={pageData.activities}
                        onViewAllClick={() => openModal('Activity Log', 'Viewing complete timeline of dispute events.')}
                    />
                </div>

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

export default DisputesPage;