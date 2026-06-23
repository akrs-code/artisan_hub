import React from 'react';
import { Search, Bell } from 'lucide-react';

const AdminHeader = ({
  searchPlaceholder = 'Search for shops, orders, or reports...',
  secondaryActionText,
  secondaryActionIcon: SecondaryActionIcon,
  onSecondaryActionClick,
}) => {
  return (
    <header className="flex justify-between items-center py-5 gap-4">
      {/* Search */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm font-sans placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all shadow-sm"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 shrink-0">
        {secondaryActionText && (
          <button
            onClick={onSecondaryActionClick}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted text-foreground text-xs font-sans font-semibold transition-colors"
          >
            {SecondaryActionIcon && <SecondaryActionIcon className="w-3.5 h-3.5" />}
            {secondaryActionText}
          </button>
        )}

        <button className="relative text-muted-foreground hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full p-1.5 hover:bg-muted">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full border border-card" />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
