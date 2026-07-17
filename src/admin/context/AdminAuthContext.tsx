import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

interface AdminAuthContextType {
  token: string | null;
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  loginAdmin: (token: string, user: AdminUser) => void;
  logoutAdmin: () => void;
  activeAdminTab: 'dashboard' | 'users' | 'audit' | 'content' | 'logs' | 'settings';
  setActiveAdminTab: (tab: 'dashboard' | 'users' | 'audit' | 'content' | 'logs' | 'settings') => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('omnisense_admin_token'));
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = sessionStorage.getItem('omnisense_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard' | 'users' | 'audit' | 'content' | 'logs' | 'settings'>('dashboard');

  useEffect(() => {
    if (token && adminUser) {
      sessionStorage.setItem('omnisense_admin_token', token);
      sessionStorage.setItem('omnisense_admin_user', JSON.stringify(adminUser));
    } else {
      sessionStorage.removeItem('omnisense_admin_token');
      sessionStorage.removeItem('omnisense_admin_user');
    }
  }, [token, adminUser]);

  const loginAdmin = (newToken: string, user: AdminUser) => {
    setToken(newToken);
    setAdminUser(user);
  };

  const logoutAdmin = () => {
    setToken(null);
    setAdminUser(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        token,
        adminUser,
        isAuthenticated: Boolean(token && adminUser),
        loginAdmin,
        logoutAdmin,
        activeAdminTab,
        setActiveAdminTab,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};
