import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppHeader } from './components/common/AppHeader';
import { BottomNav } from './components/common/BottomNav';
import { PermissionModal } from './components/common/PermissionModal';
import { Toast } from './components/common/Toast';
import { InstallPwaBanner } from './components/common/InstallPwaBanner';
import { DashboardView } from './components/views/DashboardView';
import { StudioView } from './components/views/StudioView';
import { PermissionsView } from './components/views/PermissionsView';
import { SettingsView } from './components/views/SettingsView';
import { AdminPortal } from './admin/AdminPortal';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  useEffect(() => {
    const checkHash = () => {
      setIsAdminRoute(window.location.pathname.startsWith('/admin') || window.location.hash === '#admin');
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    window.addEventListener('popstate', checkHash);

    return () => {
      window.removeEventListener('hashchange', checkHash);
      window.removeEventListener('popstate', checkHash);
    };
  }, []);

  if (isAdminRoute) {
    return <AdminPortal />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'features':
        return <StudioView />;
      case 'permissions':
        return <PermissionsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 sm:py-6 sm:px-4 flex justify-center items-start selection:bg-indigo-500 selection:text-white font-sans">
      {/* Mobile Frame Container: Fullscreen on mobile, Mobile Mockup on Desktop */}
      <div className="w-full sm:max-w-md min-h-screen sm:min-h-[844px] sm:max-h-[920px] bg-slate-50 dark:bg-slate-950 sm:rounded-[40px] sm:shadow-2xl sm:shadow-indigo-500/10 sm:border-8 sm:border-slate-800 flex flex-col relative overflow-hidden transition-colors duration-300">
        
        {/* Header Bar */}
        <AppHeader />

        {/* Floating PWA Banner */}
        <InstallPwaBanner />

        {/* Scrollable Main Content Viewport */}
        <main className="flex-1 overflow-y-auto px-4 pt-4 pb-20">
          {renderActiveView()}
        </main>

        {/* Pre-Consent Explanatory Modal */}
        <PermissionModal />

        {/* Floating Toast Message */}
        <Toast />

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
