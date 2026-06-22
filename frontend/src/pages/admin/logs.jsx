import React, { useState } from 'react';
import { Banknote, CheckCircle, Hourglass, AlertCircle, TrendingUp, Calendar } from 'lucide-react';
import AdminStatCard from '../../components/admin/AdminStatCard';
import TransactionLogsTable from '../../components/admin/TransactionLogsTable';
import AuditSummaryCard from '../../components/admin/AuditSummaryCard';
import PayoutHealthCard from '../../components/admin/PayoutHealthCard';
import AdminActionModal from '../../components/admin/AdminActionModal';

// --- Dummy Data (Data Contract for Backend) ---
const pageData = {
    stats: {
        volume: { value: 'P142,850.00', subtext: '12% increase' },
        successRate: { value: '99.4%', subtext: 'STABLE GROWTH' },
        pending: { value: 'P12,400.00', subtext: '86 PROCESSING' },
        disputes: { value: '14', subtext: 'IMMEDIATE ACTION' }
    },
    transactions: [
        {
            date: 'Oct 24, 2023',
            id: 'TXN-9021834',
            shopName: 'Ancient Earth Crafts',
            type: 'SALE',
            amount: '+P245.00',
            status: 'COMPLETED'
        },
        {
            date: 'Oct 23, 2023',
            id: 'TXN-9021835',
            shopName: 'Indigo Loom Textiles',
            type: 'PAYOUT',
            amount: '-P1,200.00',
            status: 'PENDING'
        },
        {
            date: 'Oct 23, 2023',
            id: 'TXN-9021836',
            shopName: 'Obsidian Fire Glass',
            type: 'SALE',
            amount: '+P68.00',
            status: 'DISPUTED'
        },
        {
            date: 'Oct 22, 2023',
            id: 'TXN-9021837',
            shopName: 'The Iron Forge',
            type: 'REFUND',
            amount: '-P142.50',
            status: 'COMPLETED'
        }
    ],
    payoutHealth: [
        { name: 'BANK TRANSFER (ACH)', health: 99.8 },
        { name: 'STRIPE CONNECT', health: 98.9 },
        { name: 'PAYPAL GLOBAL', health: 94.2 }
    ]
};

const LogsPage = () => {
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
                        Transaction Logs
                    </h1>
                    <p className="text-muted-foreground font-sans text-xs">
                        Monitor and audit all platform financial activity from artisanal crafts to raw material sales.
                    </p>
                </div>
            </div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <AdminStatCard
                    title="TOTAL VOLUME"
                    value={pageData.stats.volume.value}
                    subtext={
                        <span className="flex items-center gap-1 text-neutral-dark font-bold">
                            <TrendingUp className="w-3 h-3" />
                            {pageData.stats.volume.subtext}
                        </span>
                    }
                    icon={Banknote}
                />
                <AdminStatCard
                    title="SUCCESS RATE"
                    value={pageData.stats.successRate.value}
                    subtext={
                        <span className="text-neutral-dark/60 font-bold text-[9px] uppercase tracking-widest">
                            {pageData.stats.successRate.subtext}
                        </span>
                    }
                    icon={CheckCircle}
                />
                <AdminStatCard
                    title="PENDING SETTLEMENTS"
                    value={pageData.stats.pending.value}
                    subtext={
                        <span className="text-neutral-dark/60 font-bold text-[9px] uppercase tracking-widest">
                            {pageData.stats.pending.subtext}
                        </span>
                    }
                    icon={Hourglass}
                />
                <AdminStatCard
                    title="ACTIVE DISPUTES"
                    value={pageData.stats.disputes.value}
                    subtext={
                        <span className="text-destructive font-bold text-[9px] uppercase tracking-widest">
                            {pageData.stats.disputes.subtext}
                        </span>
                    }
                    icon={AlertCircle}
                    iconBgClass="bg-[#F8E2DF]"
                    iconColorClass="text-destructive"
                    accentClass="border-l-4 border-l-destructive"
                />
            </div>
            {/* Main Table Content */}
            <div className="w-full mb-8">
                <TransactionLogsTable
                    data={pageData.transactions}
                    onFilterClick={(filterName) => openModal(`${filterName} Filter`, `Select options to filter the logs by ${filterName}.`)}
                    onActionClick={(actionName, txnId) => openModal(`Action: ${actionName}`, `Viewing full details for transaction ${txnId}.`)}
                />
            </div>
            {/* Bottom Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <AuditSummaryCard
                        onReviewClick={() => openModal('Review Flags', 'Opening the AI audit flags queue for manual review.')}
                        onDownloadClick={() => openModal('Download Audit', 'Generating the full automated audit PDF report.')}
                    />
                </div>
                <div className="lg:col-span-1">
                    <PayoutHealthCard
                        data={pageData.payoutHealth}
                        lastUpdated="5 minutes ago"
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
export default LogsPage;