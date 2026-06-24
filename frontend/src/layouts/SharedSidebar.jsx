import { Link, useNavigate } from 'react-router-dom';
import { User, X, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from '../components/shared/NotificationBell';


export const SharedSidebar = ({ sidebarContent, isSidebarOpen, setIsSidebarOpen }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = (e) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  const getInitial = () => {
    if (!user?.name) return 'U';
    return user.name.charAt(0).toUpperCase();
  };
  return (
    <>
      
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
          w-[272px] bg-background border-r border-border
          flex flex-col shadow-glass select-none overflow-hidden
          transition-transform duration-300 ease-in-out

          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}

          md:static md:translate-x-0 md:flex md:shrink-0 md:shadow-none
        `}
      >
        {/* Branding (visible on all sizes — on mobile it's below the Header, on desktop it IS the top bar) */}
        <div className="shrink-0 border-b border-border px-5 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-[8px] w-fit"
            aria-label="Artisan Hub Home"
          >
            <span className="font-headline text-lg font-bold text-primary tracking-tight">
              Artisan Hub
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <NotificationBell />
            {/* Close button — mobile only */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1.5 text-foreground hover:bg-muted rounded-[8px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable nav content */}
        <nav className="flex-1 overflow-y-auto nav-hide-scrollbar">
          {sidebarContent}
        </nav>

        {/* Profile footer */}
        <div className="shrink-0 border-t border-border p-4 space-y-2">
          {isAuthenticated && user ? (
            <>
              <div className="flex items-center gap-3 px-3 py-2.5 bg-muted border border-border rounded-[8px] shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold font-headline shrink-0">
                    {getInitial()}
                  </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground font-sans truncate">{user.name}</p>
                  <p className="text-[9px] font-sans font-semibold text-muted-foreground uppercase tracking-wider">{user.role}</p>
                </div>
              </div>
              
              <button
                onClick={handleSignOut}
                className="flex items-center justify-center w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-[8px] hover:bg-primary/90 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary font-sans font-bold text-[10px] uppercase tracking-widest cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 mr-2" />
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center justify-center w-full px-4 py-2.5 text-primary-foreground bg-primary hover:bg-primary/90 rounded-[8px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary font-sans font-bold text-[10px] uppercase tracking-widest"
            >
              <LogIn className="w-3.5 h-3.5 mr-2" />
              Sign In
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};

export default SharedSidebar;
