import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useHaptics } from '../../hooks/useHaptics';
import { Camera, SwitchCamera, Sparkles, Download, Trash2, ShieldAlert } from 'lucide-react';

export const CameraFeature: React.FC = () => {
  const { permissions, requestPermission, showToast } = useApp();
  const { triggerHaptic } = useHaptics();

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [filter, setFilter] = useState<string>('none');
  const [capturedPhotos, setCapturedPhotos] = useState<Array<{ id: string; url: string; filter: string }>>([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const status = permissions.camera.status;

  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn('Camera stream error:', err);
      showToast('Could not access camera feed.');
    }
  };

  useEffect(() => {
    if (status === 'granted') {
      startCamera();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [status, facingMode]);

  const handleOpenCam = () => {
    requestPermission('camera', () => {
      startCamera();
    });
  };

  const handleSwitchFacing = () => {
    triggerHaptic('selection');
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  };

  const takeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    triggerHaptic('heavy');

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Apply filter to canvas context before drawing
    ctx.filter = filter === 'none' ? 'none' : getCanvasFilterCSS(filter);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/png');
    setCapturedPhotos(prev => [
      { id: Date.now().toString(), url: dataUrl, filter },
      ...prev
    ]);
    showToast('Photo captured to session gallery!');
  };

  const getCanvasFilterCSS = (f: string) => {
    switch (f) {
      case 'grayscale': return 'grayscale(100%)';
      case 'sepia': return 'sepia(100%)';
      case 'invert': return 'invert(100%)';
      case 'vivid': return 'saturate(200%) contrast(120%)';
      default: return 'none';
    }
  };

  return (
    <div className="p-5 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Camera Studio</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Real-time video stream & snapshot filters</p>
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

      {/* Main Viewport */}
      {status === 'granted' ? (
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl bg-slate-950 aspect-video flex items-center justify-center border border-slate-800">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transition-all"
              style={{ filter: getCanvasFilterCSS(filter) }}
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Overlaid Controls */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                onClick={handleSwitchFacing}
                className="p-2 rounded-xl bg-slate-900/70 text-white backdrop-blur-md hover:bg-slate-900 active:scale-95 transition-transform"
                title="Switch Camera (Front/Back)"
              >
                <SwitchCamera className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Preset Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            {['none', 'vivid', 'grayscale', 'sepia', 'invert'].map(f => (
              <button
                key={f}
                onClick={() => { triggerHaptic('light'); setFilter(f); }}
                className={`px-3 py-1 rounded-full capitalize font-medium transition-colors ${
                  filter === f
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Snap Button */}
          <button
            onClick={takeSnapshot}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4" />
            Capture Photo Snapshot
          </button>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
          {status === 'denied' ? (
            <>
              <ShieldAlert className="w-8 h-8 text-rose-500 mx-auto" />
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Camera access was blocked in browser settings. Please unblock camera permissions in your browser's site settings to use this feature.
              </p>
            </>
          ) : (
            <>
              <Camera className="w-8 h-8 text-indigo-500 mx-auto" />
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Permission is required to launch camera feed and take filter snapshots.
              </p>
              <button
                onClick={handleOpenCam}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-md active:scale-95 transition-transform"
              >
                Request Camera Access
              </button>
            </>
          )}
        </div>
      )}

      {/* Captured Snapshots Gallery */}
      {capturedPhotos.length > 0 && (
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>Captured Snapshots ({capturedPhotos.length})</span>
            <button
              onClick={() => setCapturedPhotos([])}
              className="text-rose-500 hover:text-rose-600 flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> Clear
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {capturedPhotos.map(photo => (
              <div key={photo.id} className="group relative rounded-xl overflow-hidden aspect-square border border-slate-200 dark:border-slate-700">
                <img src={photo.url} alt="Snapshot" className="w-full h-full object-cover" />
                <a
                  href={photo.url}
                  download={`omnisense-snapshot-${photo.id}.png`}
                  className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                >
                  <Download className="w-5 h-5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
