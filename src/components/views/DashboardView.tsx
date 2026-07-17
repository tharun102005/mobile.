import React from 'react';
import { useApp } from '../../context/AppContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { useHaptics } from '../../hooks/useHaptics';
import {
  Camera,
  Mic,
  MapPin,
  Bell,
  Compass,
  Vibrate,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Download
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { permissions, setActiveTab, requestPermission } = useApp();
  const { isInstallable, isStandalone, promptInstall } = usePWAInstall();
  const { triggerHaptic } = useHaptics();

  const totalPermissions = Object.keys(permissions).length;
  const grantedCount = Object.values(permissions).filter(p => p.status === 'granted').length;

  const quickFeatureList = [
    { id: 'camera', label: 'Camera Studio', icon: Camera, color: 'from-indigo-500 to-purple-600' },
    { id: 'microphone', label: 'Audio Recorder', icon: Mic, color: 'from-purple-500 to-pink-600' },
    { id: 'geolocation', label: 'GPS Radar', icon: MapPin, color: 'from-emerald-500 to-teal-600' },
    { id: 'orientation', label: '3D Gyroscope', icon: Compass, color: 'from-orange-500 to-amber-600' },
    { id: 'notifications', label: 'Push Alerts', icon: Bell, color: 'from-blue-500 to-indigo-600' },
    { id: 'vibration', label: 'Haptic Engine', icon: Vibrate, color: 'from-violet-500 to-fuchsia-600' },
  ];

  return (
    <div className="space-y-5 pb-24 animate-slide-up">
      {/* Welcome Banner Card */}
      <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl shadow-indigo-500/20">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-semibold tracking-wide border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            Native Mobile Experience PWA
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight leading-tight">
            Privacy-First Device Platform
          </h2>
          <p className="text-xs text-indigo-100/90 max-w-sm leading-relaxed">
            Every native capability is requested only when you trigger it, with full pre-consent explanation modals.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => { triggerHaptic('light'); setActiveTab('features'); }}
              className="px-4 py-2.5 rounded-xl bg-white text-indigo-950 font-bold text-xs shadow-md active:scale-95 transition-transform flex items-center gap-1.5"
            >
              Open Studio <ChevronRight className="w-3.5 h-3.5" />
            </button>
            
            {isInstallable && !isStandalone && (
              <button
                onClick={promptInstall}
                className="px-4 py-2.5 rounded-xl bg-white/20 backdrop-blur-md text-white font-semibold text-xs border border-white/30 active:scale-95 transition-transform flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Install App
              </button>
            )}
          </div>
        </div>

        {/* Decorative Background Circles */}
        <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none" />
      </div>

      {/* Permissions Security Overview Pill */}
      <div
        onClick={() => { triggerHaptic('light'); setActiveTab('permissions'); }}
        className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:border-indigo-500/50 transition-all active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Permission Center</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {grantedCount} of {totalPermissions} capabilities authorized
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-400" />
      </div>

      {/* Quick Launch Features Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
          Hardware & Sensor Features
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {quickFeatureList.map(item => {
            const Icon = item.icon;
            const perm = permissions[item.id as keyof typeof permissions];

            return (
              <button
                key={item.id}
                onClick={() => {
                  triggerHaptic('light');
                  if (perm && perm.status !== 'granted') {
                    requestPermission(item.id as any, () => setActiveTab('features'));
                  } else {
                    setActiveTab('features');
                  }
                }}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-500/50 flex flex-col items-start text-left space-y-3 shadow-sm hover:shadow-md transition-all active:scale-95 group"
              >
                <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${item.color} text-white shadow-md group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.label}</h4>
                  <span className="text-[10px] capitalize text-slate-500 dark:text-slate-400 mt-0.5 inline-block">
                    Status: <strong className="text-indigo-600 dark:text-indigo-400">{perm?.status || 'prompt'}</strong>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
