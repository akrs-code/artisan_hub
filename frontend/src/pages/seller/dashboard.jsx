import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import DashboardHeader from '../../components/seller/DashboardHeader';

const Dashboard = () => {
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
        <button className="flex items-center gap-3 bg-neutral px-4 py-2.5 rounded-lg border border-neutral-dark/15 shadow-sm text-[13px] font-sans font-bold text-neutral-dark/80 hover:bg-neutral-light transition-colors">
          <Calendar className="w-4 h-4 text-primary" />
          Oct 12 - Oct 19, 2023
          <ChevronDown className="w-4 h-4 text-neutral-dark/50 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;