import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth';
import { mockStore } from '../services/mockDataStore';
import type { MockAnnouncement } from '../services/mockDataStore';
import { createAuditLog } from '../middleware/audit';

export const getAnnouncements = (_req: AuthRequest, res: Response) => {
  return res.json({ announcements: mockStore.announcements });
};

export const createAnnouncement = (req: AuthRequest, res: Response) => {
  const { title, body, category = 'info', priority = 'medium', isPublished = true } = req.body;

  if (!title || !body) {
    return res.status(400).json({ error: 'Title and body are required.' });
  }

  const newAnnouncement: MockAnnouncement = {
    id: `anc_${Date.now()}`,
    title,
    body,
    category,
    priority,
    isPublished: Boolean(isPublished),
    createdAt: new Date().toISOString(),
    createdBy: req.user?.email || 'admin@omnisense.app',
  };

  mockStore.announcements.unshift(newAnnouncement);

  createAuditLog(
    req,
    'ANNOUNCEMENT_CREATE',
    `Announcement ${newAnnouncement.id}`,
    `Created announcement: "${title}"`
  );

  return res.json({ message: 'Announcement created successfully.', announcement: newAnnouncement });
};

export const deleteAnnouncement = (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const index = mockStore.announcements.findIndex(a => a.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Announcement not found.' });
  }

  const removed = mockStore.announcements.splice(index, 1)[0];

  createAuditLog(
    req,
    'ANNOUNCEMENT_DELETE',
    `Announcement ${id}`,
    `Deleted announcement: "${removed.title}"`
  );

  return res.json({ message: 'Announcement deleted.' });
};

export const getContacts = (_req: AuthRequest, res: Response) => {
  return res.json({ contacts: mockStore.contacts });
};

export const updateContactStatus = (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const contact = mockStore.contacts.find(c => c.id === id);
  if (!contact) {
    return res.status(404).json({ error: 'Contact ticket not found.' });
  }

  contact.status = status;
  return res.json({ message: 'Contact ticket status updated.', contact });
};
