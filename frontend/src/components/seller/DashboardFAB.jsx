import React from 'react';
import { Plus } from 'lucide-react';

const DashboardFAB = () => {
  return (
    <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#8C5233] hover:bg-[#7E4A2E] text-white rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(140,82,51,0.4)] transition-transform hover:scale-105 active:scale-95 outline-none focus-visible:ring-4 focus-visible:ring-primary/40 z-50">
      <Plus className="w-6 h-6" />
    </button>
  );
};

export default DashboardFAB;
