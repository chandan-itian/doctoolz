import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ToolHeader } from '../common/ToolHeader';
import { Crop, Upload, Download, RotateCw, FlipHorizontal, FlipVertical, RefreshCw, CheckCircle2 } from 'lucide-react';
import { cropAndExportImage, CropArea, AspectRatioOption } from '../../utils/cropEngine';
import confetti from 'canvas-confetti';

export const ImageCropper: React.FC = () => {
  const { t, language } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [aspect, setAspect] = useState<AspectRatioOption>('1:1');
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  // Normalized crop area (0 to 1 scale)
  const [cropNorm, setCropNorm] = useState<{ x: number; y: number; w: number; h: number }>({
    x: 0.1,
    y: 0.1,
    w: 0.8,
    h: 0.8,
  });

  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultInfo, setResultInfo] = useState<{ width: number; height: number; sizeKb: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type.startsWith('image/')) {
      setFile(selected);
      const url = URL.createObjectURL(selected);
      const img = new Image();
      img.onload = () => {
        setImageElement(img);
        // Default square centered crop
        const minSide = Math.min(img.width, img.height);
        const w = (minSide * 0.8) / img.width;
        const h = (minSide * 0.8) / img.height;
        setCropNorm({ x: (1 - w) / 2, y: (1 - h) / 2, w, h });
      };
      img.src = url;
    }
  };

  // Re-export cropped image whenever cropNorm, aspect, rotation, or flip changes
  useEffect(() => {
    if (!imageElement) return;

    const realCrop: CropArea = {
      x: cropNorm.x * imageElement.width,
      y: cropNorm.y * imageElement.height,
      width: cropNorm.w * imageElement.width,
      height: cropNorm.h * imageElement.height,
    };

    cropAndExportImage(imageElement, realCrop, {
      isCircle: aspect === 'circle',
      rotation,
      flipH,
      flipV,
      format: aspect === 'circle' ? 'image/png' : 'image/jpeg',
    })
      .then((res) => {
        setPreviewDataUrl(res.dataUrl);
        setResultBlob(res.blob);
        setResultInfo({ width: res.width, height: res.height, sizeKb: res.sizeKb });
      })
      .catch((err) => console.error('Crop error:', err));
  }, [imageElement, cropNorm, aspect, rotation, flipH, flipV]);

  const changeAspect = (newAspect: AspectRatioOption) => {
    setAspect(newAspect);
    if (!imageElement) return;

    const imgAspect = imageElement.width / imageElement.height;
    let targetRatio = 1;

    if (newAspect === '1:1' || newAspect === 'circle') targetRatio = 1;
    else if (newAspect === '3:4') targetRatio = 3 / 4;
    else if (newAspect === '4:3') targetRatio = 4 / 3;
    else if (newAspect === '16:9') targetRatio = 16 / 9;
    else return; // free

    // Adjust cropNorm to match aspect
    let w = 0.8;
    let h = (w * imgAspect) / targetRatio;
    if (h > 0.9) {
      h = 0.8;
      w = (h * targetRatio) / imgAspect;
    }

    setCropNorm({
      x: Math.max(0, (1 - w) / 2),
      y: Math.max(0, (1 - h) / 2),
      w,
      h,
    });
  };

  const handleDownload = () => {
    if (!previewDataUrl || !file) return;
    const a = document.createElement('a');
    a.href = previewDataUrl;
    const name = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const ext = aspect === 'circle' ? 'png' : 'jpg';
    a.download = `${name}_cropped.${ext}`;
    a.click();
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <ToolHeader
        title={t.tools.imageCropper.name}
        badge={t.tools.imageCropper.badge}
        description={t.tools.imageCropper.desc}
        icon={Crop}
        iconGradient="from-fuchsia-600 to-purple-700"
      />

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {!file ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-purple-500 rounded-2xl p-10 text-center cursor-pointer transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <Upload className="w-8 h-8" />
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-100 text-base mb-1">
              {language === 'hi' ? 'फोटो अपलोड करें जिसे क्रॉप करना है' : 'Upload Image to Crop'}
            </p>
            <p className="text-xs text-slate-400">JPG, PNG, WebP • Free, 1:1, 3:4, or Circle Cut</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Left Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold">Cropped Output Preview</span>
                <button
                  onClick={() => setFile(null)}
                  className="text-purple-600 hover:underline"
                >
                  Change Image
                </button>
              </div>

              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center p-3">
                {previewDataUrl ? (
                  <img
                    src={previewDataUrl}
                    alt="Cropped Preview"
                    className={`max-h-full max-w-full object-contain ${
                      aspect === 'circle' ? 'rounded-full' : 'rounded-lg'
                    } shadow-md`}
                  />
                ) : (
                  <RefreshCw className="w-8 h-8 animate-spin text-slate-400" />
                )}
              </div>

              {resultInfo && (
                <div className="flex justify-between text-xs text-slate-500 px-1">
                  <span>Dimensions: {resultInfo.width} × {resultInfo.height} px</span>
                  <span>Size: {resultInfo.sizeKb} KB</span>
                </div>
              )}

              <button
                onClick={handleDownload}
                disabled={!previewDataUrl}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Download className="w-4 h-4" />
                <span>
                  Download {aspect === 'circle' ? 'Circle Photo (PNG)' : 'Cropped Photo'}
                </span>
              </button>
            </div>

            {/* Right Controls */}
            <div className="space-y-5">
              {/* Aspect Ratio Options */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Crop Aspect Ratio (अनुपात चुनें):
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                  {[
                    { id: '1:1', label: '1:1 Square (Admit Card)' },
                    { id: 'circle', label: '⭕ Circle Cut (Avatar)' },
                    { id: '3:4', label: '3:4 Passport Portrait' },
                    { id: '4:3', label: '4:3 Standard' },
                    { id: '16:9', label: '16:9 Landscape' },
                    { id: 'free', label: 'Free Aspect' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => changeAspect(item.id as AspectRatioOption)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        aspect === item.id
                          ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-purple-400'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transformations (Rotate / Flip) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Rotate & Flip:
                </label>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    onClick={() => setRotation((prev) => (prev + 90) % 360)}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 hover:border-purple-500"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Rotate 90° ({rotation}°)</span>
                  </button>
                  <button
                    onClick={() => setFlipH((prev) => !prev)}
                    className={`px-3.5 py-2 rounded-xl border flex items-center gap-1.5 ${
                      flipH
                        ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 border-purple-400'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <FlipHorizontal className="w-3.5 h-3.5" />
                    <span>Flip H</span>
                  </button>
                  <button
                    onClick={() => setFlipV((prev) => !prev)}
                    className={`px-3.5 py-2 rounded-xl border flex items-center gap-1.5 ${
                      flipV
                        ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 border-purple-400'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <FlipVertical className="w-3.5 h-3.5" />
                    <span>Flip V</span>
                  </button>
                </div>
              </div>

              {/* Zoom / Size Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  <span>Crop Area Size:</span>
                  <span>{Math.round(cropNorm.w * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={cropNorm.w}
                  onChange={(e) => {
                    const w = parseFloat(e.target.value);
                    const h = aspect === 'circle' || aspect === '1:1' ? w : (w * 3) / 4;
                    setCropNorm({
                      x: Math.max(0, (1 - w) / 2),
                      y: Math.max(0, (1 - h) / 2),
                      w,
                      h: Math.min(1, h),
                    });
                  }}
                  className="w-full"
                />
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800 text-xs text-purple-800 dark:text-purple-300 leading-relaxed">
                💡 <strong>Circle Cut Feature:</strong> यदि आप "Circle Cut" चुनते हैं, तो फोटो गोल कटिंग के साथ PNG फॉर्मेट में डाउनलोड होगी जिसमें कोनों पर 100% पारदर्शी (Transparent) बैकग्राउंड रहेगा।
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
