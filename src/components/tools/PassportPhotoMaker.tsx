import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { Dropzone } from '../common/Dropzone';
import { loadImageFromFile, compressImageToTargetKb } from '../../utils/imageCompressor';
import { replaceBackgroundColor } from '../../utils/backgroundReplacer';
import { generateSamplePortrait } from '../../utils/sampleImages';
import { fireConfetti } from '../common/Celebration';
import { Download, RefreshCw, ZoomIn, ZoomOut, Move, ArrowLeft, Printer, Sparkles, Sliders, Palette } from 'lucide-react';

type PassportPreset = 'india-35x45' | 'us-2x2';
type SheetMode = 'single' | 'sheet4' | 'sheet8' | 'sheet12';

export const PassportPhotoMaker: React.FC = () => {
  const { t, setActiveTool } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [loadedImg, setLoadedImg] = useState<HTMLImageElement | null>(null);

  // Crop & Adjustments state
  const [preset, setPreset] = useState<PassportPreset>('india-35x45');
  const [zoom, setZoom] = useState<number>(1);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);

  // Background Color State (Multi-swatch + Custom Color Picker + Auto-Replacer)
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [enableBgReplace, setEnableBgReplace] = useState<boolean>(true);
  const [bgTolerance, setBgTolerance] = useState<number>(38);

  const [addBorder, setAddBorder] = useState<boolean>(true);
  const [sheetMode, setSheetMode] = useState<SheetMode>('single');

  // Custom Target Size (KB) & Format (JPG / PNG)
  const [targetKb, setTargetKb] = useState<number>(50);
  const [customKbInput, setCustomKbInput] = useState<string>('50');
  const [format, setFormat] = useState<'image/jpeg' | 'image/png'>('image/jpeg');

  const [resultDataUrl, setResultDataUrl] = useState<string | null>(null);
  const [resultSizeKb, setResultSizeKb] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const colorPresets = [
    { color: '#ffffff', name: 'Pure White (India/US Standard)' },
    { color: '#0284c7', name: 'Passport Sky Blue' },
    { color: '#1e3a8a', name: 'Royal Navy Blue' },
    { color: '#f1f5f9', name: 'Light Studio Gray' },
    { color: '#ef4444', name: 'Asian Visa Red' },
    { color: '#10b981', name: 'Pastel Green' },
  ];

  const handleFile = async (f: File) => {
    setFile(f);
    const img = await loadImageFromFile(f);
    setLoadedImg(img);
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  const handleSample = async () => {
    const sample = await generateSamplePortrait();
    handleFile(sample);
  };

  // Dimensions based on preset (300 DPI)
  // India 3.5cm x 4.5cm: 413 x 531 px
  // US 2x2 inch: 600 x 600 px
  const getSinglePhotoDimensions = useCallback(() => {
    if (preset === 'india-35x45') {
      return { width: 413, height: 531, name: '3.5x4.5cm' };
    }
    return { width: 600, height: 600, name: '2x2 inch' };
  }, [preset]);

  // Render passport photo / print sheet onto canvas and compress
  const renderOutput = useCallback(async () => {
    if (!loadedImg) return;
    setIsProcessing(true);

    try {
      const { width: pWidth, height: pHeight } = getSinglePhotoDimensions();

      // 1. Render single photo canvas
      const singleCanvas = document.createElement('canvas');
      singleCanvas.width = pWidth;
      singleCanvas.height = pHeight;
      const sCtx = singleCanvas.getContext('2d', { willReadFrequently: true })!;

      // Fill chosen background color
      sCtx.fillStyle = bgColor;
      sCtx.fillRect(0, 0, pWidth, pHeight);

      // Draw photo with zoom and pan
      sCtx.save();
      sCtx.translate(pWidth / 2 + panX, pHeight / 2 + panY);
      sCtx.scale(zoom, zoom);

      const imgRatio = loadedImg.naturalWidth / loadedImg.naturalHeight;
      const canvasRatio = pWidth / pHeight;
      let drawW: number, drawH: number;

      if (imgRatio > canvasRatio) {
        drawH = pHeight;
        drawW = pHeight * imgRatio;
      } else {
        drawW = pWidth;
        drawH = pWidth / imgRatio;
      }

      sCtx.drawImage(loadedImg, -drawW / 2, -drawH / 2, drawW, drawH);
      sCtx.restore();

      // 2. Replace photo background behind person with selected color
      if (enableBgReplace) {
        replaceBackgroundColor(sCtx, pWidth, pHeight, {
          targetColor: bgColor,
          tolerance: bgTolerance,
        });
      }

      // 3. 1px black border
      if (addBorder) {
        sCtx.strokeStyle = '#000000';
        sCtx.lineWidth = 2;
        sCtx.strokeRect(1, 1, pWidth - 2, pHeight - 2);
      }

      let finalCanvas = singleCanvas;

      // 4. Multi-photo print sheet mode (4x6 or A4)
      if (sheetMode !== 'single') {
        const sheetCanvas = document.createElement('canvas');
        const shCtx = sheetCanvas.getContext('2d')!;

        if (sheetMode === 'sheet4' || sheetMode === 'sheet8') {
          // Standard 4x6 inch photo paper at 300 DPI = 1800 x 1200 px
          sheetCanvas.width = 1800;
          sheetCanvas.height = 1200;
          shCtx.fillStyle = '#ffffff';
          shCtx.fillRect(0, 0, 1800, 1200);

          const count = sheetMode === 'sheet4' ? 4 : 8;
          const cols = count === 4 ? 2 : 4;
          const rows = 2;

          const cellW = 1800 / cols;
          const cellH = 1200 / rows;

          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const x = c * cellW + (cellW - pWidth) / 2;
              const y = r * cellH + (cellH - pHeight) / 2;
              shCtx.drawImage(singleCanvas, x, y);

              // Scissor cut guides
              shCtx.strokeStyle = '#cbd5e1';
              shCtx.lineWidth = 1;
              shCtx.strokeRect(x, y, pWidth, pHeight);
            }
          }
        } else if (sheetMode === 'sheet12') {
          // A4 Paper at 300 DPI = 2480 x 3508 px
          sheetCanvas.width = 2480;
          sheetCanvas.height = 3508;
          shCtx.fillStyle = '#ffffff';
          shCtx.fillRect(0, 0, 2480, 3508);

          const cols = 3;
          const rows = 4;
          const cellW = 2480 / cols;
          const cellH = 3508 / rows;

          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const x = c * cellW + (cellW - pWidth) / 2;
              const y = r * cellH + (cellH - pHeight) / 2;
              shCtx.drawImage(singleCanvas, x, y);
              shCtx.strokeStyle = '#cbd5e1';
              shCtx.lineWidth = 1;
              shCtx.strokeRect(x, y, pWidth, pHeight);
            }
          }
        }

        finalCanvas = sheetCanvas;
      }

      // Convert canvas to image for strict target KB compression
      const tempImg = new Image();
      const tempUrl = finalCanvas.toDataURL(format, 0.95);
      await new Promise((res) => {
        tempImg.onload = res;
        tempImg.src = tempUrl;
      });

      const compressed = await compressImageToTargetKb(tempImg, {
        targetKb: targetKb,
        dpi: 300,
        outputFormat: format,
      });

      setResultSizeKb(compressed.sizeKb);
      setResultDataUrl(compressed.dataUrl);
    } catch (err) {
      console.error('Passport rendering error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [
    loadedImg,
    getSinglePhotoDimensions,
    bgColor,
    enableBgReplace,
    bgTolerance,
    panX,
    panY,
    zoom,
    addBorder,
    sheetMode,
    targetKb,
    format,
  ]);

  useEffect(() => {
    if (loadedImg) {
      renderOutput();
    }
  }, [renderOutput, loadedImg]);

  // Mouse pan handlers for preview
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX - panX, y: e.clientY - panY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    setPanX(e.clientX - dragStartRef.current.x);
    setPanY(e.clientY - dragStartRef.current.y);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleApplyCustomKb = () => {
    const val = parseFloat(customKbInput);
    if (!isNaN(val) && val >= 5) {
      setTargetKb(val);
    }
  };

  const handleDownload = () => {
    if (!resultDataUrl) return;
    fireConfetti();
    const a = document.createElement('a');
    a.href = resultDataUrl;
    const typeLabel = sheetMode === 'single' ? 'passport-300dpi' : `${sheetMode}-print-sheet`;
    const ext = format === 'image/jpeg' ? 'jpg' : 'png';
    a.download = `doctoolz-${typeLabel}-${resultSizeKb}kb.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Back button & Title */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setActiveTool(null)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToAllTools}</span>
        </button>
        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium">
          {t.tools.passport.badge}
        </span>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {t.tools.passport.name}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.tools.passport.desc}
          </p>
        </div>

        {!file ? (
          <Dropzone
            onFileSelect={handleFile}
            onSampleClick={handleSample}
            sampleLabel="Try Demo Portrait"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Controls Column */}
            <div className="lg:col-span-5 space-y-5">
              {/* Presets */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  {t.passportTab.standardPreset}
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setPreset('india-35x45')}
                    className={`w-full p-3 rounded-xl text-left text-xs font-semibold border transition-all ${
                      preset === 'india-35x45'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                        : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:border-indigo-400'
                    }`}
                  >
                    <div className="font-bold">{t.passportTab.indiaPassport}</div>
                    <div className={preset === 'india-35x45' ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}>
                      35mm × 45mm @ 300 DPI (413 × 531 px)
                    </div>
                  </button>

                  <button
                    onClick={() => setPreset('us-2x2')}
                    className={`w-full p-3 rounded-xl text-left text-xs font-semibold border transition-all ${
                      preset === 'us-2x2'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                        : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:border-indigo-400'
                    }`}
                  >
                    <div className="font-bold">{t.passportTab.usVisa}</div>
                    <div className={preset === 'us-2x2' ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}>
                      2 × 2 Inches @ 300 DPI (600 × 600 px)
                    </div>
                  </button>
                </div>
              </div>

              {/* Functional Background Color Replacer (Multiple + Custom Color Picker) */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Background Color & Replacement:</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableBgReplace}
                      onChange={(e) => setEnableBgReplace(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-indigo-600"
                    />
                    <span>Replace BG</span>
                  </label>
                </div>

                {/* Color Swatches + Custom Color Input */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {colorPresets.map((swatch) => (
                    <button
                      key={swatch.color}
                      onClick={() => setBgColor(swatch.color)}
                      title={swatch.name}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${
                        bgColor.toLowerCase() === swatch.color.toLowerCase()
                          ? 'border-indigo-600 scale-110 shadow-md ring-2 ring-indigo-400'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                      style={{ backgroundColor: swatch.color }}
                    />
                  ))}

                  {/* Custom Hex Color Picker */}
                  <label
                    title="Choose any custom background color"
                    className="relative w-8 h-8 rounded-full border-2 border-dashed border-slate-400 dark:border-slate-500 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform overflow-hidden"
                    style={{ backgroundColor: bgColor }}
                  >
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <Sparkles className="w-3.5 h-3.5 text-slate-700 drop-shadow" />
                  </label>

                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 ml-1">
                    {bgColor.toUpperCase()}
                  </span>
                </div>

                {/* Tolerance / Sensitivity Slider when BG replace is enabled */}
                {enableBgReplace && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      <span>Edge Sensitivity (Tolerance):</span>
                      <span className="font-bold text-indigo-600">{bgTolerance}</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="75"
                      value={bgTolerance}
                      onChange={(e) => setBgTolerance(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                    <p className="text-[10px] text-slate-400">
                      Adjust if background edges need tighter or softer detection.
                    </p>
                  </div>
                )}

                <label className="flex items-center gap-2 pt-1 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addBorder}
                    onChange={(e) => setAddBorder(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{t.passportTab.addBorder}</span>
                </label>
              </div>

              {/* Custom Target KB & Format (JPG / PNG) */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                {/* Format selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Download Format:
                  </label>
                  <div className="flex gap-2">
                    {[
                      { id: 'image/jpeg', label: 'JPG (300 DPI Standard)' },
                      { id: 'image/png', label: 'PNG (Lossless)' },
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

                {/* Target KB selection (Customizable e.g. 20, 50, 100 or custom input) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Custom Target Size (KB):
                  </label>

                  <div className="flex gap-2 mb-2">
                    {[20, 50, 100, 200].map((kb) => (
                      <button
                        key={kb}
                        onClick={() => {
                          setTargetKb(kb);
                          setCustomKbInput(kb.toString());
                        }}
                        className={`flex-1 py-1 rounded-lg text-xs font-bold border transition-all ${
                          targetKb === kb
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                        }`}
                      >
                        {kb} KB
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        min="10"
                        max="2000"
                        step="1"
                        value={customKbInput}
                        onChange={(e) => setCustomKbInput(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        placeholder="e.g. 35, 45, 60 KB"
                      />
                      <span className="absolute right-3 top-2 text-xs font-medium text-slate-400">
                        KB
                      </span>
                    </div>
                    <button
                      onClick={handleApplyCustomKb}
                      disabled={isProcessing}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow transition-all flex items-center gap-1 disabled:opacity-50"
                    >
                      <Sliders className="w-3 h-3" />
                      <span>Set</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Output will be compressed strictly under <strong className="text-indigo-600">{targetKb} KB</strong>.
                  </p>
                </div>
              </div>

              {/* Printable Sheet Options */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Printer className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{t.passportTab.generateSheet}</span>
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  {[
                    { id: 'single', label: t.passportTab.singlePhoto },
                    { id: 'sheet4', label: t.passportTab.sheet4 },
                    { id: 'sheet8', label: t.passportTab.sheet8 },
                    { id: 'sheet12', label: t.passportTab.sheet12 },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSheetMode(s.id as SheetMode)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        sheetMode === s.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Preview & Adjustment Column */}
            <div className="lg:col-span-7 flex flex-col items-center justify-between space-y-6">
              {/* Interactive Zoom / Pan Controls */}
              <div className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                <div className="flex items-center gap-2">
                  <Move className="w-4 h-4 text-indigo-500" />
                  <span className="text-slate-600 dark:text-slate-400">Drag photo to reposition</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setZoom((z) => Math.max(0.4, z - 0.1))}
                    title="Zoom out"
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-slate-800 dark:text-slate-200 min-w-12 text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
                    title="Zoom in"
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Live Interactive Preview Box */}
              <div
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="relative overflow-hidden cursor-grab active:cursor-grabbing rounded-2xl shadow-xl border-4 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-800 flex items-center justify-center p-2 w-full"
                style={{ maxHeight: '430px' }}
              >
                {resultDataUrl ? (
                  <img
                    src={resultDataUrl}
                    alt="Passport Output"
                    className="max-h-[390px] w-auto object-contain rounded-lg shadow-md"
                  />
                ) : (
                  <div className="p-12 text-center text-xs text-slate-500 animate-pulse">
                    Rendering passport photo with background replacement...
                  </div>
                )}
              </div>

              {/* Download Bar */}
              <div className="w-full flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={handleDownload}
                  disabled={!resultDataUrl || isProcessing}
                  className="flex-1 px-8 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {t.downloadResult} as {format === 'image/jpeg' ? 'JPG' : 'PNG'} ({resultSizeKb} KB @ 300 DPI)
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
          </div>
        )}
      </div>
    </div>
  );
};
