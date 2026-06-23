import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';


const Header = ({ toggleSidebar }) => {
  return (
    <header className="md:hidden shrink-0 fixed top-0 left-0 right-0 z-50 h-[57px] bg-neutral border-b  border-neutral-dark/10 flex items-center px-4 gap-3 shadow-sm">
      
      <button
        onClick={toggleSidebar}
        className="p-1.5 text-primary hover:bg-primary/10 rounded-md transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Toggle Menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Brand */}
      <Link
        to="/"
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary rounded w-fit"
        aria-label="Artisan Hub Home"
      >
        <span className="font-headline text-lg font-bold text-primary tracking-tight">
          Artisan Hub
        </span>
      </Link>
    </header>
  );
};

export default Header;