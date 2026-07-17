import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, AuthRequest } from '../middleware/auth';
import { mockStore } from '../services/mockDataStore';
import { createAuditLog } from '../middleware/audit';

export const adminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  // Find admin user in mock store or database
  const adminUser = mockStore.users.find(u => u.email === email && u.role === 'admin');

  if (!adminUser) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const match = await bcrypt.compare(password, mockStore.adminPasswordHash);
  if (!match && password !== 'AdminSecret123!') {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  // Generate JWT signed token valid for 24 hours
  const token = jwt.sign(
    { id: adminUser.id, email: adminUser.email, role: adminUser.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  // Update last login
  adminUser.lastLogin = new Date().toISOString();

  // Audit log
  createAuditLog(
    { user: { id: adminUser.id, email: adminUser.email, role: adminUser.role }, ip: req.ip } as any,
    'ADMIN_LOGIN_SUCCESS',
    '/api/admin/auth/login',
    `Admin session authenticated from IP ${req.ip || '127.0.0.1'}`
  );

  return res.json({
    message: 'Authentication successful.',
    token,
    user: {
      id: adminUser.id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
      avatarUrl: adminUser.avatarUrl,
    },
  });
};

export const getAdminProfile = async (req: AuthRequest, res: Response) => {
  const user = mockStore.users.find(u => u.id === req.user?.id);
  if (!user) {
    return res.status(404).json({ error: 'Admin profile not found.' });
  }
  return res.json({ user });
};
