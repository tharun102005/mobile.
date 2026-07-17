import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth';
import { mockStore } from '../services/mockDataStore';
import { createAuditLog } from '../middleware/audit';

export interface AppSettings {
  siteName: string;
  maintenanceMode: boolean;
  allowPublicRegistration: boolean;
  maxUploadSizeMB: number;
  sessionTimeoutMinutes: number;
}

let currentSettings: AppSettings = {
  siteName: 'OmniSense Native PWA',
  maintenanceMode: false,
  allowPublicRegistration: true,
  maxUploadSizeMB: 25,
  sessionTimeoutMinutes: 60,
};

export const getAuditLogs = (req: AuthRequest, res: Response) => {
  const { search, page = '1', limit = '15' } = req.query;

  let filtered = [...mockStore.auditLogs];

  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(
      l => l.action.toLowerCase().includes(q) || l.adminEmail.toLowerCase().includes(q) || l.details.toLowerCase().includes(q)
    );
  }

  const pageNum = parseInt(String(page), 10) || 1;
  const limitNum = parseInt(String(limit), 10) || 15;
  const total = filtered.length;

  const paginated = filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  return res.json({
    logs: paginated,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
};

export const getErrorLogs = (_req: AuthRequest, res: Response) => {
  return res.json({ errorLogs: mockStore.errorLogs });
};

export const getSettings = (_req: AuthRequest, res: Response) => {
  return res.json({ settings: currentSettings });
};

export const updateSettings = (req: AuthRequest, res: Response) => {
  const { siteName, maintenanceMode, allowPublicRegistration, maxUploadSizeMB, sessionTimeoutMinutes } = req.body;

  currentSettings = {
    ...currentSettings,
    ...(siteName !== undefined && { siteName }),
    ...(maintenanceMode !== undefined && { maintenanceMode: Boolean(maintenanceMode) }),
    ...(allowPublicRegistration !== undefined && { allowPublicRegistration: Boolean(allowPublicRegistration) }),
    ...(maxUploadSizeMB !== undefined && { maxUploadSizeMB: Number(maxUploadSizeMB) }),
    ...(sessionTimeoutMinutes !== undefined && { sessionTimeoutMinutes: Number(sessionTimeoutMinutes) }),
  };

  createAuditLog(
    req,
    'SYSTEM_SETTINGS_UPDATE',
    'Global App Config',
    `Updated system settings: MaintenanceMode=${currentSettings.maintenanceMode}`
  );

  return res.json({ message: 'Settings updated successfully.', settings: currentSettings });
};
