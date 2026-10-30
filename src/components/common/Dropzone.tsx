import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, FileImage, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  multiple?: boolean;
  onSampleClick?: () => void;
  sampleLabel?: string;
  helperText?: string;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onFileSelect,
  accept = 'image/*',
  multiple = false,
  onSampleClick,
  sampleLabel,
  helperText,
}) => {
  const { t } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Global paste handler (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            onFileSelect(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onFileSelect]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
        isDragging
          ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 scale-[1.01]'
          : 'border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/40 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />

      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
        <UploadCloud className="w-8 h-8 animate-pulse" />
      </div>

      <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-200 mb-1">
        {t.dropzoneText}{' '}
        <span className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2">
          {t.browseFiles}
        </span>
      </h3>

      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
        {helperText || t.pasteSupport}
      </p>

      {onSampleClick && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSampleClick();
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{sampleLabel || t.sampleImage}</span>
        </button>
      )}
    </div>
  );
};
