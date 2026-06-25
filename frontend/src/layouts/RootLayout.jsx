import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { SharedSidebar } from './SharedSidebar';
import Header from '../components/Header';

const RootLayout = ({ sidebarContent }) => {
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">

      
      <SharedSidebar
        sidebarContent={sidebarContent}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Right column: header + scrollable main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Mobile-only top header bar */}
        <Header toggleSidebar={toggleSidebar} />

        
        <main className="flex-1 overflow-y-auto relative bg-background">
          
          <div className="pt-[57px] md:pt-0 h-full">
            <Outlet context={{ toggleSidebar }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default RootLayout;
