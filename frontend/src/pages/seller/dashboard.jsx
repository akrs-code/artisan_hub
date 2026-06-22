import { Calendar, ChevronDown } from 'lucide-react';
import DashboardHeader from '../../components/seller/DashboardHeader';
import StatCard from '../../components/seller/StatCard';
import SalesPerformance from '../../components/seller/SalesPerformance';
import TopProducts from '../../components/seller/TopProducts';
import RecentOrders from '../../components/seller/RecentOrders';
import DashboardFAB from '../../components/seller/DashboardFAB';
import ActionModal from '../../components/seller/ActionModal';
import { useState } from 'react';

const Dashboard = () => {
  const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '' });

  const openModal = (title, message) => {
    setModalState({ isOpen: true, title, message });
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="relative min-h-full bg-background px-8 pb-12 w-full max-w-[1400px] mx-auto">
      <DashboardHeader />

      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mt-8 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-neutral-dark mb-1">
            Welcome back, Habib!
          </h1>
          <p className="text-[13px] font-sans text-neutral-dark/60 font-medium">
            Your workshop performance is looking strong this week.
          </p>
        </div>

        {/* Date Picker Button */}
        <button 
          onClick={() => openModal('Date Filtering', 'The date filtering feature is currently under development. Check back soon!')}
          className="flex items-center gap-3 bg-neutral px-4 py-2.5 rounded-lg border border-neutral-dark/15 shadow-sm text-[13px] font-sans font-bold text-neutral-dark/80 hover:bg-neutral-light transition-colors"
        >
          <Calendar className="w-4 h-4 text-primary" />
          Oct 12 - Oct 19, 2023
          <ChevronDown className="w-4 h-4 text-neutral-dark/50 ml-2" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="TOTAL SALES"
          value="P8,432.00"
          percentage={12.5}
          isPositive={true}
          trendData={[10, 20, 15, 30, 25, 40, 35, 50, 45, 60]}
        />
        <StatCard
          title="ORDERS"
          value="142"
          percentage={4.2}
          isPositive={true}
          trendData={[20, 18, 25, 22, 30, 28, 35, 32, 40, 38]}
        />
        <StatCard
          title="AVG. ORDER VALUE"
          value="$59.38"
          percentage={8.1}
          isPositive={true}
          trendData={[5, 10, 8, 15, 12, 20, 18, 25, 22, 30]}
        />
        <StatCard
          title="STORE VISITS"
          value="1,204"
          percentage={-2.4}
          isPositive={false}
          trendData={[40, 38, 35, 30, 32, 25, 28, 20, 22, 15]}
        />
      </div>

      {/* Middle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <SalesPerformance />
        </div>
        <div className="lg:col-span-1">
          <TopProducts />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full">
        <RecentOrders />
      </div>

      {/* Floating Action Button */}
      <DashboardFAB onClick={() => openModal('Quick Actions', 'Quick action shortcuts will be available in a future update.')} />

      {/* Action Modal */}
      <ActionModal 
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
      />
    </div>
  );
};

export default Dashboard;