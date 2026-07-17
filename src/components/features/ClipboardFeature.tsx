import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useHaptics } from '../../hooks/useHaptics';
import { Clipboard, Copy, Check, ShieldAlert } from 'lucide-react';

export const ClipboardFeature: React.FC = () => {
  const { permissions, requestPermission, showToast } = useApp();
  const { triggerHaptic } = useHaptics();

  const [textToCopy, setTextToCopy] = useState('OmniSense PWA: Privacy-first native device permissions demo!');
  const [pastedText, setPastedText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const status = permissions.clipboard.status;

  const handleCopyText = async () => {
    requestPermission('clipboard', async () => {
      try {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        triggerHaptic('success');
        showToast('Text copied to system clipboard!');
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.warn('Clipboard write error:', err);
        showToast('Failed to copy to clipboard.');
      }
    });
  };

  const handlePasteText = async () => {
    requestPermission('clipboard', async () => {
      try {
        const text = await navigator.clipboard.readText();
        setPastedText(text);
        triggerHaptic('medium');
        showToast('Pasted text from clipboard!');
      } catch (err) {
        console.warn('Clipboard read error:', err);
        showToast('Failed to read from clipboard.');
      }
    });
  };

  return (
    <div className="p-5 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
            <Clipboard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Clipboard Hub</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Copy & paste system text securely</p>
          </div>
        </div>

        <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
          status === 'granted'
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
            : status === 'denied'
            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
        }`}>
          {status}
        </span>
      </div>

      {/* Input box */}
      <div className="space-y-3">
        <textarea
          value={textToCopy}
          onChange={e => setTextToCopy(e.target.value)}
          rows={2}
          className="w-full p-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
          placeholder="Type or paste text..."
        />

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleCopyText}
            className="py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>

          <button
            onClick={handlePasteText}
            className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <Clipboard className="w-3.5 h-3.5 text-amber-500" />
            Paste Clipboard
          </button>
        </div>
      </div>

      {/* Pasted Content View */}
      {pastedText && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
          <span className="text-[10px] font-semibold uppercase text-amber-600 dark:text-amber-400">
            Last Pasted String:
          </span>
          <p className="text-xs text-slate-800 dark:text-slate-200 break-words font-mono">
            "{pastedText}"
          </p>
        </div>
      )}

      {status === 'denied' && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>Clipboard access denied. Check browser permission settings.</span>
        </div>
      )}
    </div>
  );
};
