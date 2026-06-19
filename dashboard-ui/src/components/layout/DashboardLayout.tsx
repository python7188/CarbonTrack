import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { TourGuide } from '../features/tour/TourGuide';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuOpen = useCallback(() => setSidebarOpen(true), []);
  const handleMenuClose = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="flex h-screen w-full bg-[var(--ct-bg-surface)] overflow-hidden font-body text-[var(--ct-ink)]">
      <TourGuide />
      {/* Skip navigation */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-[var(--ct-bg-light)] focus:text-[var(--ct-ink)] focus:border-2 focus:border-[var(--ct-border-hard)] top-0 left-0">
        Skip to main content
      </a>

      {/* Sidebar (desktop fixed + mobile drawer) */}
      <Sidebar isOpen={sidebarOpen} onClose={handleMenuClose} />

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Scrollable content area with extra left padding for the sidebar gap */}
        <div className="flex-1 overflow-y-auto relative z-10 px-4 sm:px-8 md:px-12 lg:pl-32 lg:pr-16 py-6 sm:py-8 pb-32 lg:pb-8">
          {/* Header */}
          <Header onMenuClick={handleMenuOpen} />

          {/* Page content via nested route */}
          <main id="main-content" role="main">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile bottom navigation — hidden on lg+ */}
      <MobileNav />
    </div>
  );
};
