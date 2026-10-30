import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { Dropzone } from '../common/Dropzone';
import { loadImageFromFile } from '../../utils/imageCompressor';
import { applyBitDepthAndFilters } from '../../utils/bitDepthConverter';
import { compressImageToTargetKb } from '../../utils/imageCompressor';
import { generateSampleSignature } from '../../utils/sampleImages';
import { fireConfetti } from '../common/Celebration';
import { Download, RefreshCw, Sparkles, Sliders, ArrowLeft } from 'lucide-react';

export const SignatureResizer: React.FC = () => {
  const { t, setActiveTool } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);

  // Custom Target KB (Not just predefined!)
  const [targetKb, setTargetKb] = useState<number>(15);
  const [customKbInput, setCustomKbInput] = useState<string>('15');
  const [format, setFormat] = useState<'image/jpeg' | 'image/png'>('image/jpeg');

  const [presetDims, setPresetDims] = useState<{ width: number; height: number; name: string }>({
    width: 140,
    height: 60,
    name: '140 × 60 px (SSC / IBPS)',
  });
  const [enableCleaner, setEnableCleaner] = useState<boolean>(true);
  const [threshold, setThreshold] = useState<number>(185);

  const [resultDataUrl, setResultDataUrl] = useState<string | null>(null);
  const [resultKb, setResultKb] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFile = async (f: File) => {
    setFile(f);
    const img = await loadImageFromFile(f);
    setImgElement(img);
  };

  const handleSample = async () => {
    const sample = await generateSampleSignature();
    handleFile(sample);
  };

  const processSignature = useCallback(async () => {
    if (!imgElement) return;
    setIsProcessing(true);

    try {
      const { width: targetWidth, height: targetHeight } = presetDims;
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d')!;

      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      // Fit image inside aspect ratio
      const imgRatio = imgElement.naturalWidth / imgElement.naturalHeight;
      const canvasRatio = targetWidth / targetHeight;
      let drawW: number, drawH: number;

      if (imgRatio > canvasRatio) {
        drawW = targetWidth;
        drawH = targetWidth / imgRatio;
      } else {
        drawH = targetHeight;
        drawW = targetHeight * imgRatio;
      }

      const offsetX = (targetWidth - drawW) / 2;
      const offsetY = (targetHeight - drawH) / 2;

      ctx.drawImage(imgElement, offsetX, offsetY, drawW, drawH);

      // Apply signature cleaner filter if enabled
      if (enableCleaner) {
        applyBitDepthAndFilters(ctx, targetWidth, targetHeight, '1-bit-bw', {
          bwThreshold: threshold,
          contrast: 40,
        });
      }

      // Convert canvas to image element for KB compression
      const processedImg = new Image();
      const tempUrl = canvas.toDataURL(format, 0.95);
      await new Promise((resolve) => {
        processedImg.onload = resolve;
        processedImg.src = tempUrl;
      });

      // Compress strictly to custom target KB
      const compressed = await compressImageToTargetKb(processedImg, {
        targetKb: targetKb,
        outputFormat: format,
        dpi: 200,
      });

      setResultKb(compressed.sizeKb);
      setResultDataUrl(compressed.dataUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  }, [imgElement, presetDims, enableCleaner, threshold, targetKb, format]);

  useEffect(() => {
    if (imgElement) {
      processSignature();
    }
  }, [processSignature, imgElement]);

  const handleApplyCustomKb = () => {
    const parsed = parseFloat(customKbInput);
    if (!isNaN(parsed) && parsed >= 3) {
      setTargetKb(parsed);
    }
  };

  const handleDownload = () => {
    if (!resultDataUrl) return;
    fireConfetti();
    const a = document.createElement('a');
    a.href = resultDataUrl;
    const ext = format === 'image/jpeg' ? 'jpg' : 'png';
    a.download = `signature-${resultKb}kb.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setActiveTool(null)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToAllTools}</span>
        </button>
        <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-medium">
          {t.tools.signature.badge}
        </span>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {t.tools.signature.name}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.tools.signature.desc}
          </p>
        </div>

        {!file ? (
          <Dropzone
            onFileSelect={handleFile}
            onSampleClick={handleSample}
            sampleLabel="Try Demo Signature"
          />
        ) : (
          <div className="space-y-6">
            {/* Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Dimensions & Format */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Format:
                  </label>
                  <div className="flex gap-2">
                    {[
                      { id: 'image/jpeg', label: 'JPG' },
                      { id: 'image/png', label: 'PNG' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setFormat(f.id as 'image/jpeg' | 'image/png')}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          format === f.id
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    {t.signatureTab.dimensions}
                  </label>
                  <div className="space-y-2">
                    {[
                      { width: 140, height: 60, name: '140 × 60 px (SSC / Banking standard)' },
                      { width: 200, height: 100, name: '200 × 100 px (Railway / UPSC standard)' },
                      { width: 280, height: 120, name: '280 × 120 px (High Resolution)' },
                    ].map((dim) => (
                      <button
                        key={dim.name}
                        onClick={() => setPresetDims(dim)}
                        className={`w-full p-2 rounded-xl text-left text-xs font-semibold border transition-all ${
                          presetDims.name === dim.name
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-indigo-400'
                        }`}
                      >
                        {dim.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Custom Target Size & Cleaner */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Custom Target Size (KB):
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        min="3"
                        max="500"
                        step="1"
                        value={customKbInput}
                        onChange={(e) => setCustomKbInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 font-bold text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        placeholder="e.g. 10, 12, 15, 16 KB"
                      />
                      <span className="absolute right-3 top-2.5 text-xs font-medium text-slate-400">
                        KB
                      </span>
                    </div>
                    <button
                      onClick={handleApplyCustomKb}
                      disabled={isProcessing}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Set KB</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Target set to: <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{targetKb} KB</strong> (Type 10, 12, 15, 16 or any custom number)
                  </p>
                </div>

                {/* Cleaner switch */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableCleaner}
                      onChange={(e) => setEnableCleaner(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{t.signatureTab.cleanMode}</span>
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {t.signatureTab.cleanModeDesc}
                  </p>

                  {enableCleaner && (
                    <div className="mt-3">
                      <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-1">
                        <span>Background Threshold</span>
                        <span>{threshold}</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="240"
                        value={threshold}
                        onChange={(e) => setThreshold(Number(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Preview Box */}
            <div className="p-6 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Signature Output Preview ({presetDims.width} × {presetDims.height} px • {resultKb} KB • {format === 'image/jpeg' ? 'JPG' : 'PNG'})
              </span>

              {resultDataUrl ? (
                <div className="p-4 bg-white rounded-xl shadow-md border-2 border-dashed border-slate-300">
                  <img
                    src={resultDataUrl}
                    alt="Processed Signature"
                    className="max-h-28 object-contain"
                  />
                </div>
              ) : (
                <div className="p-8 text-xs text-slate-400 animate-pulse">Processing signature...</div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handleDownload}
                disabled={!resultDataUrl || isProcessing}
                className="flex-1 sm:flex-initial px-8 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>
                  {t.downloadResult} as {format === 'image/jpeg' ? 'JPG' : 'PNG'} ({resultKb} KB)
                </span>
              </button>

              <button
                onClick={() => {
                  setFile(null);
                  setImgElement(null);
                  setResultDataUrl(null);
                }}
                className="px-5 py-3.5 rounded-2xl font-semibold text-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{t.processAnother}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
