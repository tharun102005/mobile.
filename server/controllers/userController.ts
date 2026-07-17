import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth';
import { mockStore } from '../services/mockDataStore';
import { createAuditLog } from '../middleware/audit';
import * as XLSX from 'xlsx';

export const getUsers = (req: AuthRequest, res: Response) => {
  let { search, status, role, page = '1', limit = '10' } = req.query;

  let filtered = [...mockStore.users];

  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(
      u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q)
    );
  }

  if (status && status !== 'all') {
    filtered = filtered.filter(u => u.status === status);
  }

  if (role && role !== 'all') {
    filtered = filtered.filter(u => u.role === role);
  }

  const pageNum = parseInt(String(page), 10) || 1;
  const limitNum = parseInt(String(limit), 10) || 10;
  const total = filtered.length;
  const totalPages = Math.ceil(total / limitNum);

  const startIndex = (pageNum - 1) * limitNum;
  const paginatedUsers = filtered.slice(startIndex, startIndex + limitNum);

  return res.json({
    users: paginatedUsers,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
    },
  });
};

export const toggleUserStatus = (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (status !== 'active' && status !== 'suspended') {
    return res.status(400).json({ error: 'Status must be active or suspended.' });
  }

  const user = mockStore.users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (user.role === 'admin' && status === 'suspended') {
    return res.status(403).json({ error: 'Cannot suspend primary admin account.' });
  }

  user.status = status;

  createAuditLog(
    req,
    'USER_STATUS_UPDATE',
    `User ${user.email} (${user.id})`,
    `Status changed to ${status}`
  );

  return res.json({ message: `User status updated to ${status}.`, user });
};

export const deleteUser = (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const index = mockStore.users.findIndex(u => u.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const user = mockStore.users[index];
  if (user.role === 'admin') {
    return res.status(403).json({ error: 'Cannot delete primary admin account.' });
  }

  mockStore.users.splice(index, 1);

  createAuditLog(
    req,
    'USER_DELETE',
    `User ${user.email} (${user.id})`,
    `Deleted user record permanently.`
  );

  return res.json({ message: 'User deleted successfully.' });
};

export const exportUsersCSV = (_req: AuthRequest, res: Response) => {
  const headers = ['ID,Name,Email,Phone,Role,Status,Last Login,Registered At,Device Info'];
  const rows = mockStore.users.map(u =>
    `"${u.id}","${u.name}","${u.email}","${u.phone}","${u.role}","${u.status}","${u.lastLogin}","${u.registeredAt}","${u.deviceInfo}"`
  );

  const csvContent = [headers.join('\n'), ...rows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="omnisense-users-export.csv"');
  return res.send(csvContent);
};

export const exportUsersExcel = (_req: AuthRequest, res: Response) => {
  const worksheetData = mockStore.users.map(u => ({
    'User ID': u.id,
    'Full Name': u.name,
    'Email Address': u.email,
    'Phone Number': u.phone,
    Role: u.role,
    Status: u.status,
    'Last Login': u.lastLogin,
    'Registered At': u.registeredAt,
    'Device Info': u.deviceInfo,
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="omnisense-users-export.xlsx"');
  return res.send(buffer);
};
