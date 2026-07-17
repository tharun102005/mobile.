import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import type { DeviceMotionData } from '../../types';
import { Compass, RotateCw, Activity } from 'lucide-react';

export const MotionFeature: React.FC = () => {
  const { permissions, requestPermission, showToast } = useApp();

  const [motion, setMotion] = useState<DeviceMotionData>({
    alpha: 0,
    beta: 0,
    gamma: 0,
    accelX: 0,
    accelY: 0,
    accelZ: 0,
  });
  const [isActive, setIsActive] = useState(false);

  const status = permissions.orientation.status;

  const startSensors = () => {
    setIsActive(true);

    const handleOrientation = (e: DeviceOrientationEvent) => {
      setMotion(prev => ({
        ...prev,
        alpha: e.alpha ? Math.round(e.alpha) : 0,
        beta: e.beta ? Math.round(e.beta) : 0,
        gamma: e.gamma ? Math.round(e.gamma) : 0,
      }));
    };

    const handleMotion = (e: DeviceMotionEvent) => {
      if (e.accelerationIncludingGravity) {
        setMotion(prev => ({
          ...prev,
          accelX: e.accelerationIncludingGravity?.x ? Number(e.accelerationIncludingGravity.x.toFixed(1)) : 0,
          accelY: e.accelerationIncludingGravity?.y ? Number(e.accelerationIncludingGravity.y.toFixed(1)) : 0,
          accelZ: e.accelerationIncludingGravity?.z ? Number(e.accelerationIncludingGravity.z.toFixed(1)) : 0,
        }));
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    window.addEventListener('devicemotion', handleMotion);

    showToast('Motion & orientation sensors active!');

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('devicemotion', handleMotion);
    };
  };

  const handleSensorRequest = () => {
    requestPermission('orientation', () => {
      startSensors();
    });
  };

  useEffect(() => {
    if (status === 'granted') {
      const cleanup = startSensors();
      return cleanup;
    }
  }, [status]);

  // Derive tilt transform for 3D card
  const tiltBeta = Math.max(-45, Math.min(45, motion.beta || 0));
  const tiltGamma = Math.max(-45, Math.min(45, motion.gamma || 0));

  return (
    <div className="p-5 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Motion & 3D Gyroscope</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">3D spatial leveler & accelerometer</p>
          </div>
        </div>

        <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
          status === 'granted'
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
            : status === 'unsupported'
            ? 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20'
            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
        }`}>
          {status}
        </span>
      </div>

      {status === 'granted' || isActive ? (
        <div className="space-y-4">
          {/* Interactive 3D Tilting Leveler Card */}
          <div className="perspective-1000 flex items-center justify-center py-6">
            <div
              className="w-full max-w-xs p-6 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-600 to-yellow-500 text-white shadow-xl transition-transform duration-100 ease-out flex flex-col items-center justify-center space-y-3"
              style={{
                transform: `rotateX(${tiltBeta}deg) rotateY(${tiltGamma}deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Bubble Level Marker */}
              <div className="w-16 h-16 rounded-full border-2 border-white/40 flex items-center justify-center relative">
                <div
                  className="w-5 h-5 rounded-full bg-white shadow-md transition-all duration-75"
                  style={{
                    transform: `translate(${tiltGamma * 0.8}px, ${tiltBeta * 0.8}px)`,
                  }}
                />
              </div>

              <div className="text-center">
                <span className="text-[10px] uppercase font-bold tracking-wider text-orange-200">
                  Bubble Level Indicator
                </span>
                <p className="font-mono text-xs font-bold mt-0.5">
                  X: {motion.gamma}° | Y: {motion.beta}° | Z: {motion.alpha}°
                </p>
              </div>
            </div>
          </div>

          {/* Acceleration Telemetry */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase">Accel X</span>
              <p className="font-mono font-bold text-slate-800 dark:text-slate-100 mt-0.5">{motion.accelX} m/s²</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase">Accel Y</span>
              <p className="font-mono font-bold text-slate-800 dark:text-slate-100 mt-0.5">{motion.accelY} m/s²</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase">Accel Z</span>
              <p className="font-mono font-bold text-slate-800 dark:text-slate-100 mt-0.5">{motion.accelZ} m/s²</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
          {status === 'unsupported' ? (
            <>
              <Activity className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Device orientation sensors are not available on this desktop browser. Try opening on a mobile smartphone device!
              </p>
            </>
          ) : (
            <>
              <RotateCw className="w-8 h-8 text-orange-500 mx-auto" />
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Grant permission to access 3D gyroscope orientation and acceleration vectors.
              </p>
              <button
                onClick={handleSensorRequest}
                className="px-4 py-2 rounded-xl bg-orange-600 text-white font-semibold text-xs shadow-md active:scale-95 transition-transform"
              >
                Enable Motion Sensors
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
