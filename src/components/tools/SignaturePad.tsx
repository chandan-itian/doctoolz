import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ToolHeader } from '../common/ToolHeader';
import { Pen, Download, RotateCcw, Trash2, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SignaturePad: React.FC = () => {
  const { t, language } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState<string>('#000000');
  const [lineWidth, setLineWidth] = useState<number>(3);
  const [bgType, setBgType] = useState<'transparent' | 'white'>('transparent');
  const [history, setHistory] = useState<ImageData[]>([]);
  const [hasContent, setHasContent] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high resolution for canvas
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save history for undo
    const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-10), currentData]);

    setIsDrawing(true);
    setHasContent(true);

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = lineWidth;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
  };

  const undo = () => {
    const canvas = canvasRef.current;
    if (!canvas || history.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const previous = history[history.length - 1];
    ctx.putImageData(previous, 0, 0);
    setHistory((prev) => prev.slice(0, -1));
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHistory([]);
    setHasContent(false);
  };

  const loadDemoSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    clearCanvas();
    ctx.strokeStyle = penColor;
    ctx.lineWidth = lineWidth * 1.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(80, 150);
    ctx.bezierCurveTo(120, 80, 160, 60, 200, 140);
    ctx.bezierCurveTo(240, 210, 260, 120, 310, 110);
    ctx.bezierCurveTo(360, 100, 370, 180, 420, 130);
    ctx.bezierCurveTo(460, 90, 490, 140, 520, 120);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(110, 180);
    ctx.bezierCurveTo(250, 190, 390, 175, 500, 180);
    ctx.stroke();

    setHasContent(true);
  };

  const downloadSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasContent) return;

    // Create export canvas to apply white or transparent background
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const exportCtx = exportCanvas.getContext('2d');
    if (!exportCtx) return;

    if (bgType === 'white') {
      exportCtx.fillStyle = '#FFFFFF';
      exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    }

    exportCtx.drawImage(canvas, 0, 0);

    const format = bgType === 'transparent' ? 'image/png' : 'image/jpeg';
    const dataUrl = exportCanvas.toDataURL(format, 0.95);

    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `signature_${bgType === 'transparent' ? 'transparent.png' : 'white.jpg'}`;
    a.click();

    confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolHeader
        title={t.tools.signaturePad.name}
        badge={t.tools.signaturePad.badge}
        description={t.tools.signaturePad.desc}
        icon={Pen}
        iconGradient="from-indigo-600 to-blue-700"
      />

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          {/* Colors */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Pen Color:</span>
            {[
              { color: '#000000', label: 'Black' },
              { color: '#002B7F', label: 'Blue' },
              { color: '#C00000', label: 'Red' },
            ].map((p) => (
              <button
                key={p.color}
                onClick={() => setPenColor(p.color)}
                style={{ backgroundColor: p.color }}
                className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                  penColor === p.color
                    ? 'border-blue-500 scale-110 shadow-sm'
                    : 'border-white dark:border-slate-800'
                }`}
                title={p.label}
              />
            ))}
          </div>

          {/* Stroke Width */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-slate-500">Thickness:</span>
            {[2, 3, 4, 6].map((w) => (
              <button
                key={w}
                onClick={() => setLineWidth(w)}
                className={`px-2.5 py-1 rounded-lg border font-medium ${
                  lineWidth === w
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {w}px
              </button>
            ))}
          </div>

          {/* Background Toggle */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-slate-500">Background:</span>
            <button
              onClick={() => setBgType('transparent')}
              className={`px-2.5 py-1 rounded-lg border font-medium ${
                bgType === 'transparent'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              Transparent PNG
            </button>
            <button
              onClick={() => setBgType('white')}
              className={`px-2.5 py-1 rounded-lg border font-medium ${
                bgType === 'white'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              White JPG
            </button>
          </div>
        </div>

        {/* Signature Drawing Area */}
        <div className="relative rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-950">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-72 touch-none cursor-crosshair"
          />

          {!hasContent && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-400 text-sm font-medium">
              ✍️ {language === 'hi' ? 'यहाँ माउस या उंगली से साइन करें' : 'Sign here using mouse or touch'}
            </div>
          )}

          {/* Guide Line */}
          <div className="absolute bottom-12 left-10 right-10 border-b border-slate-300 dark:border-slate-700/60 pointer-events-none"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={undo}
              disabled={history.length === 0}
              className="px-3.5 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-40"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Undo</span>
            </button>
            <button
              onClick={clearCanvas}
              disabled={!hasContent}
              className="px-3.5 py-2 text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
            <button
              onClick={loadDemoSignature}
              className="px-3.5 py-2 text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded-xl flex items-center gap-1.5 transition-colors border border-indigo-200 dark:border-indigo-800"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>{language === 'hi' ? '✨ डेमो सिग्नेचर भरें' : '✨ Try Demo Signature'}</span>
            </button>
          </div>

          <button
            onClick={downloadSignature}
            disabled={!hasContent}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-40"
          >
            <Download className="w-4 h-4" />
            <span>
              {language === 'hi'
                ? `सिग्नेचर डाउनलोड करें (${bgType === 'transparent' ? 'PNG' : 'JPG'})`
                : `Download Signature (${bgType.toUpperCase()})`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
