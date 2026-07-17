import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { mockStore } from '../services/mockDataStore';

export const getDashboardStats = (req: AuthRequest, res: Response) => {
  const totalUsers = mockStore.users.length;
  const activeUsers = mockStore.users.filter(u => u.status === 'active').length;
  const suspendedUsers = mockStore.users.filter(u => u.status === 'suspended').length;
  const totalAuditLogs = mockStore.auditLogs.length;
  const totalAnnouncements = mockStore.announcements.length;
  const unreadContacts = mockStore.contacts.filter(c => c.status === 'unread').length;
  const errorLogsCount = mockStore.errorLogs.length;

  // Analytics Trends (Daily, Weekly, Monthly)
  const dailyMetrics = [
    { day: 'Mon', logins: 140, newUsers: 12, apiCalls: 890 },
    { day: 'Tue', logins: 210, newUsers: 19, apiCalls: 1240 },
    { day: 'Wed', logins: 340, newUsers: 28, apiCalls: 2100 },
    { day: 'Thu', logins: 290, newUsers: 22, apiCalls: 1850 },
    { day: 'Fri', logins: 450, newUsers: 35, apiCalls: 3100 },
    { day: 'Sat', logins: 380, newUsers: 30, apiCalls: 2600 },
    { day: 'Sun', logins: 520, newUsers: 42, apiCalls: 3800 },
  ];

  const weeklyMetrics = [
    { week: 'Week 1', logins: 1200, newUsers: 95 },
    { week: 'Week 2', logins: 1850, newUsers: 140 },
    { week: 'Week 3', logins: 2400, newUsers: 210 },
    { week: 'Week 4', logins: 3100, newUsers: 285 },
  ];

  const monthlyMetrics = [
    { month: 'Jan', activeUsers: 450 },
    { month: 'Feb', activeUsers: 780 },
    { month: 'Mar', activeUsers: 1240 },
    { month: 'Apr', activeUsers: 1890 },
    { month: 'May', activeUsers: 2600 },
    { month: 'Jun', activeUsers: 3450 },
  ];

  return res.json({
    kpi: {
      totalUsers,
      activeUsers,
      suspendedUsers,
      totalAuditLogs,
      totalAnnouncements,
      unreadContacts,
      errorLogsCount,
    },
    analytics: {
      daily: dailyMetrics,
      weekly: weeklyMetrics,
      monthly: monthlyMetrics,
    },
  });
};
