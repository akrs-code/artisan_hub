import React, { useState } from 'react';
import { 
  Users, 
  Store, 
  Ban, 
  UserPlus, 
  TrendingUp
} from 'lucide-react';
import AdminStatCard from '../../components/admin/AdminStatCard';
import UserDirectoryTable from '../../components/admin/UserDirectoryTable';
import AdminActionModal from '../../components/admin/AdminActionModal';

// --- Dummy Data (Data Contract for Backend) ---
const pageData = {
  stats: {
    totalUsers: { value: '24,892', subtext: '12% increase' },
    activeShops: { value: '1,402', subtext: 'Active Now' },
    suspended: { value: '43', subtext: 'Immediate Action' },
    newReg: { value: '128', subtext: 'LAST 24H' }
  },
  directory: [
    {
      name: 'Aurelia James',
      subtext: 'EARTH & FIRE STUDIO',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
      role: 'SELLER',
      status: 'VERIFIED',
      joinDate: 'Oct 12, 2023'
    },
    {
      name: 'Marcus Smith',
      subtext: 'MARCUS.VIBE@EMAIL.COM',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
      role: 'CUSTOMER',
      status: 'PENDING',
      joinDate: 'Jan 05, 2024'
    },
    {
      name: 'Liam Weaver',
      subtext: 'THE LOOM & HIDE',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      role: 'SELLER',
      status: 'SUSPENDED',
      joinDate: 'Nov 22, 2023'
    }
  ]
};

const UsersPage = () => {
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
            User & Store Management
          </h1>
          <p className="text-muted-foreground font-sans text-xs">
            Oversee Artisan Hub's ecosystem of creators and customers.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AdminStatCard 
          title="TOTAL USERS" 
          value={pageData.stats.totalUsers.value} 
          subtext={
            <span className="flex items-center gap-1 text-[#8C5233] font-bold">
              <TrendingUp className="w-3 h-3" />
              {pageData.stats.totalUsers.subtext}
            </span>
          }
          icon={Users}
        />
        <AdminStatCard 
          title="ACTIVE SHOPS" 
          value={pageData.stats.activeShops.value} 
          subtext={pageData.stats.activeShops.subtext}
          icon={Store}
        />
        <AdminStatCard 
          title="SUSPENDED" 
          value={pageData.stats.suspended.value} 
          subtext={
            <span className="text-destructive font-bold text-[9px]">
              {pageData.stats.suspended.subtext}
            </span>
          }
          icon={Ban}
          iconBgClass="bg-[#F8E2DF]"
          iconColorClass="text-destructive"
        />
        <AdminStatCard 
          title="NEW REGISTRATIONS" 
          value={pageData.stats.newReg.value} 
          subtext={
            <span className="text-[#8C5233] font-bold tracking-widest text-[9px] uppercase">
              {pageData.stats.newReg.subtext}
            </span>
          }
          icon={UserPlus}
        />
      </div>

      {/* Main Table Content */}
      <div className="w-full mb-8">
        <UserDirectoryTable 
          data={pageData.directory} 
          onFilterClick={(filterName) => openModal(`${filterName} Filter`, `Select options to filter the user directory by ${filterName}.`)}
          onActionClick={(actionName, userName) => openModal(`Action: ${actionName}`, `Applying ${actionName} to user ${userName}.`)}
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

export default UsersPage;