import React, { useState } from 'react';
import { 
  ClipboardList, 
  Clock, 
  Percent, 
  BadgeCheck, 
  TrendingUp,
  Palette,
  Gem,
  Hammer,
  Scissors
} from 'lucide-react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminStatCard from '../../components/admin/AdminStatCard';
import ApplicationsTable from '../../components/admin/ApplicationsTable';
import BatchVerifyFAB from '../../components/admin/BatchVerifyFAB';
import AdminActionModal from '../../components/admin/AdminActionModal';

// --- Dummy Data (Data Contract for Backend) ---
const pageData = {
  stats: {
    pending: { value: '42', subtext: '+5', isPositive: true },
    avgReviewTime: { value: '18 hrs', subtext: 'Goal: 12h' },
    approvalRate: { value: '76%', subtext: 'Target: 80%' },
    verifiedToday: { value: '12', subtext: 'DAILY STATS' }
  },
  applications: [
    {
      name: 'Earthbound Arts',
      id: '#SHOP-9041',
      icon: Palette,
      category: 'Ceramics & Clay',
      appliedOn: 'Oct 24, 2023',
      score: 92,
      status: 'UNDER REVIEW'
    },
    {
      name: 'Silver Lining Studio',
      id: '#SHOP-8822',
      icon: Gem,
      category: 'Jewelry Design',
      appliedOn: 'Oct 25, 2023',
      score: 48,
      status: 'FLAGGED'
    },
    {
      name: 'Wildwood Craft',
      id: '#SHOP-9128',
      icon: Hammer,
      category: 'Woodworking',
      appliedOn: 'Oct 26, 2023',
      score: 85,
      status: 'NEW'
    },
    {
      name: 'Northern Fabrics',
      id: '#SHOP-9233',
      icon: Scissors,
      category: 'Textiles',
      appliedOn: 'Oct 26, 2023',
      score: 78,
      status: 'NEW'
    }
  ]
};

const Verify = () => {
  const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '' });

  const openModal = (title, message) => {
    setModalState({ isOpen: true, title, message });
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="relative min-h-full bg-background px-8 pb-32 w-full max-w-[1400px] mx-auto">
      <AdminHeader onExportClick={() => openModal('Export Report', 'Verification queue reports can be exported here.')} />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mt-8 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-neutral-dark mb-1">
            Verified Shops Queue
          </h1>
          <p className="text-[13px] font-sans text-neutral-dark/60 font-medium">
            Review and verify pending shop applications to maintain marketplace quality.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AdminStatCard 
          title="PENDING APPLICATIONS" 
          value={pageData.stats.pending.value} 
          subtext={
            <span className="flex items-center gap-1 text-[#8C5233] font-bold">
              <TrendingUp className="w-3 h-3" />
              {pageData.stats.pending.subtext}
            </span>
          }
          icon={ClipboardList}
        />
        <AdminStatCard 
          title="AVERAGE REVIEW TIME" 
          value={pageData.stats.avgReviewTime.value} 
          subtext={pageData.stats.avgReviewTime.subtext}
          icon={Clock}
        />
        <AdminStatCard 
          title="APPROVAL RATE" 
          value={pageData.stats.approvalRate.value} 
          subtext={pageData.stats.approvalRate.subtext}
          icon={Percent}
        />
        <AdminStatCard 
          title="VERIFIED TODAY" 
          value={pageData.stats.verifiedToday.value} 
          subtext={
            <span className="text-[#8C5233] font-bold tracking-widest">
              {pageData.stats.verifiedToday.subtext}
            </span>
          }
          icon={BadgeCheck}
        />
      </div>

      {/* Main Table Content */}
      <div className="w-full mb-8">
        <ApplicationsTable 
          data={pageData.applications} 
          onFilterClick={() => openModal('Filter Applications', 'Filter by status, category, or application date.')}
          onDownloadClick={() => openModal('Download Queue', 'Download the current verification queue data.')}
          onRowClick={(shopName) => openModal('Review Application', `Review full application details for ${shopName}.`)}
        />
      </div>

      {/* Action Modal */}
      <AdminActionModal 
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
      />

      {/* Floating Action Button */}
      <BatchVerifyFAB 
        count={5} 
        onClick={() => openModal('Batch Verify', 'Select multiple shops to verify them simultaneously.')} 
      />
    </div>
  );
};

export default Verify;
