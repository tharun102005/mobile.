import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Search, Filter, UserCheck, UserX, Trash2, ShieldAlert, ChevronLeft, ChevronRight, FileSpreadsheet, FileText } from 'lucide-react';

interface UserItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'user';
  status: 'active' | 'suspended';
  avatarUrl?: string;
  lastLogin: string;
  registeredAt: string;
  deviceInfo: string;
}

export const UserManagementView: React.FC = () => {
  const { token } = useAdminAuth();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsersCount, setTotalUsersCount] = useState(0);

  // Modal confirm states
  const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);

  const fetchUsers = async () => {
    try {
      const query = new URLSearchParams({
        search,
        status: statusFilter,
        page: String(page),
        limit: '6',
      });
      const res = await fetch(`/api/admin/users?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalUsersCount(data.pagination?.total || 0);
      }
    } catch (err) {
      console.warn('Fetch users error', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, statusFilter, page, token]);

  const handleToggleStatus = async (user: UserItem) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      const res = await fetch(`/api/admin/users/${user.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (err) {
      console.warn('Update status error', err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    try {
      const res = await fetch(`/api/admin/users/${userToDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setUserToDelete(null);
        fetchUsers();
      }
    } catch (err) {
      console.warn('Delete error', err);
    }
  };

  const exportCSV = () => {
    window.open(`/api/admin/users/export/csv`, '_blank');
  };

  const exportExcel = () => {
    window.open(`/api/admin/users/export/excel`, '_blank');
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            User Account Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            View, search, suspend, or export registered application users.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-500" />
            CSV Export
          </button>
          <button
            onClick={exportExcel}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Excel (.xlsx) Export
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, email, or phone number..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value as any); setPage(1); }}
            className="py-2 px-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="suspended">Suspended Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Login</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {u.avatarUrl ? (
                        <img src={u.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-500 font-bold flex items-center justify-center shrink-0">
                          {u.name[0]}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white leading-snug">{u.name}</p>
                        <p className="text-[10px] text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400 font-mono">{u.phone}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      u.role === 'admin' ? 'bg-purple-500/10 text-purple-600 border border-purple-500/20' : 'bg-slate-500/10 text-slate-500'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      u.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 text-[11px]">
                    {new Date(u.lastLogin).toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          u.status === 'active'
                            ? 'text-amber-500 hover:bg-amber-500/10'
                            : 'text-emerald-500 hover:bg-emerald-500/10'
                        }`}
                        title={u.status === 'active' ? 'Suspend Account' : 'Activate Account'}
                      >
                        {u.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>

                      {u.role !== 'admin' && (
                        <button
                          onClick={() => setUserToDelete(u)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {users.length} of {totalUsersCount} users</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete User Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-slide-up">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 text-white">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold">Confirm User Deletion</h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to permanently delete <strong className="text-white">{userToDelete.name}</strong> ({userToDelete.email})? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 font-semibold text-xs text-white"
              >
                Delete Account
              </button>
              <button
                onClick={() => setUserToDelete(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
