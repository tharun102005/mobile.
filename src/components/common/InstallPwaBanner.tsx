import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Smartphone, Download, X } from 'lucide-react';

export const InstallPwaBanner: React.FC = () => {
  const { isInstallable, isStandalone, promptInstall } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable || isStandalone || dismissed) return null;

  return (
    <div className="mx-4 my-3 p-4 rounded-2xl bg-gradient-to-r from-indigo-900/90 via-purple-900/90 to-slate-900/90 text-white border border-indigo-500/30 shadow-xl relative backdrop-blur-md animate-slide-up">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:text-white bg-white/10"
        aria-label="Dismiss banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-center gap-3 pr-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
          <Smartphone className="w-5 h-5 text-indigo-300" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold leading-snug">Install OmniSense App</h4>
          <p className="text-xs text-indigo-200/80 mt-0.5">
            Add to your home screen for full offline access & fast native feel.
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          onClick={() => setDismissed(true)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white"
        >
          Maybe Later
        </button>
        <button
          onClick={promptInstall}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500 hover:bg-indigo-600 text-white shadow-md transition-transform active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          Install Now
        </button>
      </div>
    </div>
  );
};
