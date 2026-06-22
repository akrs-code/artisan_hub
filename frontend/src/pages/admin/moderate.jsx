import React, { useState } from 'react';
import {
    Hourglass,
    Flag,
    Clock,
    CheckCircle,
    TrendingDown
} from 'lucide-react';
import AdminStatCard from '../../components/admin/AdminStatCard';
import ModerationTable from '../../components/admin/ModerationTable';
// import BulkActionOverlay from '../../components/admin/BulkActionOverlay';
import AdminActionModal from '../../components/admin/AdminActionModal';

// --- Dummy Data (Data Contract for Backend) ---
const pageData = {
    stats: {
        pending: { value: '124', subtext: '12% less', isPositive: false },
        flagged: { value: '42', subtext: '8 urgent escalations' },
        avgTime: { value: '4.2h', subtext: 'Within SLA (6h)' },
        resolved: { value: '89', subtext: 'TARGET MET' }
    },
    tickets: [
        {
            productName: 'Hand-Carved Earthen Vase',
            id: '#PRD-9842',
            image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&q=80',
            shopName: 'Ancient Earth Crafts',
            violation: 'COPYRIGHT',
            flaggedDate: 'Oct 24, 2023',
            flaggedTime: '10:42 AM',
            severity: 88,
            status: 'ESCALATED'
        },
        {
            productName: 'Indigo Weave Runner',
            id: '#PRD-7210',
            image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&q=80',
            shopName: 'Studio Indigo',
            violation: 'QUALITY',
            flaggedDate: 'Oct 24, 2023',
            flaggedTime: '09:15 AM',
            severity: 45,
            status: 'UNDER REVIEW'
        },
        {
            productName: 'Botanical Soap Set',
            id: '#PRD-3301',
            image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=400&q=80',
            shopName: "Nature's Lather",
            violation: 'PROHIBITED',
            flaggedDate: 'Oct 23, 2023',
            flaggedTime: '04:30 PM',
            severity: 12,
            status: 'PENDING'
        }
    ]
};

const Moderate = () => {
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
                        Product Moderation
                    </h1>
                    <p className="text-muted-foreground font-sans text-xs">
                        Review and manage reported items from the Artisan community.
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <AdminStatCard
                    title="PENDING REVIEW"
                    value={pageData.stats.pending.value}
                    subtext={
                        <span className="flex items-center gap-1 text-[#8C5233] font-bold">
                            <TrendingDown className="w-3 h-3" />
                            {pageData.stats.pending.subtext}
                        </span>
                    }
                    icon={Hourglass}
                />
                <AdminStatCard
                    title="FLAGGED ITEMS"
                    value={pageData.stats.flagged.value}
                    subtext={
                        <span className="text-destructive font-bold text-[9px]">
                            {pageData.stats.flagged.subtext}
                        </span>
                    }
                    icon={Flag}
                    iconBgClass="bg-[#F8E2DF]"
                    iconColorClass="text-destructive"
                />
                <AdminStatCard
                    title="AVG. REVIEW TIME"
                    value={pageData.stats.avgTime.value}
                    subtext={pageData.stats.avgTime.subtext}
                    icon={Clock}
                />
                <AdminStatCard
                    title="RESOLVED TODAY"
                    value={pageData.stats.resolved.value}
                    subtext={
                        <span className="text-[#8C5233] font-bold tracking-widest text-[9px] uppercase">
                            {pageData.stats.resolved.subtext}
                        </span>
                    }
                    icon={CheckCircle}
                />
            </div>

            {/* Main Table Content */}
            <div className="w-full mb-8">
                <ModerationTable
                    data={pageData.tickets}
                    onFilterClick={(filterName) => openModal(`${filterName} Filter`, `Select options to filter the moderation queue by ${filterName}.`)}
                    onDownloadClick={() => openModal('Download Report', 'Download the current moderation queue data.')}
                    onReviewClick={(productName) => openModal('Review Ticket', `Review full moderation details for ${productName}.`)}
                />
            </div>

            {/* Floating Bulk Action Overlay (Mockup State) */}
            {/* <BulkActionOverlay 
                selectedCount={4}
                onActionClick={(actionName) => openModal(`Bulk Action: ${actionName}`, `Applying ${actionName} to 4 selected tickets.`)}
            /> */}

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

export default Moderate;
