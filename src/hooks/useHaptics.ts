import { useCallback } from 'react';

export type HapticPreset = 
  | 'light' 
  | 'medium' 
  | 'heavy' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'selection';

export function useHaptics() {
  const isSupported = typeof window !== 'undefined' && 'vibrate' in navigator;

  const triggerHaptic = useCallback((presetOrPattern: HapticPreset | number | number[]) => {
    if (!isSupported) return false;

    try {
      if (typeof presetOrPattern === 'number' || Array.isArray(presetOrPattern)) {
        return navigator.vibrate(presetOrPattern);
      }

      switch (presetOrPattern) {
        case 'light':
        case 'selection':
          return navigator.vibrate(10);
        case 'medium':
          return navigator.vibrate(25);
        case 'heavy':
          return navigator.vibrate(50);
        case 'success':
          return navigator.vibrate([15, 30, 25]);
        case 'warning':
          return navigator.vibrate([30, 50, 30]);
        case 'error':
          return navigator.vibrate([50, 40, 50, 40, 50]);
        default:
          return navigator.vibrate(15);
      }
    } catch (e) {
      console.warn('Vibration failed', e);
      return false;
    }
  }, [isSupported]);

  return { isSupported, triggerHaptic };
}
