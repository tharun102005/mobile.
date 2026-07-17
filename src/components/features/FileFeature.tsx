import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useHaptics } from '../../hooks/useHaptics';
import { FolderUp, Image as ImageIcon, Download, FileText, CheckCircle2 } from 'lucide-react';

export const FileFeature: React.FC = () => {
  const { requestPermission, showToast } = useApp();
  const { triggerHaptic } = useHaptics();

  const [selectedFiles, setSelectedFiles] = useState<Array<{ name: string; size: number; type: string; url?: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    triggerHaptic('success');
    const files = Array.from(e.target.files);
    
    const parsed = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type || 'unknown/file',
      url: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    }));

    setSelectedFiles(prev => [...parsed, ...prev]);
    showToast(`Loaded ${files.length} file(s) into vault`);
  };

  const handleOpenFilePicker = () => {
    requestPermission('files', () => {
      fileInputRef.current?.click();
    });
  };

  const handleOpenGalleryPicker = () => {
    requestPermission('gallery', () => {
      galleryInputRef.current?.click();
    });
  };

  const generateAndDownloadReport = () => {
    triggerHaptic('medium');
    const reportData = {
      app: 'OmniSense Native PWA',
      timestamp: new Date().toISOString(),
      sessionSummary: 'System permissions and device diagnostics exported successfully.',
      filesCount: selectedFiles.length,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omnisense-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Downloaded JSON report to device!');
  };

  return (
    <div className="p-5 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4">
      {/* Hidden Native Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        className="hidden"
      />
      <input
        type="file"
        ref={galleryInputRef}
        accept="image/*"
        onChange={handleFileChange}
        multiple
        className="hidden"
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
            <FolderUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Files & Photo Gallery</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Import documents & download session reports</p>
          </div>
        </div>
      </div>

      {/* Upload Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleOpenFilePicker}
          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-cyan-500/50 flex flex-col items-center justify-center text-center gap-2 active:scale-95 transition-all group"
        >
          <FolderUp className="w-6 h-6 text-cyan-500 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Import Files</span>
        </button>

        <button
          onClick={handleOpenGalleryPicker}
          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-cyan-500/50 flex flex-col items-center justify-center text-center gap-2 active:scale-95 transition-all group"
        >
          <ImageIcon className="w-6 h-6 text-pink-500 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Photo Library</span>
        </button>
      </div>

      {/* Generate & Download Report */}
      <button
        onClick={generateAndDownloadReport}
        className="w-full py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-sm shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2"
      >
        <Download className="w-4 h-4" />
        Download Session Diagnostics Report
      </button>

      {/* Selected File List */}
      {selectedFiles.length > 0 && (
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Vault Files ({selectedFiles.length})
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {selectedFiles.map((file, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/70 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  {file.url ? (
                    <img src={file.url} alt="Thumb" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                  ) : (
                    <FileText className="w-5 h-5 text-cyan-500 shrink-0" />
                  )}
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{file.name}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {(file.size / 1024).toFixed(1)} KB • {file.type}
                    </p>
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
