import React, { useState, useCallback, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Dropzone } from '../common/Dropzone';
import { compressImageToTargetKb, loadImageFromFile, CompressionResult } from '../../utils/imageCompressor';
import { generateSamplePortrait } from '../../utils/sampleImages';
import { fireConfetti } from '../common/Celebration';
import { Download, RefreshCw, Sliders, ArrowDownRight, ArrowLeft, Maximize2 } from 'lucide-react';

type UnitType = 'px' | 'cm' | 'mm' | 'in';

export const ImageCompressor: React.FC = () => {
  const { t, setActiveTool } = useApp();
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [loadedImg, setLoadedImg] = useState<HTMLImageElement | null>(null);
  const [originalSizeKb, setOriginalSizeKb] = useState<number>(0);

  // Target KB & Format
  const [targetKb, setTargetKb] = useState<number>(50);
  const [customKbInput, setCustomKbInput] = useState<string>('50');
  const [format, setFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');

  // Dimension settings (User customizable in px, cm, mm, in)
  const [unit, setUnit] = useState<UnitType>('px');
  const [widthVal, setWidthVal] = useState<number>(800);
  const [heightVal, setHeightVal] = useState<number>(1000);
  const [maintainAspect, setMaintainAspect] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<number>(800 / 1000);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<CompressionResult | null>(null);

  const presets = [20, 50, 100, 200, 500];

  const calculatePixels = useCallback((w: number, h: number, u: UnitType, dpi: number = 300) => {
    let pxW = w;
    let pxH = h;
    if (u === 'in') {
      pxW = Math.round(w * dpi);
      pxH = Math.round(h * dpi);
    } else if (u === 'cm') {
      pxW = Math.round((w / 2.54) * dpi);
      pxH = Math.round((h / 2.54) * dpi);
    } else if (u === 'mm') {
      pxW = Math.round((w / 25.4) * dpi);
      pxH = Math.round((h / 25.4) * dpi);
    }
    return { w: Math.max(20, Math.round(pxW)), h: Math.max(20, Math.round(pxH)) };
  }, []);

  const executeCompression = useCallback(
    async (
      img: HTMLImageElement,
      kbTarget: number,
      outFormat: 'image/jpeg' | 'image/png' | 'image/webp',
      w: number,
      h: number,
      u: UnitType
    ) => {
      setIsProcessing(true);
      try {
        const { w: exactW, h: exactH } = calculatePixels(w, h, u);
        const res = await compressImageToTargetKb(img, {
          targetKb: kbTarget,
          exactWidth: exactW,
          exactHeight: exactH,
          dpi: 300,
          outputFormat: outFormat,
        });

        if (originalFile) {
          const orig = Math.round((originalFile.size / 1024) * 10) / 10;
          const reduction = Math.round(((orig - res.sizeKb) / orig) * 100);
          res.reductionPercentage = Math.max(0, reduction);
        }

        setResult(res);
        fireConfetti();
      } catch (err) {
        console.error(err);
        alert('Error compressing image');
      } finally {
        setIsProcessing(false);
      }
    },
    [calculatePixels, originalFile]
  );

  const handleFileSelect = async (file: File) => {
    setOriginalFile(file);
    const sizeInKb = Math.round((file.size / 1024) * 10) / 10;
    setOriginalSizeKb(sizeInKb);

    const img = await loadImageFromFile(file);
    setLoadedImg(img);

    const w = img.naturalWidth || 800;
    const h = img.naturalHeight || 1000;
    setWidthVal(w);
    setHeightVal(h);
    setUnit('px');
    setAspectRatio(w / h);

    await executeCompression(img, targetKb, format, w, h, 'px');
  };

  const handleSample = async () => {
    const sample = await generateSamplePortrait();
    handleFileSelect(sample);
  };

  const handleWidthChange = (val: number) => {
    setWidthVal(val);
    if (maintainAspect && aspectRatio > 0) {
      setHeightVal(Math.round((val / aspectRatio) * 100) / 100);
    }
  };

  const handleHeightChange = (val: number) => {
    setHeightVal(val);
    if (maintainAspect && aspectRatio > 0) {
      setWidthVal(Math.round(val * aspectRatio * 100) / 100);
    }
  };

  const handlePresetClick = (kb: number) => {
    setTargetKb(kb);
    setCustomKbInput(kb.toString());
    if (loadedImg) {
      executeCompression(loadedImg, kb, format, widthVal, heightVal, unit);
    }
  };

  const handleFormatChange = (newFormat: 'image/jpeg' | 'image/png' | 'image/webp') => {
    setFormat(newFormat);
    if (loadedImg) {
      executeCompression(loadedImg, targetKb, newFormat, widthVal, heightVal, unit);
    }
  };

  const handleApplySettings = () => {
    const parsedKb = parseFloat(customKbInput);
    const kb = !isNaN(parsedKb) && parsedKb >= 5 ? parsedKb : targetKb;
    setTargetKb(kb);
    if (loadedImg) {
      executeCompression(loadedImg, kb, format, widthVal, heightVal, unit);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.dataUrl;
    const originalBaseName = originalFile?.name.replace(/\.[^/.]+$/, '') || 'photo';
    const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/png' ? 'png' : 'webp';
    a.download = `${originalBaseName}-${result.sizeKb}kb.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Back button & Title */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setActiveTool(null)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToAllTools}</span>
        </button>
        <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-medium">
          {t.tools.compressor.badge}
        </span>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {t.tools.compressor.name}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.tools.compressor.desc}
          </p>
        </div>

        {!originalFile ? (
          <Dropzone
            onFileSelect={handleFileSelect}
            onSampleClick={handleSample}
            sampleLabel="Try Demo Photo"
          />
        ) : (
          <div className="space-y-6">
            {/* Target Size & Format Controls */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
              {/* Output Format Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Download Format:
                </label>
                <div className="flex gap-2">
                  {[
                    { id: 'image/jpeg', label: 'JPG / JPEG' },
                    { id: 'image/png', label: 'PNG' },
                    { id: 'image/webp', label: 'WebP' },
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      onClick={() => handleFormatChange(fmt.id as 'image/jpeg' | 'image/png' | 'image/webp')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        format === fmt.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:border-indigo-400'
                      }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target File Size (KB) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  {t.compressorTab.targetKbLabel}
                </label>

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mr-1">
                    {t.compressorTab.commonPresets}
                  </span>
                  {presets.map((kb) => (
                    <button
                      key={kb}
                      onClick={() => handlePresetClick(kb)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        targetKb === kb
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-105'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:border-indigo-400'
                      }`}
                    >
                      {kb} KB
                    </button>
                  ))}
                </div>

                {/* Custom Target KB Input */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 max-w-xs">
                    <input
                      type="number"
                      min="5"
                      max="10000"
                      value={customKbInput}
                      onChange={(e) => setCustomKbInput(e.target.value)}
                      className="w-full pl-3 pr-10 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 font-bold text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      placeholder="Enter KB"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-medium text-slate-400">
                      KB
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Current Target: <strong className="text-indigo-600 dark:text-indigo-400">{targetKb} KB</strong>
                  </span>
                </div>
              </div>

              {/* Customizable Dimensions in px, cm, mm, in */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Custom Dimensions (Width × Height):</span>
                  </span>

                  {/* Unit Selector */}
                  <div className="flex bg-white dark:bg-slate-700 p-0.5 rounded-xl border border-slate-300 dark:border-slate-600 text-xs font-bold">
                    {(['px', 'cm', 'mm', 'in'] as UnitType[]).map((u) => (
                      <button
                        key={u}
                        onClick={() => setUnit(u)}
                        className={`px-2.5 py-1 rounded-lg uppercase transition-all ${
                          unit === u
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Width & Height Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Width ({unit}):
                    </label>
                    <input
                      type="number"
                      step={unit === 'px' ? '1' : '0.1'}
                      value={widthVal}
                      onChange={(e) => handleWidthChange(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Height ({unit}):
                    </label>
                    <input
                      type="number"
                      step={unit === 'px' ? '1' : '0.1'}
                      value={heightVal}
                      onChange={(e) => handleHeightChange(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={maintainAspect}
                      onChange={(e) => setMaintainAspect(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600"
                    />
                    <span>Lock Aspect Ratio</span>
                  </label>

                  <button
                    onClick={handleApplySettings}
                    disabled={isProcessing}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Apply Custom Dimensions & Size</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Results Display */}
            {isProcessing ? (
              <div className="p-12 text-center">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t.processing}
                </p>
              </div>
            ) : result ? (
              <div className="space-y-6">
                {/* Comparison Stats Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60">
                  <div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {t.originalSize}
                    </span>
                    <p className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-200">
                      {originalSizeKb} KB
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      {t.newSize}
                    </span>
                    <p className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">
                      {result.sizeKb} KB
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      Format
                    </span>
                    <p className="text-base sm:text-lg font-black text-indigo-600 dark:text-indigo-400 uppercase">
                      {format === 'image/jpeg' ? 'JPG' : format === 'image/png' ? 'PNG' : 'WebP'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {t.dimensions}
                    </span>
                    <p className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-300">
                      {result.width} × {result.height} px
                    </p>
                  </div>
                </div>

                {/* Preview Image */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40">
                  <div className="text-center">
                    <p className="text-xs font-semibold text-slate-500 mb-2">
                      Compressed Preview ({result.width} × {result.height} px • {result.sizeKb} KB)
                    </p>
                    <img
                      src={result.dataUrl}
                      alt="Compressed preview"
                      className="max-h-64 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 object-contain bg-white"
                    />
                  </div>
                </div>

                {/* Actions: Download & Reset */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <button
                    onClick={handleDownload}
                    className="flex-1 sm:flex-initial px-8 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>
                      {t.downloadResult} as {format === 'image/jpeg' ? 'JPG' : format === 'image/png' ? 'PNG' : 'WebP'} ({result.sizeKb} KB)
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setOriginalFile(null);
                      setLoadedImg(null);
                      setResult(null);
                    }}
                    className="px-5 py-3.5 rounded-2xl font-semibold text-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>{t.processAnother}</span>
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
