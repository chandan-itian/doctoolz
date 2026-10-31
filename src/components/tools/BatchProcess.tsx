import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Layers,
  Upload,
  Download,
  Trash2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { compressImageToTargetKb, loadImageFromFile } from '../../utils/imageCompressor';

interface BatchItem {
  id: string;
  file: File;
  originalSizeKb: number;
  processedBlob?: Blob;
  processedUrl?: string;
  processedSizeKb?: number;
  status: 'pending' | 'processing' | 'done';
}

export const BatchProcess: React.FC = () => {
  const { setActiveTool, language } = useApp();
  const [items, setItems] = useState<BatchItem[]>([]);
  const [targetKb, setTargetKb] = useState<number>(50);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const added: BatchItem[] = Array.from(e.target.files).map((f) => ({
        id: Math.random().toString(36).substring(7),
        file: f,
        originalSizeKb: Math.round((f.size / 1024) * 10) / 10,
        status: 'pending',
      }));
      setItems((prev) => [...prev, ...added]);
    }
  };

  const processBatch = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);

    const updated = [...items];
    for (let i = 0; i < updated.length; i++) {
      updated[i].status = 'processing';
      setItems([...updated]);

      try {
        const img = await loadImageFromFile(updated[i].file);
        const res = await compressImageToTargetKb(img, {
          targetKb,
          outputFormat: 'image/jpeg',
          dpi: 300,
        });
        updated[i].processedBlob = res.blob;
        updated[i].processedUrl = URL.createObjectURL(res.blob);
        updated[i].processedSizeKb = res.sizeKb;
        updated[i].status = 'done';
      } catch (err) {
        console.error(err);
      }
      setItems([...updated]);
    }

    setIsProcessing(false);
  };

  const downloadAll = () => {
    items.forEach((item) => {
      if (item.processedUrl) {
        const a = document.createElement('a');
        a.href = item.processedUrl;
        a.download = `DocToolz_${targetKb}KB_${item.file.name}`;
        a.click();
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setActiveTool(null)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'वापस' : 'Back'}</span>
        </button>
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-pink-500" />
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            {language === 'hi' ? 'बैच प्रोसेस' : 'Batch Process Images'}
          </h2>
        </div>
        <div className="w-12"></div>
      </div>

      {/* Target Setting */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
            {language === 'hi' ? 'प्रत्येक फोटो का अधिकतम साइज' : 'Target KB for All Images'}
          </label>
          <span className="text-xs font-bold text-pink-600 dark:text-pink-400">
            {targetKb} KB
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="300"
          step="5"
          value={targetKb}
          onChange={(e) => setTargetKb(Number(e.target.value))}
          className="w-full accent-pink-600"
        />
        <div className="flex justify-between text-[11px] text-slate-400 mt-1">
          <span>20 KB (Govt sign)</span>
          <span>50 KB (UPSC Photo)</span>
          <span>100 KB</span>
          <span>200 KB</span>
        </div>
      </div>

      {/* Upload & List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
            {language === 'hi' ? 'फाइल सूची' : 'Selected Images'} ({items.length})
          </span>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-bold text-pink-600 bg-pink-50 dark:bg-pink-950 px-3 py-1 rounded-xl"
          >
            + {language === 'hi' ? 'फोटो जोड़ें' : 'Add Photos'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFiles}
          />
        </div>

        {items.length === 0 ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center cursor-pointer hover:border-pink-400"
          >
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
              {language === 'hi' ? 'एक साथ कई फोटो चुनें' : 'Select multiple photos to batch compress'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs"
              >
                <div className="truncate max-w-[180px]">
                  <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                    {item.file.name}
                  </p>
                  <p className="text-[10px] text-slate-400">{item.originalSizeKb} KB</p>
                </div>

                <div className="flex items-center gap-2">
                  {item.status === 'done' ? (
                    <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {item.processedSizeKb} KB
                    </span>
                  ) : item.status === 'processing' ? (
                    <span className="text-pink-600 font-bold text-[11px] animate-pulse">
                      Processing...
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[11px]">Ready</span>
                  )}
                  <button
                    onClick={() => setItems((prev) => prev.filter((i) => i.id !== item.id))}
                    className="p-1 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {items.length > 0 && (
        <div className="flex flex-col gap-2">
          <button
            onClick={processBatch}
            disabled={isProcessing}
            className="w-full py-4 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm shadow-md shadow-pink-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5" />
            <span>
              {isProcessing
                ? language === 'hi'
                  ? 'प्रोसेस हो रहा है...'
                  : 'Compressing Batch...'
                : language === 'hi'
                ? `सभी फोटो प्रोसेस करें (${items.length})`
                : `Process All (${items.length} Photos)`}
            </span>
          </button>

          {items.some((i) => i.status === 'done') && (
            <button
              onClick={downloadAll}
              className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{language === 'hi' ? 'सभी डाउनलोड करें' : 'Download All Processed'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
