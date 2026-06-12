import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { SharedSidebar } from './SharedSidebar';
import Header from '../components/Header';

const RootLayout = ({ sidebarContent }) => {
  // Default open on desktop (≥768px), closed on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      }

    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#E8E3D9]">

      {/* Sidebar — hidden off-screen on mobile, always visible on md+ */}
      <SharedSidebar
        sidebarContent={sidebarContent}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Right column: header + scrollable main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Mobile-only top header bar */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto relative bg-[#E8E3D9]">
          {/* Top padding only on mobile to clear the fixed header */}
          <div className="pt-[57px] md:pt-0 h-full">
            <Outlet context={{ toggleSidebar }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default RootLayout;
