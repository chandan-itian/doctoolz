import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { Dropzone } from '../common/Dropzone';
import { loadImageFromFile } from '../../utils/imageCompressor';
import { setJpegDpi } from '../../utils/dpiModifier';
import { generateSamplePortrait } from '../../utils/sampleImages';
import { fireConfetti } from '../common/Celebration';
import { Download, RefreshCw, ZoomIn, ZoomOut, Move, ArrowLeft, Grid, Printer } from 'lucide-react';

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
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [addBorder, setAddBorder] = useState<boolean>(true);
  const [sheetMode, setSheetMode] = useState<SheetMode>('single');
  const [includeNameDop, setIncludeNameDop] = useState<boolean>(false);
  const [candidateName, setCandidateName] = useState<string>('');
  const [dop, setDop] = useState<string>('');

  const [resultDataUrl, setResultDataUrl] = useState<string | null>(null);
  const [resultSizeKb, setResultSizeKb] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

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

  // Render passport photo / print sheet onto offscreen canvas
  const renderOutput = useCallback(async () => {
    if (!loadedImg) return;
    setIsProcessing(true);

    const { width: pWidth, height: pHeight } = getSinglePhotoDimensions();

    // 1. Render single cropped photo canvas
    const singleCanvas = document.createElement('canvas');
    singleCanvas.width = pWidth;
    singleCanvas.height = pHeight;
    const sCtx = singleCanvas.getContext('2d')!;

    // Fill chosen background color
    sCtx.fillStyle = bgColor;
    sCtx.fillRect(0, 0, pWidth, pHeight);

    // Calculate aspect fill for image inside canvas
    sCtx.save();
    // Center of canvas
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

    // Optional Name & DOP (Date of Photo) bar at bottom
    if (includeNameDop && (candidateName.trim() || dop.trim())) {
      const bannerHeight = Math.round(pHeight * 0.16);
      sCtx.fillStyle = '#ffffff';
      sCtx.fillRect(0, pHeight - bannerHeight, pWidth, bannerHeight);
      sCtx.fillStyle = '#000000';
      sCtx.textAlign = 'center';

      if (candidateName.trim() && dop.trim()) {
        sCtx.font = 'bold 16px Inter, sans-serif';
        sCtx.fillText(candidateName.toUpperCase(), pWidth / 2, pHeight - bannerHeight + 22);
        sCtx.font = '14px Inter, sans-serif';
        sCtx.fillText(`DOP: ${dop}`, pWidth / 2, pHeight - bannerHeight + 46);
      } else {
        sCtx.font = 'bold 18px Inter, sans-serif';
        sCtx.fillText((candidateName || dop).toUpperCase(), pWidth / 2, pHeight - bannerHeight + 32);
      }
    }

    // 1px black border
    if (addBorder) {
      sCtx.strokeStyle = '#000000';
      sCtx.lineWidth = 2;
      sCtx.strokeRect(1, 1, pWidth - 2, pHeight - 2);
    }

    let finalCanvas = singleCanvas;

    // 2. If sheet mode requested, layout on printable sheet at 300 DPI
    if (sheetMode !== 'single') {
      const sheetCanvas = document.createElement('canvas');
      const shCtx = sheetCanvas.getContext('2d')!;

      if (sheetMode === 'sheet4' || sheetMode === 'sheet8') {
        // Standard 4x6 inch photo paper at 300 DPI = 1200 x 1800 px (or 1800 x 1200)
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

            // Light scissor cut marks
            shCtx.strokeStyle = '#e2e8f0';
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

    // Convert to JPEG blob and inject 300 DPI JFIF metadata
    finalCanvas.toBlob(
      async (blob) => {
        if (!blob) return;
        const arrayBuf = await blob.arrayBuffer();
        const with300Dpi = setJpegDpi(new Uint8Array(arrayBuf), 300);
        const finalBlob = new Blob([with300Dpi as unknown as BlobPart], { type: 'image/jpeg' });
        const sizeKb = Math.round((finalBlob.size / 1024) * 10) / 10;
        setResultSizeKb(sizeKb);
        setResultDataUrl(URL.createObjectURL(finalBlob));
        setIsProcessing(false);
      },
      'image/jpeg',
      0.95
    );
  }, [loadedImg, getSinglePhotoDimensions, bgColor, panX, panY, zoom, includeNameDop, candidateName, dop, addBorder, sheetMode]);

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

  const handleDownload = () => {
    if (!resultDataUrl) return;
    fireConfetti();
    const a = document.createElement('a');
    a.href = resultDataUrl;
    const typeLabel = sheetMode === 'single' ? 'passport-300dpi' : `${sheetMode}-print-sheet`;
    a.download = `doctoolz-${typeLabel}.jpg`;
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

              {/* Background Color & Border */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {t.passportTab.bgColor}
                </label>
                <div className="flex items-center gap-3">
                  {[
                    { color: '#ffffff', name: t.passportTab.white },
                    { color: '#e0f2fe', name: t.passportTab.lightBlue },
                    { color: '#1e3a8a', name: t.passportTab.navyBlue },
                    { color: '#f1f5f9', name: t.passportTab.lightGray },
                  ].map((bg) => (
                    <button
                      key={bg.color}
                      onClick={() => setBgColor(bg.color)}
                      title={bg.name}
                      className={`w-9 h-9 rounded-full border-2 transition-transform ${
                        bgColor === bg.color ? 'border-indigo-600 scale-110 shadow-md' : 'border-slate-300 dark:border-slate-600'
                      }`}
                      style={{ backgroundColor: bg.color }}
                    />
                  ))}
                </div>

                <label className="flex items-center gap-2 pt-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addBorder}
                    onChange={(e) => setAddBorder(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{t.passportTab.addBorder}</span>
                </label>
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

              {/* Name & DOP Stamp (SSC / UPSC) */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeNameDop}
                    onChange={(e) => setIncludeNameDop(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Candidate Name & Date of Photo (DOP)</span>
                </label>
                {includeNameDop && (
                  <div className="space-y-2 pt-2">
                    <input
                      type="text"
                      placeholder="Candidate Name (e.g. AMIT KUMAR)"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    />
                    <input
                      type="text"
                      placeholder="DOP (e.g. 28-10-2026)"
                      value={dop}
                      onChange={(e) => setDop(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Preview & Adjustment Column */}
            <div className="lg:col-span-7 flex flex-col items-center justify-between space-y-6">
              {/* Interactive Zoom / Pan Controls */}
              <div className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                <div className="flex items-center gap-2">
                  <Move className="w-4 h-4 text-indigo-500" />
                  <span className="text-slate-600 dark:text-slate-400">Click & Drag photo to reposition</span>
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
                className="relative overflow-hidden cursor-grab active:cursor-grabbing rounded-2xl shadow-xl border-4 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-800 flex items-center justify-center p-2"
                style={{ maxHeight: '420px' }}
              >
                {resultDataUrl ? (
                  <img
                    src={resultDataUrl}
                    alt="Passport Output"
                    className="max-h-[380px] w-auto object-contain rounded-lg shadow-md"
                  />
                ) : (
                  <div className="p-12 text-center text-xs text-slate-500 animate-pulse">
                    Rendering passport photo...
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
                    {t.downloadResult} ({resultSizeKb} KB @ 300 DPI)
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
