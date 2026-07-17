import { Router } from 'express';
import { adminLogin, getAdminProfile } from '../controllers/authController';
import { getUsers, toggleUserStatus, deleteUser, exportUsersCSV, exportUsersExcel } from '../controllers/userController';
import { getDashboardStats } from '../controllers/analyticsController';
import { getAnnouncements, createAnnouncement, deleteAnnouncement, getContacts, updateContactStatus } from '../controllers/contentController';
import { getAuditLogs, getErrorLogs, getSettings, updateSettings } from '../controllers/systemController';
import { verifyAdminToken } from '../middleware/auth';

const router = Router();

// Public Admin Auth Route
router.post('/auth/login', adminLogin);

// Protected Admin Routes (Requires valid JWT with role === 'admin')
router.use(verifyAdminToken);

router.get('/auth/me', getAdminProfile);
router.get('/dashboard/stats', getDashboardStats);

// User Management Routes
router.get('/users', getUsers);
router.patch('/users/:id/status', toggleUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/users/export/csv', exportUsersCSV);
router.get('/users/export/excel', exportUsersExcel);

// Content & Announcements Routes
router.get('/content/announcements', getAnnouncements);
router.post('/content/announcements', createAnnouncement);
router.delete('/content/announcements/:id', deleteAnnouncement);
router.get('/content/contacts', getContacts);
router.patch('/content/contacts/:id', updateContactStatus);

// System Logs & Settings Routes
router.get('/system/audit-logs', getAuditLogs);
router.get('/system/error-logs', getErrorLogs);
router.get('/system/settings', getSettings);
router.put('/system/settings', updateSettings);

export default router;
