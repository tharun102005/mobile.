import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useHaptics } from '../../hooks/useHaptics';
import type { GeoLocationData } from '../../types';
import { MapPin, Navigation, Compass, ShieldAlert, RefreshCw } from 'lucide-react';

export const GeoFeature: React.FC = () => {
  const { permissions, requestPermission, showToast } = useApp();
  const { triggerHaptic } = useHaptics();

  const [location, setLocation] = useState<GeoLocationData | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const status = permissions.geolocation.status;

  const fetchGPSCoordinates = () => {
    if (!('geolocation' in navigator)) {
      showToast('Geolocation is not supported on this browser.');
      return;
    }

    setIsFetching(true);
    triggerHaptic('medium');

    navigator.geolocation.getCurrentPosition(
      pos => {
        setIsFetching(false);
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          altitude: pos.coords.altitude,
          speed: pos.coords.speed,
          heading: pos.coords.heading,
          timestamp: pos.timestamp,
        });
        triggerHaptic('success');
        showToast('GPS Coordinates updated!');
      },
      err => {
        setIsFetching(false);
        console.warn('GPS error:', err);
        triggerHaptic('error');
        showToast('Failed to fetch location coordinates.');
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const handleGeoRequest = () => {
    requestPermission('geolocation', () => {
      fetchGPSCoordinates();
    });
  };

  return (
    <div className="p-5 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">GPS Radar & Location</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Spatial telemetry & satellite position</p>
          </div>
        </div>

        <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
          status === 'granted'
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
            : status === 'denied'
            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
        }`}>
          {status}
        </span>
      </div>

      {status === 'granted' && location ? (
        <div className="space-y-4">
          {/* Radar Visual Sweep Card */}
          <div className="relative p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center overflow-hidden">
            {/* Pulsing Radar Rings */}
            <div className="absolute w-36 h-36 rounded-full border border-emerald-500/20 animate-ping" />
            <div className="absolute w-24 h-24 rounded-full border border-emerald-500/40" />
            <div className="absolute w-12 h-12 rounded-full border border-emerald-500/60" />
            
            <Navigation className="w-8 h-8 text-emerald-400 z-10 mb-2 transform rotate-45" />
            <div className="z-10 text-center">
              <div className="text-xs font-mono font-bold text-emerald-400">
                {location.latitude.toFixed(6)}°, {location.longitude.toFixed(6)}°
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Accuracy ±{location.accuracy.toFixed(1)}m
              </div>
            </div>
          </div>

          {/* Grid Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Altitude</span>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                {location.altitude ? `${location.altitude.toFixed(1)} m` : 'N/A (Sea level)'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Speed & Bearing</span>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                {location.speed ? `${(location.speed * 3.6).toFixed(1)} km/h` : 'Stationary'}
              </p>
            </div>
          </div>

          <button
            onClick={fetchGPSCoordinates}
            disabled={isFetching}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh GPS Position
          </button>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
          {status === 'denied' ? (
            <>
              <ShieldAlert className="w-8 h-8 text-rose-500 mx-auto" />
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Location permissions are blocked in browser settings. Enable location services to view coordinates.
              </p>
            </>
          ) : (
            <>
              <Compass className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Request GPS access to pinpoint your latitude, longitude, altitude, and velocity.
              </p>
              <button
                onClick={handleGeoRequest}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow-md active:scale-95 transition-transform"
              >
                Fetch GPS Location
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
