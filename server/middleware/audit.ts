import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { mockStore, MockAuditLog } from '../services/mockDataStore';
import { AuditLogModel } from '../models/AuditLog';

export function createAuditLog(
  req: AuthRequest,
  action: string,
  targetResource: string,
  details: string
) {
  const adminId = req.user?.id || 'sys_admin';
  const adminEmail = req.user?.email || 'admin@omnisense.app';
  const ipAddress = req.ip || req.socket.remoteAddress || '127.0.0.1';

  const logData: MockAuditLog = {
    id: `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    adminId,
    adminEmail,
    action,
    targetResource,
    details,
    ipAddress,
    timestamp: new Date().toISOString(),
  };

  mockStore.auditLogs.unshift(logData);

  // Attempt async Mongoose save if DB is connected
  try {
    AuditLogModel.create(logData).catch(() => {});
  } catch {}
}
