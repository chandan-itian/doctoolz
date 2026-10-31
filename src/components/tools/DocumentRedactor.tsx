import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ToolHeader } from '../common/ToolHeader';
import { EyeOff, Upload, Download, RotateCcw, Trash2, Check, Shield } from 'lucide-react';
import { applyRedactionsToCanvas, RedactionRect } from '../../utils/redactorEngine';
import confetti from 'canvas-confetti';

export const DocumentRedactor: React.FC = () => {
  const { t, language } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [maskType, setMaskType] = useState<'blackout' | 'pixelate' | 'blur'>('blackout');
  const [redactions, setRedactions] = useState<RedactionRect[]>([]);

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [currentRect, setCurrentRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type.startsWith('image/')) {
      setFile(selected);
      const url = URL.createObjectURL(selected);
      const img = new Image();
      img.onload = () => {
        setImageElement(img);
        setRedactions([]);
      };
      img.src = url;
    }
  };

  // Re-render canvas whenever image or redactions change
  useEffect(() => {
    if (!imageElement || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;

    const rendered = applyRedactionsToCanvas(imageElement, redactions);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(rendered, 0, 0);

    // Draw active drawing rect
    if (currentRect && isDrawing) {
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 6]);
      ctx.strokeRect(currentRect.x, currentRect.y, currentRect.w, currentRect.h);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.fillRect(currentRect.x, currentRect.y, currentRect.w, currentRect.h);
    }
  }, [imageElement, redactions, currentRect, isDrawing]);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    setIsDrawing(true);
    setStartPos(coords);
    setCurrentRect({ x: coords.x, y: coords.y, w: 0, h: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos) return;
    const coords = getCanvasCoords(e);
    const x = Math.min(startPos.x, coords.x);
    const y = Math.min(startPos.y, coords.y);
    const w = Math.abs(coords.x - startPos.x);
    const h = Math.abs(coords.y - startPos.y);
    setCurrentRect({ x, y, w, h });
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentRect) return;
    if (currentRect.w > 5 && currentRect.h > 5) {
      const newRedaction: RedactionRect = {
        id: Math.random().toString(),
        x: currentRect.x,
        y: currentRect.y,
        width: currentRect.w,
        height: currentRect.h,
        type: maskType,
      };
      setRedactions((prev) => [...prev, newRedaction]);
    }
    setIsDrawing(false);
    setStartPos(null);
    setCurrentRect(null);
  };

  const handleDownload = () => {
    if (!canvasRef.current || !file) return;
    const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.95);
    const a = document.createElement('a');
    a.href = dataUrl;
    const name = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    a.download = `${name}_redacted.jpg`;
    a.click();
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <ToolHeader
        title={t.tools.documentRedactor.name}
        badge={t.tools.documentRedactor.badge}
        description={t.tools.documentRedactor.desc}
        icon={EyeOff}
        iconGradient="from-slate-700 to-zinc-900"
      />

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {!file ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-500 rounded-2xl p-10 text-center cursor-pointer transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
              <Upload className="w-8 h-8" />
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-100 text-base mb-1">
              {language === 'hi' ? 'दस्तावेज़ की इमेज अपलोड करें' : 'Upload Document to Redact'}
            </p>
            <p className="text-xs text-slate-400">
              {language === 'hi' ? 'आधार नंबर, फ़ोन नंबर या हस्ताक्षर छिपाएं' : 'Hide Aadhaar number, phone, address, or QR code'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Mask Type:
                </span>
                <button
                  onClick={() => setMaskType('blackout')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    maskType === 'blackout'
                      ? 'bg-black text-white border-black'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Blackout Box
                </button>
                <button
                  onClick={() => setMaskType('pixelate')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    maskType === 'pixelate'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Pixelate Mosaic
                </button>
                <button
                  onClick={() => setMaskType('blur')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    maskType === 'blur'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Blur
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRedactions((prev) => prev.slice(0, -1))}
                  disabled={redactions.length === 0}
                  className="px-3 py-1.5 text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg flex items-center gap-1 disabled:opacity-40"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Undo</span>
                </button>
                <button
                  onClick={() => setRedactions([])}
                  disabled={redactions.length === 0}
                  className="px-3 py-1.5 text-xs bg-rose-100 dark:bg-rose-950 text-rose-600 rounded-lg flex items-center gap-1 disabled:opacity-40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="px-4 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg flex items-center gap-1.5 shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Redacted ({redactions.length} Masked)</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              💡 Drag with mouse/touch over the sensitive part of your document to redact it.
            </p>

            {/* Canvas Area */}
            <div className="relative rounded-xl overflow-auto border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex justify-center p-2 max-h-[65vh]">
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                className="max-w-full h-auto cursor-crosshair rounded shadow"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
