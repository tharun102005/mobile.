import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Megaphone, Plus, Trash2 } from 'lucide-react';

export const ContentManagerView: React.FC = () => {
  const { token } = useAdminAuth();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<'info' | 'warning' | 'feature' | 'maintenance'>('feature');

  const fetchData = async () => {
    try {
      const resAnc = await fetch('/api/admin/content/announcements', { headers: { Authorization: `Bearer ${token}` } });
      if (resAnc.ok) {
        const data = await resAnc.json();
        setAnnouncements(data.announcements || []);
      }
    } catch (err) {
      console.warn('Content fetch error', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) return;
    try {
      const res = await fetch('/api/admin/content/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, body, category }),
      });
      if (res.ok) {
        setTitle('');
        setBody('');
        fetchData();
      }
    } catch (err) {
      console.warn('Create error', err);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/content/announcements/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.warn('Delete error', err);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Content & Announcements Manager
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Publish application-wide feature notices and review contact form tickets.
        </p>
      </div>

      {/* Announcement Publisher Form */}
      <form onSubmit={handleCreateAnnouncement} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
          <Megaphone className="w-5 h-5 text-indigo-500" />
          <span>Publish New Announcement Notice</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Announcement Title..."
            required
            className="sm:col-span-2 p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <select
            value={category}
            onChange={e => setCategory(e.target.value as any)}
            className="p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="feature">Feature Update</option>
            <option value="info">General Info</option>
            <option value="warning">Alert Warning</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Announcement details body..."
          rows={3}
          required
          className="w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Publish Announcement
        </button>
      </form>

      {/* Announcements List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Published Notices</h3>
        <div className="space-y-3">
          {announcements.map(anc => (
            <div key={anc.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-500/10 text-indigo-500">
                    {anc.category}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{anc.title}</h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{anc.body}</p>
                <p className="text-[10px] text-slate-400 mt-2">By {anc.createdBy} • {new Date(anc.createdAt).toLocaleDateString()}</p>
              </div>

              <button
                onClick={() => handleDeleteAnnouncement(anc.id)}
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                title="Delete Announcement"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
