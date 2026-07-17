import React from 'react';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';
import { AdminLoginView } from './views/AdminLoginView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { UserManagementView } from './views/UserManagementView';
import { AuditLogsView } from './views/AuditLogsView';
import { ContentManagerView } from './views/ContentManagerView';
import { SystemLogsView } from './views/SystemLogsView';

const AdminPortalContent: React.FC = () => {
  const { isAuthenticated, activeAdminTab } = useAdminAuth();

  if (!isAuthenticated) {
    return <AdminLoginView />;
  }

  const renderTabContent = () => {
    switch (activeAdminTab) {
      case 'dashboard':
        return <AdminDashboardView />;
      case 'users':
        return <UserManagementView />;
      case 'audit':
        return <AuditLogsView />;
      case 'content':
        return <ContentManagerView />;
      case 'logs':
      case 'settings':
        return <SystemLogsView />;
      default:
        return <AdminDashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex font-sans antialiased text-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Admin Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export const AdminPortal: React.FC = () => {
  return (
    <AdminAuthProvider>
      <AdminPortalContent />
    </AdminAuthProvider>
  );
};
