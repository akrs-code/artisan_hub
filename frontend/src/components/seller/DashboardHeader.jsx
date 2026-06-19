import React from 'react';
import { Search, Bell, MessageSquare } from 'lucide-react';

const DashboardHeader = () => {
  return (
    <header className="flex items-center justify-between py-6">
      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-neutral-dark/50" />
        </div>
        <input
          type="text"
          className="input-search rounded-full"
          placeholder="Search orders, products..."
        />
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-6">
        <button className="text-neutral-dark/70 hover:text-neutral-dark transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full">
          <Bell className="w-5 h-5" />
        </button>
        <button className="text-neutral-dark/70 hover:text-neutral-dark transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full">
          <MessageSquare className="w-5 h-5" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-neutral-dark/10 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-neutral-dark">Habib Mangoranda</div>
            <div className="text-xs font-label text-neutral-dark/60">Master Potter</div>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden border border-neutral-dark/10">
            <img
              src="https://placehold.co/100x100/362E25/F5F0E8?text=ER"
              alt="Elena Rodriguez"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
