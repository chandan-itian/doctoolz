import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ToolHeader } from '../common/ToolHeader';
import { ArrowUpRight, Upload, Download, RefreshCw, CheckCircle2, Sparkles } from 'lucide-react';
import { increaseFileSize } from '../../utils/fileSizeIncreaser';
import { generateSmallSamplePhoto } from '../../utils/sampleImages';
import confetti from 'canvas-confetti';

export const SizeIncreaser: React.FC = () => {
  const { t, language } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [targetKb, setTargetKb] = useState<number>(50);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; url: string; finalKb: number; originalKb: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setResult(null);
    }
  };

  const handleSample = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const sample = await generateSmallSamplePhoto();
    setFile(sample);
    setPreviewUrl(URL.createObjectURL(sample));
    setResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && dropped.type.startsWith('image/')) {
      setFile(dropped);
      setPreviewUrl(URL.createObjectURL(dropped));
      setResult(null);
    }
  };

  const handleIncrease = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const res = await increaseFileSize(file, targetKb);
      const url = URL.createObjectURL(res.blob);
      setResult({
        blob: res.blob,
        url,
        finalKb: res.finalSizeKb,
        originalKb: res.originalSizeKb,
      });
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    } catch (err) {
      console.error(err);
      alert('Error increasing file size: ' + (err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const a = document.createElement('a');
    a.href = result.url;
    const ext = file.name.split('.').pop() || 'jpg';
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    a.download = `${nameWithoutExt}_${result.finalKb}KB.${ext}`;
    a.click();
  };

  const resetAll = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <ToolHeader
        title={t.tools.sizeIncreaser.name}
        badge={t.tools.sizeIncreaser.badge}
        description={t.tools.sizeIncreaser.desc}
        icon={ArrowUpRight}
        iconGradient="from-sky-600 to-blue-700"
      />

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {!file ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl p-10 text-center cursor-pointer transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Upload className="w-8 h-8" />
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-100 text-base mb-1">
              {t.dropzoneText} <span className="text-blue-600">{t.browseFiles}</span>
            </p>
            <p className="text-xs text-slate-400 mb-3">JPG, JPEG, PNG (Photo & Signature)</p>

            <button
              type="button"
              onClick={handleSample}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? '✨ सैंपल डेमो फोटो आज़माएं (~12 KB)' : '✨ Try Demo Photo (~12 KB)'}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left: Preview */}
            <div className="space-y-4">
              <div className="relative aspect-square max-h-80 mx-auto rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center p-2">
                <img
                  src={result ? result.url : previewUrl!}
                  alt="Preview"
                  className="max-h-full max-w-full object-contain rounded-lg"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 px-2">
                <span>Original: {Math.round((file.size / 1024) * 10) / 10} KB</span>
                {result && (
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    New Size: {result.finalKb} KB (Increased!)
                  </span>
                )}
              </div>
            </div>

            {/* Right: Controls */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
                  Target Size in KB (न्यूनतम साइज चुनें):
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {[20, 30, 50, 100, 200].map((kb) => (
                    <button
                      key={kb}
                      onClick={() => setTargetKb(kb)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        targetKb === kb
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                      }`}
                    >
                      {kb} KB
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="5000"
                    value={targetKb}
                    onChange={(e) => setTargetKb(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-32 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <span className="text-xs text-slate-500">KB (Custom minimum size)</span>
                </div>
              </div>

              <div className="p-4 bg-sky-50 dark:bg-sky-950/40 rounded-xl border border-sky-200 dark:border-sky-800 text-xs text-sky-800 dark:text-sky-300 leading-relaxed">
                💡 <strong>Why use this:</strong> कई सरकारी परीक्षा पोर्टल (जैसे SSC, UPSC, State PSC) 20KB या 50KB से कम की फोटो को रिजेक्ट कर देते हैं। यह टूल बिना फोटो की क्लेरिटी कम किए फाइल का साइज सुरक्षित रूप से बढ़ा देता है।
              </div>

              {result ? (
                <div className="space-y-3">
                  <button
                    onClick={handleDownload}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Increased Photo ({result.finalKb} KB)</span>
                  </button>
                  <button
                    onClick={resetAll}
                    className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Process Another Photo
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleIncrease}
                  disabled={isProcessing}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Increasing File Size...</span>
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="w-5 h-5" />
                      <span>Increase to {targetKb} KB Now</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
