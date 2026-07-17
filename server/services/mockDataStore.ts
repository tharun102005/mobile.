import bcrypt from 'bcryptjs';

export interface MockUser {
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

export interface MockAuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetResource: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface MockAnnouncement {
  id: string;
  title: string;
  body: string;
  category: 'info' | 'warning' | 'feature' | 'maintenance';
  priority: 'low' | 'medium' | 'high';
  isPublished: boolean;
  createdAt: string;
  createdBy: string;
}

export interface MockContact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'resolved';
  submittedAt: string;
}

export interface MockErrorLog {
  id: string;
  level: 'error' | 'warn' | 'fatal';
  message: string;
  stackTrace: string;
  source: string;
  timestamp: string;
}

class MockDataStore {
  public users: MockUser[] = [];
  public auditLogs: MockAuditLog[] = [];
  public announcements: MockAnnouncement[] = [];
  public contacts: MockContact[] = [];
  public errorLogs: MockErrorLog[] = [];
  public adminPasswordHash: string = '';

  constructor() {
    this.init();
  }

  private init() {
    this.adminPasswordHash = bcrypt.hashSync('AdminSecret123!', 10);

    // Initial Seed Users
    this.users = [
      {
        id: 'usr_admin_1',
        name: 'System Admin',
        email: 'admin@omnisense.app',
        phone: '+1 (555) 019-2831',
        role: 'admin',
        status: 'active',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        lastLogin: new Date().toISOString(),
        registeredAt: new Date(Date.now() - 30 * 86400000).toISOString(),
        deviceInfo: 'Chrome / macOS Ventura 13.4',
      },
      {
        id: 'usr_2',
        name: 'Sarah Connor',
        email: 'sarah.c@cyberdyne.io',
        phone: '+1 (555) 234-5678',
        role: 'user',
        status: 'active',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        lastLogin: new Date(Date.now() - 2 * 3600000).toISOString(),
        registeredAt: new Date(Date.now() - 14 * 86400000).toISOString(),
        deviceInfo: 'OmniSense iOS Native PWA / iPhone 14 Pro',
      },
      {
        id: 'usr_3',
        name: 'Marcus Vance',
        email: 'marcus.v@techflow.dev',
        phone: '+1 (555) 876-5432',
        role: 'user',
        status: 'suspended',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        lastLogin: new Date(Date.now() - 72 * 3600000).toISOString(),
        registeredAt: new Date(Date.now() - 20 * 86400000).toISOString(),
        deviceInfo: 'Android Chrome / Pixel 7',
      },
      {
        id: 'usr_4',
        name: 'Elena Rostova',
        email: 'elena.rostova@designhub.com',
        phone: '+1 (555) 432-1098',
        role: 'user',
        status: 'active',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
        lastLogin: new Date(Date.now() - 12 * 3600000).toISOString(),
        registeredAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        deviceInfo: 'Safari / iPad Air',
      },
      {
        id: 'usr_5',
        name: 'David Kim',
        email: 'david.kim@nexuslabs.co',
        phone: '+1 (555) 987-6543',
        role: 'user',
        status: 'active',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        lastLogin: new Date(Date.now() - 1 * 3600000).toISOString(),
        registeredAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        deviceInfo: 'Edge / Windows 11',
      },
    ];

    // Seed Audit Logs
    this.auditLogs = [
      {
        id: 'log_1',
        adminId: 'usr_admin_1',
        adminEmail: 'admin@omnisense.app',
        action: 'ADMIN_LOGIN_SUCCESS',
        targetResource: '/api/admin/auth/login',
        details: 'Admin authenticated successfully with MFA bypass token.',
        ipAddress: '127.0.0.1',
        timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
      },
      {
        id: 'log_2',
        adminId: 'usr_admin_1',
        adminEmail: 'admin@omnisense.app',
        action: 'USER_STATUS_CHANGE',
        targetResource: 'usr_3 (Marcus Vance)',
        details: 'Suspended user account due to failed login attempts threshold.',
        ipAddress: '127.0.0.1',
        timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
      },
      {
        id: 'log_3',
        adminId: 'usr_admin_1',
        adminEmail: 'admin@omnisense.app',
        action: 'CONTENT_ANNOUNCEMENT_CREATE',
        targetResource: 'PWA Welcome Banner',
        details: 'Published new feature update notice to PWA client dashboard.',
        ipAddress: '127.0.0.1',
        timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
      },
    ];

    // Seed Announcements
    this.announcements = [
      {
        id: 'anc_1',
        title: 'OmniSense Native PWA v2.0 Live',
        body: 'Full support for 10 hardware features including 3D Motion Sensors and Web Audio Visualizers.',
        category: 'feature',
        priority: 'high',
        isPublished: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        createdBy: 'admin@omnisense.app',
      },
      {
        id: 'anc_2',
        title: 'Scheduled System Maintenance',
        body: 'Brief 5-minute maintenance window scheduled for DB index optimizations.',
        category: 'maintenance',
        priority: 'medium',
        isPublished: false,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        createdBy: 'admin@omnisense.app',
      },
    ];

    // Seed Contact Tickets
    this.contacts = [
      {
        id: 'cnt_1',
        name: 'Alex Rivera',
        email: 'alex.r@developer.org',
        subject: 'Camera Permission Query',
        message: 'Does the pre-consent modal work on iOS Safari standalone mode?',
        status: 'unread',
        submittedAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'cnt_2',
        name: 'Jessica Alba',
        email: 'jessica@studio.io',
        subject: 'Export feature feedback',
        message: 'Can we add XLSX export format alongside CSV?',
        status: 'read',
        submittedAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    // Seed Error Logs
    this.errorLogs = [
      {
        id: 'err_1',
        level: 'warn',
        message: 'DeviceOrientationEvent permission denied on iOS 16.5 viewport',
        stackTrace: 'Error: User denied orientation permission gesture\n    at MotionFeature.tsx:42',
        source: 'Client PWA / MotionFeature',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        id: 'err_2',
        level: 'error',
        message: 'WebPush registration missing GCM sender ID key',
        stackTrace: 'DOMException: Failed to execute subscribe on PushManager\n    at PushFeature.tsx:28',
        source: 'Client PWA / ServiceWorker',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
    ];
  }
}

export const mockStore = new MockDataStore();
