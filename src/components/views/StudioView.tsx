import React from 'react';
import { CameraFeature } from '../features/CameraFeature';
import { AudioFeature } from '../features/AudioFeature';
import { GeoFeature } from '../features/GeoFeature';
import { MotionFeature } from '../features/MotionFeature';
import { FileFeature } from '../features/FileFeature';
import { ClipboardFeature } from '../features/ClipboardFeature';
import { PushFeature } from '../features/PushFeature';
import { ShareFeature } from '../features/ShareFeature';
import { VibrationFeature } from '../features/VibrationFeature';

export const StudioView: React.FC = () => {
  return (
    <div className="space-y-6 pb-24 animate-slide-up">
      <div className="px-1">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Hardware & Sensor Studio
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Tap any device feature below to launch. Pre-consent modal will explain why access is needed.
        </p>
      </div>

      <CameraFeature />
      <AudioFeature />
      <GeoFeature />
      <MotionFeature />
      <FileFeature />
      <ClipboardFeature />
      <PushFeature />
      <ShareFeature />
      <VibrationFeature />
    </div>
  );
};
