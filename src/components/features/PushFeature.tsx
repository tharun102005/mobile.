import React from 'react';
import { useApp } from '../../context/AppContext';
import { useHaptics } from '../../hooks/useHaptics';
import { Bell, Send, Clock, ShieldAlert } from 'lucide-react';

export const PushFeature: React.FC = () => {
  const { permissions, requestPermission, showToast } = useApp();
  const { triggerHaptic } = useHaptics();

  const status = permissions.notifications.status;

  const triggerLocalNotification = (title: string, body: string, delayMs = 0) => {
    requestPermission('notifications', async () => {
      triggerHaptic('medium');

      const sendNotification = async () => {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          const reg = await navigator.serviceWorker.ready;
          reg.showNotification(title, {
            body,
            icon: '/pwa-192x192.png',
            badge: '/favicon.svg',
            data: { url: window.location.href },
          } as NotificationOptions);
        } else if ('Notification' in window) {
          new Notification(title, {
            body,
            icon: '/pwa-192x192.png',
          });
        }
        triggerHaptic('success');
        showToast('Notification sent!');
      };

      if (delayMs > 0) {
        showToast(`Notification scheduled in ${delayMs / 1000}s...`);
        setTimeout(sendNotification, delayMs);
      } else {
        await sendNotification();
      }
    });
  };

  return (
    <div className="p-5 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Push Notifications</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Service Worker push & background alerts</p>
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

      {status === 'granted' ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => triggerLocalNotification('OmniSense Alert', 'Instant Push Notification delivered successfully!')}
              className="py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Send Instant Push
            </button>

            <button
              onClick={() => triggerLocalNotification('Scheduled Reminder', 'This alert was scheduled 3 seconds ago.', 3000)}
              className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              Schedule 3s Alert
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
          {status === 'denied' ? (
            <>
              <ShieldAlert className="w-8 h-8 text-rose-500 mx-auto" />
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Push notification permission is blocked. Enable notifications in browser settings to receive alerts.
              </p>
            </>
          ) : (
            <>
              <Bell className="w-8 h-8 text-indigo-500 mx-auto" />
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Request permission to dispatch Web Push and background system alerts.
              </p>
              <button
                onClick={() => triggerLocalNotification('OmniSense Welcome', 'Thanks for enabling push notifications!')}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-md active:scale-95 transition-transform"
              >
                Enable Push Notifications
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
