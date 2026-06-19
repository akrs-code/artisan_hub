import { Link } from 'react-router-dom';
import { User, X, LogOut } from 'lucide-react';

/**
 * SharedSidebar
 *
 * Mobile  (<md): Fixed overlay drawer — slides in from left over content.
 * Desktop (≥md): Static column in the flex layout — always visible, no overlay.
 */
export const SharedSidebar = ({ sidebarContent, isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <>
      {/* Mobile overlay backdrop */}
      <div
        className={`
          fixed inset-0 bg-black/40 z-30 transition-opacity duration-300
          md:hidden
          ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        aria-hidden="true"
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar panel */}
      <aside
        aria-label="ArtisanHub Navigation"
        className={`
          fixed top-0 left-0 h-full z-40
          w-[272px] bg-neutral border-r border-neutral-dark/10
          flex flex-col shadow-lg select-none overflow-hidden
          transition-transform duration-300 ease-in-out

          /* Mobile: translate in/out */
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}

          /* Desktop: always visible, part of flex flow */
          md:static md:translate-x-0 md:flex md:shrink-0 md:shadow-none
        `}
      >
        {/* Branding (visible on all sizes — on mobile it's below the Header, on desktop it IS the top bar) */}
        <div className="shrink-0 border-b border-neutral-dark/10 px-5 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="outline-none focus-visible:ring-2 focus-visible:ring-primary rounded w-fit"
            aria-label="Artisan Hub Home"
          >
            <span className="font-headline text-lg font-bold text-primary tracking-tight">
              Artisan Hub
            </span>
          </Link>

          {/* Close button — mobile only */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-1.5 text-neutral-dark/60 hover:text-neutral-dark hover:bg-neutral-dark/5 rounded-md transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable nav content */}
        <nav className="flex-1 overflow-y-auto nav-hide-scrollbar">
          {sidebarContent}
        </nav>

        {/* Profile footer */}
        <div className="shrink-0 border-t border-neutral-dark/10 p-4 space-y-2">
          <Link
            to="/profile"
            className="flex items-center justify-between w-full px-3 py-3 bg-neutral-dark/5 border border-neutral-dark/10 rounded-md hover:bg-neutral-dark/10 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary group shadow-sm"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-white border border-neutral-dark/10 flex items-center justify-center text-neutral-dark/70 shrink-0">
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-neutral-dark font-sans truncate">Profile</span>
            </div>
          </Link>
          
          <Link
            to="/login"
            className="flex items-center justify-center w-full px-3 py-2.5 text-red-600 bg-red-50 border border-red-100 rounded-md hover:bg-red-100 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-red-400 font-sans font-bold text-[10px] uppercase tracking-widest"
          >
            <LogOut className="w-3.5 h-3.5 mr-2" />
            Sign Out
          </Link>
        </div>
      </aside>
    </>
  );
};

export default SharedSidebar;
