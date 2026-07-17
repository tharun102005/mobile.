import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useHaptics } from '../../hooks/useHaptics';
import { Mic, Square, Play, ShieldAlert } from 'lucide-react';

export const AudioFeature: React.FC = () => {
  const { permissions, requestPermission, showToast } = useApp();
  const { triggerHaptic } = useHaptics();

  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [audioClips, setAudioClips] = useState<Array<{ id: string; url: string; duration: number }>>([]);
  const [audioLevels, setAudioLevels] = useState<number[]>([15, 25, 45, 30, 20, 50, 35, 15]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const status = permissions.microphone.status;

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      triggerHaptic('medium');

      // Web Audio API Frequency Visualizer setup
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 32;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateVisualizer = () => {
        analyser.getByteFrequencyData(dataArray);
        const sliced = Array.from(dataArray.slice(0, 10)).map(v => Math.max(10, Math.min(100, (v / 255) * 100)));
        setAudioLevels(sliced);
        animFrameRef.current = requestAnimationFrame(updateVisualizer);
      };

      updateVisualizer();

      // MediaRecorder setup
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = e => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioClips(prev => [{ id: Date.now().toString(), url, duration: recordDuration }, ...prev]);
        stream.getTracks().forEach(track => track.stop());
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      };

      recorder.start();
      setIsRecording(true);
      setRecordDuration(0);

      timerRef.current = setInterval(() => {
        setRecordDuration(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.warn('Microphone stream error:', err);
      showToast('Could not access microphone feed.');
    }
  };

  const stopVoiceRecording = () => {
    triggerHaptic('heavy');
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    showToast('Voice clip saved!');
  };

  const handleMicRequest = () => {
    requestPermission('microphone', () => {
      startVoiceRecording();
    });
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div className="p-5 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Audio Recorder</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Web Audio frequency visualizer & voice clips</p>
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

      {status === 'granted' || isRecording ? (
        <div className="space-y-4">
          {/* Live Waveform Bars */}
          <div className="p-4 rounded-2xl bg-slate-950 flex items-center justify-center gap-1.5 h-24 border border-slate-800">
            {audioLevels.map((lvl, idx) => (
              <div
                key={idx}
                className="w-2.5 bg-gradient-to-t from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-75"
                style={{ height: `${lvl}%` }}
              />
            ))}
          </div>

          {/* Record Control Button */}
          {!isRecording ? (
            <button
              onClick={startVoiceRecording}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-purple-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <Mic className="w-4 h-4" />
              Start Voice Recording
            </button>
          ) : (
            <button
              onClick={stopVoiceRecording}
              className="w-full py-3.5 rounded-2xl bg-rose-600 text-white font-semibold text-sm shadow-lg shadow-rose-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 animate-pulse"
            >
              <Square className="w-4 h-4" />
              Stop Recording ({recordDuration}s)
            </button>
          )}
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
          {status === 'denied' ? (
            <>
              <ShieldAlert className="w-8 h-8 text-rose-500 mx-auto" />
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Microphone access is blocked in browser settings. Enable microphone permissions to record audio.
              </p>
            </>
          ) : (
            <>
              <Mic className="w-8 h-8 text-purple-500 mx-auto" />
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Permission is required to capture live voice clips and compute frequency waveforms.
              </p>
              <button
                onClick={handleMicRequest}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white font-semibold text-xs shadow-md active:scale-95 transition-transform"
              >
                Request Microphone Access
              </button>
            </>
          )}
        </div>
      )}

      {/* Recorded Voice Clips */}
      {audioClips.length > 0 && (
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Saved Audio Clips ({audioClips.length})
          </h4>
          <div className="space-y-2">
            {audioClips.map(clip => (
              <div key={clip.id} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <Play className="w-3.5 h-3.5 text-purple-500" />
                  <span>Voice Clip ({clip.duration || 1}s)</span>
                </div>
                <audio controls src={clip.url} className="h-7 max-w-[160px]" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
