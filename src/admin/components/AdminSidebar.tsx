import React from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Megaphone,
  AlertTriangle,
  Settings,
  ArrowLeft,
  ShieldAlert
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const { activeAdminTab, setActiveAdminTab } = useAdminAuth();
  const { setActiveTab } = useApp();

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users' as const, label: 'User Management', icon: Users },
    { id: 'audit' as const, label: 'Security Audit Logs', icon: ShieldCheck },
    { id: 'content' as const, label: 'Announcements', icon: Megaphone },
    { id: 'logs' as const, label: 'System Error Logs', icon: AlertTriangle },
    { id: 'settings' as const, label: 'Global Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-extrabold text-base text-white tracking-tight leading-snug">
            OmniSense
          </h2>
          <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">
            Admin Console
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Administration
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeAdminTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveAdminTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'hover:bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Return to PWA App Button */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to PWA App
        </button>
      </div>
    </aside>
  );
};
