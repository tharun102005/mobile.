import React from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../hooks/useTheme';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Moon, Sun, Wifi, WifiOff, Download, ShieldCheck, UserCheck } from 'lucide-react';

export const AppHeader: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isOnline = useOnlineStatus();
  const { isInstallable, promptInstall } = usePWAInstall();
  const { permissions } = useApp();

  const grantedCount = Object.values(permissions).filter(p => p.status === 'granted').length;

  const openAdminPortal = () => {
    window.location.hash = '#admin';
  };

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 px-4 pt-safe pb-3 transition-colors duration-300">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        {/* App Title & Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-slate-100 dark:to-slate-300">
              OmniSense
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-indigo-600 dark:text-indigo-400">
                Native PWA
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600" />
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                {grantedCount}/10 Active
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Admin Portal Shortcut */}
          <button
            onClick={openAdminPortal}
            className="px-2 py-1 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-all active:scale-95 flex items-center gap-1 border border-indigo-500/20"
            title="Open Admin Portal (/admin)"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>

          {/* Online / Offline Status Badge */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              isOnline
                ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-500/20'
            }`}
            title={isOnline ? 'Online Connection Active' : 'Offline Mode Active'}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 animate-pulse" />
                <span>Offline</span>
              </>
            )}
          </div>

          {/* PWA Install Button if available */}
          {isInstallable && (
            <button
              onClick={promptInstall}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-transform active:scale-95 flex items-center justify-center"
              title="Install App to Device"
            >
              <Download className="w-4 h-4" />
            </button>
          )}

          {/* Dark / Light Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl glass-pill hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-200 transition-all active:scale-95"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
