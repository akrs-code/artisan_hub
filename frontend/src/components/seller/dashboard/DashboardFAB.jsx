import React from 'react';
import { Plus } from 'lucide-react';

const DashboardFAB = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="fixed bottom-8 right-8 w-14 h-14 bg-primary hover:bg-primary-dark text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/40 transition-transform hover:scale-105 active:scale-95 outline-none focus-visible:ring-4 focus-visible:ring-primary/40 z-50"
    >
      <Plus className="w-6 h-6" />
    </button>
  );
};

export default DashboardFAB;
