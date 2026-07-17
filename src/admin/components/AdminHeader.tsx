import React from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useTheme } from '../../hooks/useTheme';
import { LogOut, Moon, Sun, Bell, Shield } from 'lucide-react';

export const AdminHeader: React.FC = () => {
  const { adminUser, logoutAdmin } = useAdminAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between shrink-0">
      {/* Title / Breadcrumb */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5" />
          Role: Admin (Full Privileges)
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Notifications Icon */}
        <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        {/* Admin Profile & Logout */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800">
          {adminUser?.avatarUrl ? (
            <img src={adminUser.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
              AD
            </div>
          )}

          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{adminUser?.name}</p>
            <p className="text-[10px] text-slate-500 truncate">{adminUser?.email}</p>
          </div>

          <button
            onClick={logoutAdmin}
            className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
            title="Log out Admin Session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
