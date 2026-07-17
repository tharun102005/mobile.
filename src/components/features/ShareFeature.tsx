import React from 'react';
import { useApp } from '../../context/AppContext';
import { useHaptics } from '../../hooks/useHaptics';
import { Share2, Link } from 'lucide-react';

export const ShareFeature: React.FC = () => {
  const { requestPermission, showToast } = useApp();
  const { triggerHaptic } = useHaptics();

  const handleNativeShare = async () => {
    requestPermission('share', async () => {
      triggerHaptic('medium');
      const shareData = {
        title: 'OmniSense Native PWA',
        text: 'Experience modern mobile progressive web apps with privacy-first native device permissions!',
        url: window.location.href,
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          triggerHaptic('success');
          showToast('Shared successfully!');
        } catch (err: any) {
          if (err.name !== 'AbortError') {
            showToast('Share failed.');
          }
        }
      } else {
        // Fallback to clipboard copy
        try {
          await navigator.clipboard.writeText(shareData.url);
          triggerHaptic('success');
          showToast('Share link copied to clipboard!');
        } catch {
          showToast('Failed to share.');
        }
      }
    });
  };

  return (
    <div className="p-5 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-pink-500/10 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Web Share API</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Native mobile OS share sheet integration</p>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Link className="w-4 h-4 text-pink-500 shrink-0" />
          <div className="truncate text-xs">
            <p className="font-semibold text-slate-800 dark:text-slate-200">App Landing URL</p>
            <p className="text-slate-500 truncate">{window.location.href}</p>
          </div>
        </div>

        <button
          onClick={handleNativeShare}
          className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs shadow-md active:scale-95 transition-transform flex items-center gap-1.5 shrink-0"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share Sheet
        </button>
      </div>
    </div>
  );
};
