import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { Dropzone } from '../common/Dropzone';
import { loadImageFromFile } from '../../utils/imageCompressor';
import { setJpegDpi } from '../../utils/dpiModifier';
import { applyBitDepthAndFilters, BitDepthMode } from '../../utils/bitDepthConverter';
import { generateSamplePortrait } from '../../utils/sampleImages';
import { fireConfetti } from '../common/Celebration';
import { Download, RefreshCw, ArrowLeft } from 'lucide-react';

type UnitType = 'px' | 'cm' | 'mm' | 'in';

export const CustomDimensionDpi: React.FC = () => {
  const { t, setActiveTool } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [loadedImg, setLoadedImg] = useState<HTMLImageElement | null>(null);

  // Dimension settings
  const [unit, setUnit] = useState<UnitType>('px');
  const [widthVal, setWidthVal] = useState<number>(600);
  const [heightVal, setHeightVal] = useState<number>(600);
  const [maintainAspect, setMaintainAspect] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<number>(1);

  // DPI, Bit Depth & Format
  const [dpi, setDpi] = useState<number>(300);
  const [bitDepth, setBitDepth] = useState<BitDepthMode>('24-bit');
  const [format, setFormat] = useState<'image/jpeg' | 'image/png'>('image/jpeg');

  const [resultDataUrl, setResultDataUrl] = useState<string | null>(null);
  const [resultKb, setResultKb] = useState<number>(0);
  const [pixelDims, setPixelDims] = useState<{ w: number; h: number }>({ w: 600, h: 600 });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFile = async (f: File) => {
    setFile(f);
    const img = await loadImageFromFile(f);
    setLoadedImg(img);
    const w = img.naturalWidth || 600;
    const h = img.naturalHeight || 600;
    setAspectRatio(w / h);
    setWidthVal(w);
    setHeightVal(h);
    setUnit('px');
  };

  const handleSample = async () => {
    const sample = await generateSamplePortrait();
    handleFile(sample);
  };

  const calculatePixels = useCallback(
    (w: number, h: number, u: UnitType, currentDpi: number) => {
      let pxW = w;
      let pxH = h;
      if (u === 'in') {
        pxW = Math.round(w * currentDpi);
        pxH = Math.round(h * currentDpi);
      } else if (u === 'cm') {
        pxW = Math.round((w / 2.54) * currentDpi);
        pxH = Math.round((h / 2.54) * currentDpi);
      } else if (u === 'mm') {
        pxW = Math.round((w / 25.4) * currentDpi);
        pxH = Math.round((h / 25.4) * currentDpi);
      }
      return { w: Math.max(10, pxW), h: Math.max(10, pxH) };
    },
    []
  );

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

  const processImage = useCallback(async () => {
    if (!loadedImg) return;
    setIsProcessing(true);

    try {
      const { w: finalW, h: finalH } = calculatePixels(widthVal, heightVal, unit, dpi);
      setPixelDims({ w: finalW, h: finalH });

      const canvas = document.createElement('canvas');
      canvas.width = finalW;
      canvas.height = finalH;
      const ctx = canvas.getContext('2d')!;

      // Background white fill
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, finalW, finalH);

      ctx.drawImage(loadedImg, 0, 0, finalW, finalH);

      // Apply Bit Depth filter (24-bit RGB vs 8-bit Gray vs 1-bit B/W)
      if (bitDepth !== '24-bit') {
        applyBitDepthAndFilters(ctx, finalW, finalH, bitDepth);
      }

      // Export canvas
      canvas.toBlob(
        async (blob) => {
          if (!blob) return;
          let finalBlob = blob;

          // Inject exact JFIF DPI metadata tag if JPEG
          if (format === 'image/jpeg') {
            try {
              const arrayBuffer = await blob.arrayBuffer();
              const withDpi = setJpegDpi(new Uint8Array(arrayBuffer), dpi);
              finalBlob = new Blob([withDpi as unknown as BlobPart], { type: 'image/jpeg' });
            } catch {
              finalBlob = blob;
            }
          }

          const sizeKb = Math.round((finalBlob.size / 1024) * 10) / 10;
          setResultKb(sizeKb);
          setResultDataUrl(URL.createObjectURL(finalBlob));
          setIsProcessing(false);
        },
        format,
        0.95
      );
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  }, [loadedImg, widthVal, heightVal, unit, dpi, bitDepth, format, calculatePixels]);

  useEffect(() => {
    if (loadedImg) {
      processImage();
    }
  }, [processImage, loadedImg]);

  const handleDownload = () => {
    if (!resultDataUrl) return;
    fireConfetti();
    const a = document.createElement('a');
    a.href = resultDataUrl;
    const ext = format === 'image/jpeg' ? 'jpg' : 'png';
    a.download = `custom-${pixelDims.w}x${pixelDims.h}-${dpi}dpi.${ext}`;
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
        <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 font-medium">
          {t.tools.dimensionDpi.badge}
        </span>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {t.tools.dimensionDpi.name}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.tools.dimensionDpi.desc}
          </p>
        </div>

        {!file ? (
          <Dropzone
            onFileSelect={handleFile}
            onSampleClick={handleSample}
            sampleLabel="Try Demo Photo"
          />
        ) : (
          <div className="space-y-6">
            {/* Dimensions & Unit Controls */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Dimension Settings
                </span>
                {/* Unit Switcher */}
                <div className="flex bg-white dark:bg-slate-700 p-1 rounded-xl border border-slate-300 dark:border-slate-600 text-xs font-bold">
                  {(['px', 'cm', 'mm', 'in'] as UnitType[]).map((u) => (
                    <button
                      key={u}
                      onClick={() => setUnit(u)}
                      className={`px-3 py-1 rounded-lg uppercase transition-all ${
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Width ({unit})
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
                    Height ({unit})
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

              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={maintainAspect}
                    onChange={(e) => setMaintainAspect(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600"
                  />
                  <span>Lock Aspect Ratio</span>
                </label>
                <span>Calculated Pixels: {pixelDims.w} × {pixelDims.h} px</span>
              </div>
            </div>

            {/* DPI, Bit Depth & Format Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Format Section */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Format
                </label>
                <div className="flex gap-2">
                  {[
                    { id: 'image/jpeg', label: 'JPG' },
                    { id: 'image/png', label: 'PNG' },
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      onClick={() => setFormat(fmt.id as 'image/jpeg' | 'image/png')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        format === fmt.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* DPI Section */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {t.dpiTab.dpiLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[72, 150, 200, 300].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDpi(d)}
                      className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        dpi === d
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-indigo-400'
                      }`}
                    >
                      {d} DPI
                    </button>
                  ))}
                </div>
              </div>

              {/* Bit Depth Section */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {t.dpiTab.bitDepth}
                </label>
                <div className="space-y-1.5">
                  {[
                    { id: '24-bit', label: '24-bit RGB' },
                    { id: '8-bit-gray', label: '8-bit Gray' },
                    { id: '1-bit-bw', label: '1-bit B/W' },
                  ].map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setBitDepth(b.id as BitDepthMode)}
                      className={`w-full px-2.5 py-1 rounded-xl text-left text-xs font-semibold border transition-all ${
                        bitDepth === b.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview Box */}
            <div className="p-6 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Output Preview ({pixelDims.w} × {pixelDims.h} px • {dpi} DPI • {bitDepth} • {resultKb} KB)
              </span>

              {resultDataUrl ? (
                <img
                  src={resultDataUrl}
                  alt="Custom Dimension Preview"
                  className="max-h-72 object-contain rounded-xl shadow-lg border border-slate-300 dark:border-slate-700 bg-white"
                />
              ) : (
                <div className="p-8 text-xs text-slate-400 animate-pulse">Rendering preview...</div>
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
                  setLoadedImg(null);
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
