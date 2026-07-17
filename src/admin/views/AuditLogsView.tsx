import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Search } from 'lucide-react';

interface AuditItem {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetResource: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export const AuditLogsView: React.FC = () => {
  const { token } = useAdminAuth();
  const [logs, setLogs] = useState<AuditItem[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchAuditLogs() {
      try {
        const res = await fetch(`/api/admin/system/audit-logs?search=${encodeURIComponent(search)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setLogs(data.logs || []);
        }
      } catch (err) {
        console.warn('Audit logs error', err);
      }
    }
    fetchAuditLogs();
  }, [search, token]);

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Security Audit Logs
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Encrypted immutable audit trail of all administrative actions and authentication events.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Filter audit logs by action or admin email..."
          className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Action Event</th>
                <th className="p-4">Admin Email</th>
                <th className="p-4">Target Resource</th>
                <th className="p-4">Details</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 font-mono text-[11px]">
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 font-sans text-slate-800 dark:text-slate-200">{log.adminEmail}</td>
                  <td className="p-4 text-purple-600 dark:text-purple-400">{log.targetResource}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 font-sans max-w-xs truncate">{log.details}</td>
                  <td className="p-4 text-slate-500">{log.ipAddress}</td>
                  <td className="p-4 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
