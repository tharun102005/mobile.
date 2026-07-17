import React from 'react';
import { useApp } from '../../context/AppContext';
import { Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 max-w-xs sm:max-w-sm w-full px-4 animate-slide-up">
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/90 dark:bg-slate-100/95 text-slate-100 dark:text-slate-900 shadow-2xl backdrop-blur-md border border-slate-700/50 dark:border-slate-300/50 text-xs sm:text-sm font-medium">
        <Info className="w-4 h-4 text-indigo-400 dark:text-indigo-600 shrink-0" />
        <span className="flex-1 truncate">{toastMessage}</span>
      </div>
    </div>
  );
};
