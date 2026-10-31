import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Wand2,
  Upload,
  Download,
  Palette,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { generateSamplePortrait } from '../../utils/sampleImages';
import { replaceBackgroundColor } from '../../utils/backgroundReplacer';

export const BackgroundRemover: React.FC = () => {
  const { setActiveTool, language } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [selectedBg, setSelectedBg] = useState<string>('#ffffff');
  const [customColor, setCustomColor] = useState<string>('#2563eb');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    const initDemo = async () => {
      try {
        const demo = await generateSamplePortrait();
        if (!active) return;
        setFile(demo);
        const url = URL.createObjectURL(demo);
        setPreviewUrl(url);
      } catch (e) {
        console.error(e);
      }
    };
    initDemo();
    return () => {
      active = false;
    };
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const f = e.target.files[0];
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));
      setResultUrl(null);
    }
  };

  const applyBackground = async (color: string) => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const img = new Image();
      img.src = previewUrl;
      await new Promise((res) => {
        img.onload = res;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        replaceBackgroundColor(ctx, canvas.width, canvas.height, {
          targetColor: color,
          tolerance: 40,
        });
        const url = canvas.toDataURL('image/jpeg', 0.95);
        setResultUrl(url);
        setSelectedBg(color);
      }
    } catch (err) {
      console.error('Failed to change background:', err);
    } finally {
      setIsProcessing(false);
    }
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
          <Wand2 className="w-5 h-5 text-pink-500" />
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            {language === 'hi' ? 'बैकग्राउंड रिमूवर' : 'Background Remover'}
          </h2>
        </div>
        <div className="w-12"></div>
      </div>

      {/* Main Preview Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs mb-4">
        <div className="w-64 h-72 mx-auto bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 flex items-center justify-center relative mb-4">
          <img
            src={resultUrl || previewUrl}
            alt="Preview"
            className="max-h-full max-w-full object-contain"
          />
          {isProcessing && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold">
              Processing...
            </div>
          )}
        </div>

        {/* Preset Colors */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            {language === 'hi' ? 'बैकग्राउंड कलर चुनें' : 'Choose Background Color'}
          </label>
          <div className="flex items-center gap-3 justify-center">
            {[
              { color: '#ffffff', label: 'White' },
              { color: '#3b82f6', label: 'Blue' },
              { color: '#ef4444', label: 'Red' },
              { color: '#e2e8f0', label: 'Light Grey' },
            ].map((p) => (
              <button
                key={p.color}
                onClick={() => applyBackground(p.color)}
                style={{ backgroundColor: p.color }}
                className={`w-10 h-10 rounded-full border-2 transition-transform active:scale-95 shadow-xs ${
                  selectedBg === p.color
                    ? 'border-pink-600 scale-110 ring-2 ring-pink-500/20'
                    : 'border-slate-300'
                }`}
                title={p.label}
              />
            ))}

            <div className="relative">
              <input
                type="color"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  applyBackground(e.target.value);
                }}
                className="w-10 h-10 rounded-full opacity-0 absolute inset-0 cursor-pointer"
              />
              <div
                style={{ backgroundColor: customColor }}
                className="w-10 h-10 rounded-full border-2 border-slate-300 flex items-center justify-center shadow-xs"
              >
                <Palette className="w-4 h-4 text-white drop-shadow" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200"
          >
            {language === 'hi' ? 'फोटो बदलें' : 'Upload New Photo'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </div>
      </div>

      {/* Download Button */}
      <a
        href={resultUrl || previewUrl}
        download="DocToolz_Clean_Portrait.jpg"
        className="w-full py-4 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm shadow-md shadow-pink-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <Download className="w-5 h-5" />
        <span>{language === 'hi' ? 'फोटो डाउनलोड करें' : 'Download Processed Photo'}</span>
      </a>
    </div>
  );
};
