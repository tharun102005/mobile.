export type PermissionStatusState = 'granted' | 'denied' | 'prompt' | 'unsupported';

export type PermissionId = 
  | 'camera'
  | 'microphone'
  | 'geolocation'
  | 'files'
  | 'gallery'
  | 'clipboard'
  | 'notifications'
  | 'orientation'
  | 'share'
  | 'vibration';

export interface PermissionInfo {
  id: PermissionId;
  name: string;
  category: string;
  iconName: string;
  description: string;
  whyNeeded: string;
  status: PermissionStatusState;
  isRequired: boolean;
}

export type TabType = 'dashboard' | 'features' | 'permissions' | 'settings';

export interface CapturedPhoto {
  id: string;
  dataUrl: string;
  timestamp: string;
  filter?: string;
}

export interface AudioRecording {
  id: string;
  blobUrl: string;
  durationSeconds: number;
  timestamp: string;
}

export interface GeoLocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  speed: number | null;
  heading: number | null;
  timestamp: number;
}

export interface DeviceMotionData {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
  accelX: number | null;
  accelY: number | null;
  accelZ: number | null;
}
