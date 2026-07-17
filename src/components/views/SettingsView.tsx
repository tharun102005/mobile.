import React from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../hooks/useTheme';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useHaptics } from '../../hooks/useHaptics';
import { Moon, Sun, Smartphone, Trash2, ShieldCheck } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { isStandalone, isInstallable, promptInstall } = usePWAInstall();
  const isOnline = useOnlineStatus();
  const { showToast } = useApp();
  const { triggerHaptic } = useHaptics();

  const handleClearCache = () => {
    triggerHaptic('warning');
    localStorage.clear();
    showToast('App storage & cache cleared!');
  };

  return (
    <div className="space-y-6 pb-24 animate-slide-up">
      <div className="px-1">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Application Settings
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          PWA status, local storage cache, theme preferences, and security notice.
        </p>
      </div>

      {/* Theme Card */}
      <div className="p-5 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
              {theme === 'dark' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Interface Theme</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Current mode: {theme}</p>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md active:scale-95 transition-transform"
          >
            Switch to {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>

      {/* PWA App Status Card */}
      <div className="p-5 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">PWA Installation Status</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isStandalone ? 'Running as standalone native app' : 'Running inside web browser viewport'}
            </p>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
          <span className="font-medium text-slate-700 dark:text-slate-300">Connection Mode:</span>
          <span className={`font-bold ${isOnline ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isOnline ? 'Online (Cached SW Active)' : 'Offline (SW Serving Cache)'}
          </span>
        </div>

        {isInstallable && !isStandalone && (
          <button
            onClick={promptInstall}
            className="w-full py-3 rounded-2xl bg-indigo-600 text-white font-semibold text-xs shadow-md active:scale-95 transition-transform"
          >
            Install OmniSense PWA to Home Screen
          </button>
        )}
      </div>

      {/* Clear Cache */}
      <div className="p-5 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Reset Local Data</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Clear cached media, snapshots, and permissions</p>
          </div>
        </div>

        <button
          onClick={handleClearCache}
          className="w-full py-3 rounded-2xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-600 dark:text-rose-400 font-semibold text-xs border border-rose-500/20 active:scale-95 transition-transform"
        >
          Clear Local Storage & Session Data
        </button>
      </div>

      {/* Privacy & Security Policy Notice */}
      <div className="p-5 rounded-3xl bg-slate-900 text-slate-300 space-y-3 text-xs border border-slate-800">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
          <ShieldCheck className="w-5 h-5" />
          <span>Security & Privacy Compliance</span>
        </div>
        <p className="leading-relaxed">
          OmniSense strictly follows Android, iOS, and W3C Web Application security standards.
        </p>
        <ul className="list-disc list-inside space-y-1 text-slate-400">
          <li>Never requests unnecessary permissions upfront.</li>
          <li>Every API is invoked strictly in response to an explicit user gesture.</li>
          <li>All media, audio, and GPS coordinates remain entirely on-device.</li>
        </ul>
      </div>
    </div>
  );
};
