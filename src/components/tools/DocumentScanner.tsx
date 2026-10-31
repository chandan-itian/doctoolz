import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Scan,
  Camera,
  Upload,
  Download,
  FileText,
  RotateCw,
  Sparkles,
  CheckCircle2,
  Trash2,
  Plus,
  Palette,
  Eye,
  Sliders,
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { generateSamplePortrait } from '../../utils/sampleImages';

type ScannerFilter = 'clean' | 'bw' | 'grayscale' | 'vibrant' | 'warm' | 'highContrast';

interface ScannedPage {
  id: string;
  originalUrl: string;
  processedUrl: string;
  rotation: number;
}

export const DocumentScanner: React.FC = () => {
  const { setActiveTool, language, recordDownload } = useApp();
  const [pages, setPages] = useState<ScannedPage[]>([]);
  const [filterMode, setFilterMode] = useState<ScannerFilter>('clean');
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Apply chosen filter to an image URL on an offscreen canvas
  const applyFilterToImage = (dataUrl: string, filter: ScannerFilter, rotationDeg: number = 0): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        if (rotationDeg % 180 !== 0) {
          canvas.width = img.height;
          canvas.height = img.width;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        if (rotationDeg !== 0) {
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((rotationDeg * Math.PI) / 180);
          ctx.drawImage(img, -img.width / 2, -img.height / 2);
        } else {
          ctx.drawImage(img, 0, 0);
        }

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imgData.data;

        for (let i = 0; i < d.length; i += 4) {
          const r = d[i];
          const g = d[i + 1];
          const b = d[i + 2];
          const avg = 0.299 * r + 0.587 * g + 0.114 * b;

          if (filter === 'clean') {
            // Magic Clean: Boost whites, deepen ink
            const boosted = avg > 170 ? 255 : avg < 90 ? Math.max(0, avg * 0.7) : (avg - 90) * 1.6;
            d[i] = Math.min(255, Math.max(0, boosted));
            d[i + 1] = Math.min(255, Math.max(0, boosted));
            d[i + 2] = Math.min(255, Math.max(0, boosted));
          } else if (filter === 'bw') {
            // Strict Binary Black & White (Text Document Scan)
            const val = avg > 140 ? 255 : 0;
            d[i] = val;
            d[i + 1] = val;
            d[i + 2] = val;
          } else if (filter === 'grayscale') {
            // Smooth Grayscale
            d[i] = avg;
            d[i + 1] = avg;
            d[i + 2] = avg;
          } else if (filter === 'vibrant') {
            // Vibrant Document Color: enhance saturation and contrast
            d[i] = Math.min(255, r * 1.15);
            d[i + 1] = Math.min(255, g * 1.15);
            d[i + 2] = Math.min(255, b * 1.15);
          } else if (filter === 'warm') {
            // Warm Tone (Notes & Book Reading Mode)
            d[i] = Math.min(255, avg * 1.08 + 15);
            d[i + 1] = Math.min(255, avg * 1.02 + 8);
            d[i + 2] = Math.min(255, avg * 0.88);
          } else if (filter === 'highContrast') {
            // High Contrast for faded ink/stamps
            const hc = avg > 128 ? Math.min(255, (avg - 128) * 2 + 128) : Math.max(0, avg * 0.7);
            d[i] = hc;
            d[i + 1] = hc;
            d[i + 2] = hc;
          }
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.92));
      };
    });
  };

  // Re-process all pages when filterMode changes
  useEffect(() => {
    let active = true;
    const reapply = async () => {
      const updated = await Promise.all(
        pages.map(async (p) => {
          const processed = await applyFilterToImage(p.originalUrl, filterMode, p.rotation);
          return { ...p, processedUrl: processed };
        })
      );
      if (active) setPages(updated);
    };
    if (pages.length > 0) {
      reapply();
    }
    return () => {
      active = false;
    };
  }, [filterMode]);

  // Load a sample document page initially if empty
  const loadSampleDoc = async () => {
    try {
      const demo = await generateSamplePortrait();
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          const originalUrl = e.target.result as string;
          const processedUrl = await applyFilterToImage(originalUrl, filterMode, 0);
          setPages([
            {
              id: 'demo-1',
              originalUrl,
              processedUrl,
              rotation: 0,
            },
          ]);
        }
      };
      reader.readAsDataURL(demo);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadSampleDoc();
  }, []);

  const handleFilesAdded = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      files.forEach((f) => {
        const reader = new FileReader();
        reader.onload = async (loadEv) => {
          if (loadEv.target?.result) {
            const originalUrl = loadEv.target.result as string;
            const processedUrl = await applyFilterToImage(originalUrl, filterMode, 0);
            setPages((prev) => [
              ...prev,
              {
                id: Math.random().toString(36).substring(7),
                originalUrl,
                processedUrl,
                rotation: 0,
              },
            ]);
          }
        };
        reader.readAsDataURL(f);
      });
    }
  };

  const removePage = (id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
  };

  const rotatePage = async (index: number) => {
    const page = pages[index];
    if (!page) return;
    const newRot = (page.rotation + 90) % 360;
    const newProcessed = await applyFilterToImage(page.originalUrl, filterMode, newRot);
    setPages((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], rotation: newRot, processedUrl: newProcessed };
      return copy;
    });
  };

  // Generate and Download PDF
  const downloadAsPdf = async () => {
    if (pages.length === 0) return;
    setIsProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();

      for (const page of pages) {
        const jpegBytes = await fetch(page.processedUrl).then((r) => r.arrayBuffer());
        const embeddedImg = await pdfDoc.embedJpg(jpegBytes);
        const pdfPage = pdfDoc.addPage([embeddedImg.width, embeddedImg.height]);
        pdfPage.drawImage(embeddedImg, {
          x: 0,
          y: 0,
          width: embeddedImg.width,
          height: embeddedImg.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const pdfName = `DocToolz_Scanned_${Date.now()}.pdf`;

      // Record in local Downloads history
      recordDownload({
        name: pdfName,
        type: 'pdf',
        sizeKb: Math.round((blob.size / 1024) * 10) / 10,
        url,
      });

      // Android Native Bridge save
      if ((window as any).AndroidBridge && typeof (window as any).AndroidBridge.saveBase64 === 'function') {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            (window as any).AndroidBridge.saveBase64(reader.result as string, pdfName);
          }
        };
        reader.readAsDataURL(blob);
      } else {
        const a = document.createElement('a');
        a.href = url;
        a.download = pdfName;
        a.click();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-3 pb-28 text-slate-900 dark:text-slate-100 select-none">
      {/* Hidden File Inputs: Camera & File Browser */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFilesAdded}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFilesAdded}
      />

      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/92 dark:bg-slate-950/92 backdrop-blur-md py-2.5 -mx-4 px-4 flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800">
        <button
          onClick={() => setActiveTool(null)}
          className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-850 flex items-center justify-center text-slate-700 dark:text-slate-200 active:scale-95 transition-transform cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Scan className="w-5 h-5 text-teal-600" />
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
            Document Scanner
          </h2>
        </div>
        <div className="w-10"></div>
      </div>

      {/* Dual Capture Action Buttons: Open Camera vs Browse Files */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {/* Open Camera */}
        <button
          onClick={() => cameraInputRef.current?.click()}
          className="py-3.5 px-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-teal-500/25 active:scale-95 transition-all cursor-pointer"
        >
          <Camera className="w-4 h-4" />
          <span>Take Picture (Camera)</span>
        </button>

        {/* Browse Files */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="py-3.5 px-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-850 active:scale-95 transition-all cursor-pointer"
        >
          <Upload className="w-4 h-4 text-teal-600" />
          <span>Browse Files</span>
        </button>
      </div>

      {/* Try Demo Document banner */}
      <div className="flex items-center justify-between p-2.5 px-3.5 rounded-2xl bg-teal-50/70 dark:bg-slate-900 border border-teal-100 dark:border-slate-800 mb-4">
        <span className="text-[11px] text-teal-800 dark:text-teal-300 font-medium">
          Instant test document scanner
        </span>
        <button
          onClick={loadSampleDoc}
          className="flex items-center gap-1 text-[11px] font-bold text-teal-700 dark:text-teal-400 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-full border border-teal-200 dark:border-slate-700 active:scale-95"
        >
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Try Demo Doc</span>
        </button>
      </div>

      {/* Scanner Filters (Magic Clean, Black & White, Grayscale, Vibrant, Warm, High Contrast) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs mb-4">
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
          Scanner Filters
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'clean', label: 'Magic Clean' },
            { id: 'bw', label: 'Black & White' },
            { id: 'grayscale', label: 'Grayscale' },
            { id: 'vibrant', label: 'Vibrant Color' },
            { id: 'warm', label: 'Warm Tone' },
            { id: 'highContrast', label: 'High Contrast' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterMode(f.id as ScannerFilter)}
              className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
                filterMode === f.id
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scanned Pages Preview Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Document Pages ({pages.length})
          </span>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 text-[11px] font-bold text-teal-600 bg-teal-50 dark:bg-teal-950 px-2.5 py-1 rounded-xl cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add More</span>
          </button>
        </div>

        {pages.length === 0 ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center cursor-pointer hover:border-teal-400"
          >
            <Scan className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
              No pages captured yet
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Tap Take Picture or Browse Files above
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {pages.map((p, idx) => (
              <div
                key={p.id}
                className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 group"
              >
                <img
                  src={p.processedUrl}
                  alt={`Page ${idx + 1}`}
                  className="w-full h-40 object-contain bg-slate-100 dark:bg-slate-800 p-1"
                />
                <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold">
                  P.{idx + 1}
                </div>
                <div className="absolute top-1.5 right-1.5 flex gap-1">
                  <button
                    onClick={() => rotatePage(idx)}
                    className="p-1.5 bg-white/90 dark:bg-slate-900/90 rounded-full text-slate-700 dark:text-slate-200 shadow-xs cursor-pointer active:scale-90"
                    title="Rotate 90°"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removePage(p.id)}
                    className="p-1.5 bg-red-500 text-white rounded-full shadow-xs cursor-pointer active:scale-90"
                    title="Remove Page"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Convert into PDF Download CTA */}
      <button
        onClick={downloadAsPdf}
        disabled={pages.length === 0 || isProcessing}
        className="w-full py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        <Download className="w-4 h-4" />
        <span>
          {isProcessing
            ? 'Generating Clean PDF...'
            : `Convert & Download PDF (${pages.length} Pages)`}
        </span>
      </button>
    </div>
  );
};
