import React from 'react';
import { useApp } from '../../context/AppContext';
import { useHaptics } from '../../hooks/useHaptics';
import type { HapticPreset } from '../../hooks/useHaptics';
import { Vibrate } from 'lucide-react';

export const VibrationFeature: React.FC = () => {
  const { requestPermission, showToast } = useApp();
  const { isSupported, triggerHaptic } = useHaptics();

  const playPreset = (preset: HapticPreset, name: string) => {
    requestPermission('vibration', () => {
      const res = triggerHaptic(preset);
      if (res) {
        showToast(`Haptic trigger: ${name}`);
      } else {
        showToast(`Vibration triggered: ${name} (or unsupported on desktop)`);
      }
    });
  };

  return (
    <div className="p-5 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400">
            <Vibrate className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Vibration Haptics</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Sensory tactile vibration feedback engine</p>
          </div>
        </div>

        <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
          isSupported
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
        }`}>
          {isSupported ? 'Supported' : 'Simulation'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {[
          { preset: 'light' as HapticPreset, label: 'Light Tick', color: 'bg-indigo-600' },
          { preset: 'medium' as HapticPreset, label: 'Medium Tap', color: 'bg-purple-600' },
          { preset: 'heavy' as HapticPreset, label: 'Heavy Thud', color: 'bg-pink-600' },
          { preset: 'success' as HapticPreset, label: 'Success Pulse', color: 'bg-emerald-600' },
          { preset: 'warning' as HapticPreset, label: 'Warning Alert', color: 'bg-amber-600' },
          { preset: 'error' as HapticPreset, label: 'Error Alarm', color: 'bg-rose-600' },
        ].map(item => (
          <button
            key={item.preset}
            onClick={() => playPreset(item.preset, item.label)}
            className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-violet-500/50 flex flex-col items-center justify-center text-center gap-1.5 active:scale-95 transition-all group"
          >
            <div className={`w-3 h-3 rounded-full ${item.color} group-hover:scale-125 transition-transform`} />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
