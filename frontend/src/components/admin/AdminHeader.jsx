import React from 'react';
import { Search, Bell, HelpCircle } from 'lucide-react';

const AdminHeader = ({ 
  searchPlaceholder = "Search for shops, orders, or reports...", 
  primaryActionText = "Export Report",
  onPrimaryActionClick,
  secondaryActionText,
  secondaryActionIcon: SecondaryActionIcon,
  onSecondaryActionClick
}) => {
  return (
    <header className="flex justify-between items-center py-6">
      
      <div className="relative w-full max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-dark/40" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="w-full pl-11 pr-4 py-3 bg-neutral border border-neutral-dark/10 rounded-full text-[13px] font-sans placeholder:text-neutral-dark/40 focus:outline-none focus:ring-2 focus:ring-[#8C5233]/20 transition-all shadow-sm"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          {secondaryActionText && (
            <button 
              onClick={onSecondaryActionClick}
              className="flex items-center gap-2 px-6 py-2.5 rounded-md border border-[#8C5233] text-[#8C5233] hover:bg-[#8C5233]/5 text-[13px] font-sans font-bold transition-colors"
            >
              {SecondaryActionIcon && <SecondaryActionIcon className="w-4 h-4" />}
              {secondaryActionText}
            </button>
          )}
          <button 
            onClick={onPrimaryActionClick}
            className="px-6 py-2.5 rounded-md bg-[#8C5233] hover:bg-[#7E4A2E] text-white text-[13px] font-sans font-bold transition-colors shadow-sm"
          >
            {primaryActionText}
          </button>
        </div>
        <button className="relative text-neutral-dark/60 hover:text-neutral-dark transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#8C5233] rounded-full p-1">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full border border-background"></span>
        </button>
        <button className="text-neutral-dark/60 hover:text-neutral-dark transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#8C5233] rounded-full p-1">
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
