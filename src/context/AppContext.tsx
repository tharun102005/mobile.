import React, { createContext, useContext, useState, useEffect } from 'react';
import type { PermissionId, PermissionInfo, PermissionStatusState, TabType } from '../types';
import { PERMISSIONS_METADATA } from '../utils/permissionData';
import { useHaptics } from '../hooks/useHaptics';

interface AppContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  permissions: Record<PermissionId, PermissionInfo>;
  pendingPermissionId: PermissionId | null;
  requestPermission: (id: PermissionId, onSuccess?: () => void) => void;
  confirmPreConsentPermission: () => Promise<void>;
  cancelPreConsentPermission: () => void;
  resetPermissionState: (id: PermissionId) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [permissions, setPermissions] = useState<Record<PermissionId, PermissionInfo>>(PERMISSIONS_METADATA);
  const [pendingPermissionId, setPendingPermissionId] = useState<PermissionId | null>(null);
  const [pendingOnSuccess, setPendingOnSuccess] = useState<(() => void) | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { triggerHaptic } = useHaptics();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3200);
  };

  // Check permission states on load where navigator.permissions is available
  useEffect(() => {
    async function checkExistingPermissions() {
      if (typeof window === 'undefined' || !navigator.permissions) return;

      const newPerms = { ...permissions };

      // Query standard browser permissions
      const checkNameMap: Partial<Record<PermissionId, PermissionName>> = {
        camera: 'camera' as PermissionName,
        microphone: 'microphone' as PermissionName,
        geolocation: 'geolocation' as PermissionName,
        notifications: 'notifications' as PermissionName,
        clipboard: 'clipboard-read' as PermissionName,
      };

      for (const [id, name] of Object.entries(checkNameMap)) {
        try {
          const res = await navigator.permissions.query({ name });
          newPerms[id as PermissionId] = {
            ...newPerms[id as PermissionId],
            status: res.state as PermissionStatusState,
          };
          res.onchange = () => {
            setPermissions(prev => ({
              ...prev,
              [id as PermissionId]: {
                ...prev[id as PermissionId],
                status: res.state as PermissionStatusState,
              },
            }));
          };
        } catch {
          // Ignore permissions query failures for unsupported names
        }
      }

      // Check unsupported features
      if (!('vibrate' in navigator)) {
        newPerms.vibration.status = 'unsupported';
      }
      if (!('share' in navigator)) {
        newPerms.share.status = 'unsupported';
      }
      if (!('DeviceOrientationEvent' in window)) {
        newPerms.orientation.status = 'unsupported';
      }

      setPermissions(newPerms);
    }

    checkExistingPermissions();
  }, []);

  const requestPermission = (id: PermissionId, onSuccess?: () => void) => {
    triggerHaptic('light');
    const perm = permissions[id];

    if (perm.status === 'unsupported') {
      showToast(`${perm.name} is not supported on this browser/device.`);
      return;
    }

    if (perm.status === 'granted') {
      if (onSuccess) onSuccess();
      return;
    }

    // Open Pre-Consent Explanation Modal first!
    setPendingPermissionId(id);
    if (onSuccess) {
      setPendingOnSuccess(() => onSuccess);
    } else {
      setPendingOnSuccess(null);
    }
  };

  const confirmPreConsentPermission = async () => {
    if (!pendingPermissionId) return;
    const id = pendingPermissionId;
    const onSuccess = pendingOnSuccess;

    setPendingPermissionId(null);
    setPendingOnSuccess(null);

    // Call actual native browser permission API
    try {
      let granted = false;

      switch (id) {
        case 'camera': {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach(track => track.stop());
          granted = true;
          break;
        }
        case 'microphone': {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(track => track.stop());
          granted = true;
          break;
        }
        case 'geolocation': {
          await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
          });
          granted = true;
          break;
        }
        case 'notifications': {
          const res = await Notification.requestPermission();
          granted = res === 'granted';
          break;
        }
        case 'orientation': {
          if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            const state = await (DeviceOrientationEvent as any).requestPermission();
            granted = state === 'granted';
          } else {
            granted = true; // Auto granted if event is available
          }
          break;
        }
        case 'clipboard': {
          await navigator.clipboard.readText();
          granted = true;
          break;
        }
        case 'files':
        case 'gallery':
        case 'share':
        case 'vibration': {
          // Action-driven permissions (always granted when user initiates action)
          granted = true;
          break;
        }
      }

      setPermissions(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          status: granted ? 'granted' : 'denied',
        },
      }));

      if (granted) {
        triggerHaptic('success');
        showToast(`Permission granted for ${permissions[id].name}`);
        if (onSuccess) onSuccess();
      } else {
        triggerHaptic('warning');
        showToast(`Permission denied for ${permissions[id].name}`);
      }
    } catch (err: any) {
      console.warn('Native permission error:', err);
      setPermissions(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          status: 'denied',
        },
      }));
      triggerHaptic('error');
      showToast(`Access to ${permissions[id].name} was not granted.`);
    }
  };

  const cancelPreConsentPermission = () => {
    triggerHaptic('light');
    setPendingPermissionId(null);
    setPendingOnSuccess(null);
    showToast('Permission request cancelled.');
  };

  const resetPermissionState = (id: PermissionId) => {
    setPermissions(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        status: 'prompt',
      },
    }));
    showToast(`Reset status for ${permissions[id].name}`);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        permissions,
        pendingPermissionId,
        requestPermission,
        confirmPreConsentPermission,
        cancelPreConsentPermission,
        resetPermissionState,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
