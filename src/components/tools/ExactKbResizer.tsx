import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  User,
  CheckCircle2,
  Download,
  Share2,
  FileText,
  Lightbulb,
  Crop,
  ShieldCheck,
  Sparkles,
  Info,
  RefreshCw,
  Upload,
  Sliders,
  Maximize2,
  Eye,
} from 'lucide-react';
import { compressImageToTargetKb, loadImageFromFile, CompressionResult } from '../../utils/imageCompressor';
import { generateSamplePortrait } from '../../utils/sampleImages';
import { PDFDocument } from 'pdf-lib';

type UnitType = 'px' | 'mm' | 'cm' | 'inch';

export const ExactKbResizer: React.FC = () => {
  const { setActiveTool, setMainTab, language, recordDownload } = useApp();

  // File & Preview State
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('passport_scan_raw.jpg');
  const [originalSizeMb, setOriginalSizeMb] = useState('2.4 MB');
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Target KB State
  const [targetKb, setTargetKb] = useState<number>(50);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/webp' | 'image/png'>('image/jpeg');

  // Custom Resolution & Unit State (px, mm, cm, inch)
  const [unit, setUnit] = useState<UnitType>('px');
  const [customResolutionEnabled, setCustomResolutionEnabled] = useState<boolean>(true);
  const [widthVal, setWidthVal] = useState<number>(350);
  const [heightVal, setHeightVal] = useState<number>(450);

  // Processing & Result State
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<CompressionResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert current width/height inputs to exact pixels for canvas (at 300 DPI)
  const getPixelDimensions = (): { pxWidth: number; pxHeight: number } => {
    const dpi = 300;
    if (unit === 'px') {
      return {
        pxWidth: Math.max(10, Math.round(widthVal)),
        pxHeight: Math.max(10, Math.round(heightVal)),
      };
    } else if (unit === 'cm') {
      return {
        pxWidth: Math.max(10, Math.round((widthVal / 2.54) * dpi)),
        pxHeight: Math.max(10, Math.round((heightVal / 2.54) * dpi)),
      };
    } else if (unit === 'mm') {
      return {
        pxWidth: Math.max(10, Math.round((widthVal / 25.4) * dpi)),
        pxHeight: Math.max(10, Math.round((heightVal / 25.4) * dpi)),
      };
    } else {
      // inch
      return {
        pxWidth: Math.max(10, Math.round(widthVal * dpi)),
        pxHeight: Math.max(10, Math.round(heightVal * dpi)),
      };
    }
  };

  // Switch units with sensible defaults
  const handleUnitChange = (newUnit: UnitType) => {
    if (newUnit === unit) return;
    if (newUnit === 'px') {
      setWidthVal(350);
      setHeightVal(450);
    } else if (newUnit === 'cm') {
      setWidthVal(3.5);
      setHeightVal(4.5);
    } else if (newUnit === 'mm') {
      setWidthVal(35);
      setHeightVal(45);
    } else if (newUnit === 'inch') {
      setWidthVal(1.38);
      setHeightVal(1.77);
    }
    setUnit(newUnit);
  };

  // Load Sample Portrait Demo
  const loadDemoImage = async () => {
    try {
      const demo = await generateSamplePortrait();
      setFile(demo);
      setFileName('passport_scan_raw.jpg');
      setOriginalSizeMb('2.4 MB');
      const url = URL.createObjectURL(demo);
      setPreviewUrl(url);
    } catch (err) {
      console.error('Failed to load demo portrait:', err);
    }
  };

  // Initialize with Sample Portrait on first load
  useEffect(() => {
    loadDemoImage();
  }, []);

  // Run Compression whenever file, targetKb, outputFormat, or dimensions change
  useEffect(() => {
    if (!file) return;

    let isCurrent = true;
    const runCompression = async () => {
      setIsProcessing(true);
      try {
        const img = await loadImageFromFile(file);
        if (!isCurrent) return;

        const { pxWidth, pxHeight } = customResolutionEnabled
          ? getPixelDimensions()
          : { pxWidth: img.naturalWidth || 350, pxHeight: img.naturalHeight || 450 };

        const res = await compressImageToTargetKb(img, {
          targetKb,
          outputFormat,
          dpi: 300,
          exactWidth: pxWidth,
          exactHeight: pxHeight,
        });

        if (isCurrent) {
          setResult(res);
        }
      } catch (err) {
        console.error('Compression failed:', err);
      } finally {
        if (isCurrent) {
          setIsProcessing(false);
        }
      }
    };

    runCompression();
    return () => {
      isCurrent = false;
    };
  }, [file, targetKb, outputFormat, unit, widthVal, heightVal, customResolutionEnabled]);

  // Handle Custom File Upload
  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setFileName(selectedFile.name);
    const mb = (selectedFile.size / (1024 * 1024)).toFixed(1);
    setOriginalSizeMb(`${mb} MB`);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
  };

  // Download Output Image
  const handleDownload = () => {
    if (!result) return;
    const ext = outputFormat === 'image/jpeg' ? 'jpg' : outputFormat === 'image/webp' ? 'webp' : 'png';
    const downloadName = `optimized_${targetKb}kb.${ext}`;

    // Record in local Downloads history
    recordDownload({
      name: downloadName,
      type: 'image',
      sizeKb: result.sizeKb,
      url: result.dataUrl,
    });

    // Check if Android Native bridge is present
    if ((window as any).AndroidBridge && typeof (window as any).AndroidBridge.saveBase64 === 'function') {
      (window as any).AndroidBridge.saveBase64(result.dataUrl, downloadName);
      return;
    }

    const a = document.createElement('a');
    a.href = result.dataUrl;
    a.download = downloadName;
    a.click();
  };

  // Share Output Image
  const handleShare = async () => {
    if (!result) return;
    const ext = outputFormat === 'image/jpeg' ? 'jpg' : outputFormat === 'image/webp' ? 'webp' : 'png';
    const shareName = `DocToolz_compressed_${targetKb}kb.${ext}`;

    // 1. Android Native Share Bridge
    if ((window as any).AndroidBridge && typeof (window as any).AndroidBridge.shareFile === 'function') {
      (window as any).AndroidBridge.shareFile(result.dataUrl, shareName);
      return;
    }

    // 2. Web Share API
    if (navigator.share) {
      try {
        const shareFile = new File([result.blob], shareName, { type: result.format });
        await navigator.share({
          title: 'Compressed Photo - DocToolz',
          text: `Compressed to ${result.sizeKb} KB with DocToolz`,
          files: [shareFile],
        });
        return;
      } catch (err) {
        console.warn('Web share cancelled or unsupported:', err);
      }
    }

    // Fallback: download
    handleDownload();
  };

  // Make PDF Page Action
  const handleMakePdf = async () => {
    if (!result) return;
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 Portrait

      const imgBytes = await result.blob.arrayBuffer();
      let pdfImage;
      if (result.format === 'image/png') {
        pdfImage = await pdfDoc.embedPng(imgBytes);
      } else {
        pdfImage = await pdfDoc.embedJpg(imgBytes);
      }

      // Draw photo centered on A4 sheet
      const imgWidth = 220;
      const imgHeight = (imgWidth * (result.height || 450)) / (result.width || 350);
      const x = (page.getWidth() - imgWidth) / 2;
      const y = (page.getHeight() - imgHeight) / 2;

      page.drawImage(pdfImage, {
        x,
        y,
        width: imgWidth,
        height: imgHeight,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const pdfName = `document_passport_${targetKb}kb.pdf`;

      // Record in local Downloads history
      recordDownload({
        name: pdfName,
        type: 'pdf',
        sizeKb: Math.round((blob.size / 1024) * 10) / 10,
        url,
      });

      const a = document.createElement('a');
      a.href = url;
      a.download = pdfName;
      a.click();
    } catch (err) {
      console.error('Make PDF failed:', err);
    }
  };

  const { pxWidth, pxHeight } = getPixelDimensions();

  return (
    <div className="max-w-md mx-auto px-4 py-3 pb-28 text-slate-900 dark:text-slate-100 transition-colors select-none">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
          }
        }}
      />

      {/* Screen Header (Sticky for smooth navigation) */}
      <div className="sticky top-0 z-30 bg-white/92 dark:bg-slate-950/92 backdrop-blur-md py-2.5 -mx-4 px-4 flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800">
        <button
          onClick={() => {
            setActiveTool(null);
            setMainTab('home');
          }}
          className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-850 flex items-center justify-center text-slate-700 dark:text-slate-200 active:scale-95 transition-transform cursor-pointer"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
          Photo Compression
        </h1>

        <button
          onClick={() => setMainTab('settings')}
          className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 relative cursor-pointer active:scale-95 transition-transform"
        >
          <User className="w-5 h-5" />
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 absolute top-0.5 right-0.5"></span>
        </button>
      </div>

      {/* 1. UPLOAD IMAGE CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5 truncate max-w-[200px]">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0">
              <Upload className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h3 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                Upload Image
              </h3>
              <p className="text-[10px] text-slate-400 truncate">{fileName}</p>
            </div>
          </div>

          {/* Try Demo Img Button */}
          <button
            onClick={loadDemoImage}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold border border-indigo-200/80 dark:border-indigo-800 transition-transform active:scale-95 cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Try Demo img</span>
          </button>
        </div>

        {/* Image Preview Box */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 aspect-[4/5] max-h-72 flex items-center justify-center group mb-2.5">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Source"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-center text-slate-400 p-4">
              <Upload className="w-10 h-10 mx-auto mb-2 text-slate-400" />
              <p className="text-xs font-semibold">Select an image to compress</p>
            </div>
          )}

          {/* Overlay dimension pill */}
          <div className="absolute bottom-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
            {pxWidth} × {pxHeight} px
          </div>

          {/* Tap to change image overlay */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 shadow-md active:scale-95 transition-transform cursor-pointer"
            title="Upload Different Image"
          >
            <Crop className="w-4 h-4" />
          </button>
        </div>

        {/* Footer info: original size and action */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
          <span>Original size: {originalSizeMb}</span>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
          >
            Browse new photo
          </button>
        </div>
      </div>

      {/* 2. CUSTOM RESOLUTION IN PIXEL, MM, CM, INCH */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-xs text-slate-900 dark:text-white">
              Custom Resolution
            </span>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={() => setCustomResolutionEnabled(!customResolutionEnabled)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
              customResolutionEnabled ? 'bg-blue-600 justify-end' : 'bg-slate-200 dark:bg-slate-700 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
          </button>
        </div>

        {customResolutionEnabled && (
          <div className="space-y-3 pt-1">
            {/* Unit Selector: Pixel, MM, CM, Inch */}
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              {[
                { id: 'px', label: 'Pixel (px)' },
                { id: 'mm', label: 'MM (mm)' },
                { id: 'cm', label: 'CM (cm)' },
                { id: 'inch', label: 'Inch (in)' },
              ].map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleUnitChange(u.id as UnitType)}
                  className={`py-1.5 rounded-xl text-[11px] font-bold text-center transition-all cursor-pointer ${
                    unit === u.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {u.label}
                </button>
              ))}
            </div>

            {/* Width and Height Numeric Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  Width ({unit})
                </label>
                <input
                  type="number"
                  step={unit === 'px' ? '1' : '0.1'}
                  value={widthVal}
                  onChange={(e) => setWidthVal(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  Height ({unit})
                </label>
                <input
                  type="number"
                  step={unit === 'px' ? '1' : '0.1'}
                  value={heightVal}
                  onChange={(e) => setHeightVal(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <p className="text-[10px] text-slate-400">
              Output will render at <strong>{pxWidth} × {pxHeight} px</strong> (300 DPI high clarity print).
            </p>
          </div>
        )}
      </div>

      {/* 3. TARGET FILE SIZE SLIDER */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs mb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Target File Size</h4>
            <p className="text-[10px] text-slate-400">Guaranteed upper threshold</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-sm font-black border border-blue-200/80 dark:border-blue-900">
            {targetKb} KB
          </span>
        </div>

        <input
          type="range"
          min="10"
          max="200"
          step="1"
          value={targetKb}
          onChange={(e) => setTargetKb(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
        />

        <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1.5">
          <span>10 KB (Strict)</span>
          <span>100 KB</span>
          <span>200 KB (Max)</span>
        </div>
      </div>

      {/* 4. OUTPUT FORMAT PILLS */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-xs text-slate-900 dark:text-white">Output Format</span>
          <span className="text-[10px] text-slate-400 font-semibold">Standard Compliant</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'image/jpeg', label: 'JPG' },
            { id: 'image/webp', label: 'WEBP' },
            { id: 'image/png', label: 'PNG' },
          ].map((fmt) => (
            <button
              key={fmt.id}
              onClick={() => setOutputFormat(fmt.id as any)}
              className={`py-2 rounded-2xl text-xs font-bold text-center transition-all cursor-pointer ${
                outputFormat === fmt.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80'
              }`}
            >
              {fmt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. OUTPUT PHOTO PREVIEW SECTION (NEW!) */}
      {result && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-500" />
              <span className="font-bold text-xs text-slate-900 dark:text-white">
                Output Photo Preview
              </span>
            </div>
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 text-[10px] font-bold">
              <CheckCircle2 className="w-3 h-3" />
              100% Portal Compliant
            </span>
          </div>

          <div className="flex gap-3">
            {/* Output Image thumbnail */}
            <div className="w-24 h-28 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
              <img
                src={result.dataUrl}
                alt="Compressed Output"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Output Stats Details */}
            <div className="flex-1 flex flex-col justify-around py-0.5 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">CALCULATED OUTPUT</span>
                <p className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                  {result.sizeKb} <span className="text-sm font-semibold">KB</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 text-[10px] font-bold">
                  {outputFormat === 'image/jpeg' ? 'JPG' : outputFormat === 'image/webp' ? 'WEBP' : 'PNG'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold">
                  {pxWidth} × {pxHeight} px
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-600 text-[10px] font-semibold">
                  300 DPI
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. PRIMARY DOWNLOAD CTA */}
      <button
        onClick={handleDownload}
        disabled={isProcessing || !result}
        className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mb-3"
      >
        <Download className="w-4 h-4" />
        <span>
          {isProcessing
            ? 'Optimizing Photo...'
            : `Download Optimized Image (${result ? result.sizeKb : targetKb} KB)`}
        </span>
      </button>

      {/* 7. SECONDARY ACTIONS: SHARE IMAGE & MAKE PDF PAGE */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {/* Share Image Button (Fixed to native Android share / Web Share) */}
        <button
          onClick={handleShare}
          disabled={!result}
          className="py-3 px-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-2xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/80"
        >
          <Share2 className="w-4 h-4 text-blue-600" />
          <span>Share Image</span>
        </button>

        {/* Make PDF Page Button */}
        <button
          onClick={handleMakePdf}
          disabled={!result}
          className="py-3 px-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-2xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/80"
        >
          <FileText className="w-4 h-4 text-indigo-600" />
          <span>Make PDF Page</span>
        </button>
      </div>

      {/* Privacy guarantee note */}
      <div className="p-3 rounded-2xl bg-blue-50/60 dark:bg-slate-800/60 border border-blue-100/70 dark:border-slate-800 flex items-center gap-2.5">
        <Lightbulb className="w-4 h-4 text-blue-600 shrink-0" />
        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
          Files stay 100% on your device. Zero cloud uploads guarantee privacy and offline readiness.
        </p>
      </div>
    </div>
  );
};
