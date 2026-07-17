import type { PermissionInfo } from '../types';

export const PERMISSIONS_METADATA: Record<string, PermissionInfo> = {
  camera: {
    id: 'camera',
    name: 'Camera',
    category: 'Media & Hardware',
    iconName: 'Camera',
    description: 'Access device video input for photo capture and filters.',
    whyNeeded: 'OmniSense uses your camera to let you take photos, apply real-time filter adjustments, and save snapshots locally in your session.',
    status: 'prompt',
    isRequired: false
  },
  microphone: {
    id: 'microphone',
    name: 'Microphone',
    category: 'Media & Hardware',
    iconName: 'Mic',
    description: 'Capture live audio streams and visualize sound waves.',
    whyNeeded: 'OmniSense uses your microphone to record audio clips, compute audio frequency waveforms via Web Audio API, and play back voice clips.',
    status: 'prompt',
    isRequired: false
  },
  geolocation: {
    id: 'geolocation',
    name: 'Geolocation (GPS)',
    category: 'Location Services',
    iconName: 'MapPin',
    description: 'Access high-accuracy spatial location and coordinates.',
    whyNeeded: 'OmniSense requires GPS access to calculate your exact latitude, longitude, altitude, speed, heading, and present a location radar.',
    status: 'prompt',
    isRequired: false
  },
  files: {
    id: 'files',
    name: 'File Manager',
    category: 'Storage & I/O',
    iconName: 'FolderUp',
    description: 'Import and export custom documents and binaries.',
    whyNeeded: 'OmniSense requests file access when you explicitly choose to upload external files or export generated app data to your device downloads.',
    status: 'prompt',
    isRequired: false
  },
  gallery: {
    id: 'gallery',
    name: 'Image Gallery',
    category: 'Media & Storage',
    iconName: 'Image',
    description: 'Select existing photos from your device photo library.',
    whyNeeded: 'OmniSense lets you pick photos from your photo library to edit, filter, or analyze within the application context.',
    status: 'prompt',
    isRequired: false
  },
  clipboard: {
    id: 'clipboard',
    name: 'Clipboard API',
    category: 'System Integration',
    iconName: 'Clipboard',
    description: 'Copy text and read copied content seamlessly.',
    whyNeeded: 'OmniSense uses clipboard permissions to copy generated share links or import text when you tap the paste action.',
    status: 'prompt',
    isRequired: false
  },
  notifications: {
    id: 'notifications',
    name: 'Push Notifications',
    category: 'Alerts & Messaging',
    iconName: 'Bell',
    description: 'Receive background notifications and interactive alerts.',
    whyNeeded: 'OmniSense uses notification permissions to send local alerts, reminders, and updates when background tasks complete.',
    status: 'prompt',
    isRequired: false
  },
  orientation: {
    id: 'orientation',
    name: 'Motion & Gyroscope',
    category: 'Device Sensors',
    iconName: 'Compass',
    description: 'Detect 3D spatial rotation, tilt angles, and acceleration.',
    whyNeeded: 'OmniSense uses motion sensors to drive the 3D leveler card, measure tilt angles (alpha, beta, gamma), and display live acceleration vectors.',
    status: 'prompt',
    isRequired: false
  },
  share: {
    id: 'share',
    name: 'Web Share API',
    category: 'System Integration',
    iconName: 'Share2',
    description: 'Trigger native OS share dialog for instant sharing.',
    whyNeeded: 'OmniSense uses the Web Share API to send links and media directly to your installed messaging or social apps.',
    status: 'prompt',
    isRequired: false
  },
  vibration: {
    id: 'vibration',
    name: 'Vibration Haptics',
    category: 'Tactile Feedback',
    iconName: 'Vibrate',
    description: 'Provide tactile haptic vibration responses on user tap.',
    whyNeeded: 'OmniSense uses vibration haptics to give tactile feedback when tapping buttons, toggling options, or triggering alerts.',
    status: 'prompt',
    isRequired: false
  }
};
