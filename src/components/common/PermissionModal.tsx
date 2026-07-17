import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, CheckCircle2, Lock, X } from 'lucide-react';

export const PermissionModal: React.FC = () => {
  const {
    pendingPermissionId,
    permissions,
    confirmPreConsentPermission,
    cancelPreConsentPermission,
  } = useApp();

  if (!pendingPermissionId) return null;

  const perm = permissions[pendingPermissionId];
  if (!perm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 backdrop-blur-md p-0 sm:p-4 animate-slide-up">
      {/* Click outside to cancel */}
      <div 
        className="absolute inset-0" 
        onClick={cancelPreConsentPermission} 
        aria-hidden="true" 
      />

      {/* Sheet Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 z-10 max-h-[90vh] overflow-y-auto">
        {/* Grab Handle Pill */}
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-5" />

        {/* Close Button */}
        <button
          onClick={cancelPreConsentPermission}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 mb-1">
              Permission Request
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
              {perm.name}
            </h3>
          </div>
        </div>

        {/* Explanation Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 mb-5 space-y-3">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">
                Why is access needed?
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {perm.whyNeeded}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>Data stays strictly on your device. No remote logging.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={confirmPreConsentPermission}
            className="flex-1 py-3.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all text-center"
          >
            Allow {perm.name}
          </button>
          <button
            onClick={cancelPreConsentPermission}
            className="py-3.5 px-5 rounded-xl font-medium text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98] transition-all text-center"
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
};
