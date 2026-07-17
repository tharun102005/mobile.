import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Settings, CheckCircle } from 'lucide-react';

export const SystemLogsView: React.FC = () => {
  const { token } = useAdminAuth();
  const [errorLogs, setErrorLogs] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({
    siteName: 'OmniSense Native PWA',
    maintenanceMode: false,
    allowPublicRegistration: true,
    maxUploadSizeMB: 25,
    sessionTimeoutMinutes: 60,
  });
  const [savedMsg, setSavedMsg] = useState(false);

  const fetchLogsAndSettings = async () => {
    try {
      const [resLogs, resSet] = await Promise.all([
        fetch('/api/admin/system/error-logs', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/system/settings', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (resLogs.ok) {
        const data = await resLogs.json();
        setErrorLogs(data.errorLogs || []);
      }
      if (resSet.ok) {
        const data = await resSet.json();
        setSettings(data.settings);
      }
    } catch (err) {
      console.warn('System fetch error', err);
    }
  };

  useEffect(() => {
    fetchLogsAndSettings();
  }, [token]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/system/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSavedMsg(true);
        setTimeout(() => setSavedMsg(false), 3000);
      }
    } catch (err) {
      console.warn('Save settings error', err);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          System Error Logs & Config
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Monitor application stack traces and configure global system flags.
        </p>
      </div>

      {/* Global Config Form */}
      <form onSubmit={handleSaveSettings} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
            <Settings className="w-5 h-5 text-indigo-500" />
            <span>Global App Configuration</span>
          </div>
          {savedMsg && (
            <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Config saved!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Application Title</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={e => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Max Upload Size (MB)</label>
            <input
              type="number"
              value={settings.maxUploadSizeMB}
              onChange={e => setSettings({ ...settings, maxUploadSizeMB: Number(e.target.value) })}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="maint"
              checked={settings.maintenanceMode}
              onChange={e => setSettings({ ...settings, maintenanceMode: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded"
            />
            <label htmlFor="maint" className="font-semibold text-slate-700 dark:text-slate-300">
              Enable Maintenance Mode
            </label>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="reg"
              checked={settings.allowPublicRegistration}
              onChange={e => setSettings({ ...settings, allowPublicRegistration: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded"
            />
            <label htmlFor="reg" className="font-semibold text-slate-700 dark:text-slate-300">
              Allow Public Registration
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
        >
          Save Configuration Changes
        </button>
      </form>

      {/* Error Logs List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Error Stack Traces</h3>
        <div className="space-y-3">
          {errorLogs.map(err => (
            <div key={err.id} className="p-4 rounded-2xl bg-slate-950 text-white border border-slate-800 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {err.level}
                </span>
                <span className="text-[10px] text-slate-400">{new Date(err.timestamp).toLocaleString()}</span>
              </div>
              <p className="font-bold text-rose-300">{err.message}</p>
              <pre className="p-3 rounded-xl bg-slate-900 text-[10px] text-slate-400 overflow-x-auto whitespace-pre-wrap">
                {err.stackTrace}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
