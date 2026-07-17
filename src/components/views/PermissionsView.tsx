import React from 'react';
import { useApp } from '../../context/AppContext';
import { useHaptics } from '../../hooks/useHaptics';
import type { PermissionId } from '../../types';
import { Shield, Lock, RotateCcw, HelpCircle } from 'lucide-react';

export const PermissionsView: React.FC = () => {
  const { permissions, requestPermission, resetPermissionState, showToast } = useApp();
  const { triggerHaptic } = useHaptics();

  const permList = Object.values(permissions);
  const grantedCount = permList.filter(p => p.status === 'granted').length;
  const promptCount = permList.filter(p => p.status === 'prompt').length;
  const deniedCount = permList.filter(p => p.status === 'denied').length;
  const unsupportedCount = permList.filter(p => p.status === 'unsupported').length;

  const handleTestRequest = (id: PermissionId) => {
    requestPermission(id, () => {
      showToast(`Permission test successful for ${permissions[id].name}`);
    });
  };

  return (
    <div className="space-y-6 pb-24 animate-slide-up">
      <div className="px-1">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Privacy & Permission Center
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Review native device permissions, pre-consent privacy rules, and site settings guides.
        </p>
      </div>

      {/* Permissions Summary Dashboard Pills */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Granted</span>
          <p className="text-lg font-extrabold mt-0.5">{grantedCount}</p>
        </div>
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Prompt</span>
          <p className="text-lg font-extrabold mt-0.5">{promptCount}</p>
        </div>
        <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400">
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Denied</span>
          <p className="text-lg font-extrabold mt-0.5">{deniedCount}</p>
        </div>
        <div className="p-3 rounded-2xl bg-slate-500/10 border border-slate-500/20 text-slate-600 dark:text-slate-400">
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">N/A</span>
          <p className="text-lg font-extrabold mt-0.5">{unsupportedCount}</p>
        </div>
      </div>

      {/* List of 10 Permissions */}
      <div className="space-y-4">
        {permList.map(perm => (
          <div
            key={perm.id}
            className="p-5 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{perm.name}</h3>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    {perm.category}
                  </span>
                </div>
              </div>

              <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
                perm.status === 'granted'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : perm.status === 'denied'
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                  : perm.status === 'unsupported'
                  ? 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
              }`}>
                {perm.status}
              </span>
            </div>

            {/* Why Needed Box */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200 text-[11px]">
                <Lock className="w-3.5 h-3.5 text-indigo-500" />
                Why this permission is needed:
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {perm.whyNeeded}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-1">
              {perm.status !== 'unsupported' && (
                <button
                  onClick={() => handleTestRequest(perm.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm active:scale-95 transition-transform"
                >
                  {perm.status === 'granted' ? 'Re-Test Access' : 'Request Permission'}
                </button>
              )}
              <button
                onClick={() => { triggerHaptic('light'); resetPermissionState(perm.id); }}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition-colors"
                title="Reset local prompt status"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Guide on How to Unblock Denied Permissions in Browsers */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-3 shadow-xl">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
          <HelpCircle className="w-5 h-5" />
          <span>How to Unblock Denied Permissions</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Browsers block permission prompts once denied. To reset permissions manually:
        </p>

        <div className="space-y-2 text-xs text-slate-300">
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <strong className="text-indigo-300">Android Chrome / Desktop Chrome:</strong> Tap the lock icon in the address bar ➔ Site settings ➔ Reset permissions.
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <strong className="text-indigo-300">iOS Safari:</strong> Open iOS Settings ➔ Safari ➔ Camera / Microphone / Location ➔ Change to "Ask" or "Allow".
          </div>
        </div>
      </div>
    </div>
  );
};
