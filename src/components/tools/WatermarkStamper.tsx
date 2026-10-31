import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ToolHeader } from '../common/ToolHeader';
import { ShieldAlert, Upload, Download, RefreshCw, Eye } from 'lucide-react';
import { applyWatermarkToImage, WatermarkOptions } from '../../utils/watermarkEngine';
import confetti from 'canvas-confetti';

export const WatermarkStamper: React.FC = () => {
  const { t, language } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [watermarkedUrl, setWatermarkedUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [options, setOptions] = useState<WatermarkOptions>({
    text: 'FOR VERIFICATION ONLY - DO NOT MISUSE',
    subText: '',
    opacity: 0.28,
    fontSize: 28,
    color: '#EF4444',
    angle: -30,
    pattern: 'repeat',
    addDateStamp: true,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type.startsWith('image/')) {
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setPreviewUrl(url);
      const img = new Image();
      img.onload = () => {
        setImageElement(img);
      };
      img.src = url;
    }
  };

  useEffect(() => {
    if (!imageElement) return;
    applyWatermarkToImage(imageElement, options, 'image/jpeg')
      .then((res) => {
        setWatermarkedUrl(res.dataUrl);
        setResultBlob(res.blob);
      })
      .catch((err) => console.error('Watermark error:', err));
  }, [imageElement, options]);

  const handleDownload = () => {
    if (!watermarkedUrl || !file) return;
    const a = document.createElement('a');
    a.href = watermarkedUrl;
    const name = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    a.download = `${name}_watermarked_protected.jpg`;
    a.click();
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <ToolHeader
        title={t.tools.watermarkStamper.name}
        badge={t.tools.watermarkStamper.badge}
        description={t.tools.watermarkStamper.desc}
        icon={ShieldAlert}
        iconGradient="from-amber-600 to-red-600"
      />

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {!file ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-red-500 rounded-2xl p-10 text-center cursor-pointer transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 flex items-center justify-center">
              <Upload className="w-8 h-8" />
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-100 text-base mb-1">
              {language === 'hi' ? 'दस्तावेज़ या आधार / पैन कार्ड अपलोड करें' : 'Upload Aadhaar, PAN, or Marksheet'}
            </p>
            <p className="text-xs text-slate-400">100% Client-side: Your ID Never leaves your device</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Left: Live Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold">Live Protected Preview</span>
                <button
                  onClick={() => setFile(null)}
                  className="text-red-600 hover:underline"
                >
                  Change Document
                </button>
              </div>

              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center p-2">
                {watermarkedUrl ? (
                  <img
                    src={watermarkedUrl}
                    alt="Watermarked Preview"
                    className="max-h-full max-w-full object-contain rounded-lg shadow"
                  />
                ) : (
                  <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
                )}
              </div>

              <button
                onClick={handleDownload}
                disabled={!watermarkedUrl}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-md shadow-red-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Watermarked ID</span>
              </button>
            </div>

            {/* Right: Controls */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Watermark Security Text (सुरक्षा टेक्स्ट):
                </label>
                <input
                  type="text"
                  value={options.text}
                  onChange={(e) => setOptions((prev) => ({ ...prev, text: e.target.value }))}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                />

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[
                    'FOR VERIFICATION ONLY',
                    'DO NOT MISUSE',
                    'ONLY FOR SSC CGL 2026',
                    'SELF ATTESTED COPY',
                  ].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setOptions((prev) => ({ ...prev, text: preset }))}
                      className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-[11px] font-medium rounded-lg text-slate-600 dark:text-slate-300"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Sub-Text (उदा: रोल नंबर या नाम):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Roll No: 24010998 • SSC Verification"
                  value={options.subText || ''}
                  onChange={(e) => setOptions((prev) => ({ ...prev, subText: e.target.value }))}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              {/* Watermark Pattern */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Pattern Style:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setOptions((prev) => ({ ...prev, pattern: 'repeat' }))}
                    className={`py-2 px-3 rounded-xl border font-semibold ${
                      options.pattern === 'repeat'
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Diagonal Repeating Grid
                  </button>
                  <button
                    onClick={() => setOptions((prev) => ({ ...prev, pattern: 'center' }))}
                    className={`py-2 px-3 rounded-xl border font-semibold ${
                      options.pattern === 'center'
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Single Official Stamp Box
                  </button>
                </div>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    <span>Opacity:</span>
                    <span>{Math.round(options.opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.08"
                    max="0.7"
                    step="0.02"
                    value={options.opacity}
                    onChange={(e) =>
                      setOptions((prev) => ({ ...prev, opacity: parseFloat(e.target.value) }))
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    <span>Font Size:</span>
                    <span>{options.fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="16"
                    max="60"
                    step="2"
                    value={options.fontSize}
                    onChange={(e) =>
                      setOptions((prev) => ({ ...prev, fontSize: parseInt(e.target.value) }))
                    }
                    className="w-full"
                  />
                </div>
              </div>

              {/* Color & Date Stamp */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">Color:</span>
                  {['#EF4444', '#2563EB', '#374151', '#059669'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setOptions((prev) => ({ ...prev, color: c }))}
                      style={{ backgroundColor: c }}
                      className={`w-6 h-6 rounded-full border-2 ${
                        options.color === c ? 'border-white ring-2 ring-red-500' : 'border-transparent'
                      }`}
                    />
                  ))}
                </div>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={options.addDateStamp}
                    onChange={(e) =>
                      setOptions((prev) => ({ ...prev, addDateStamp: e.target.checked }))
                    }
                    className="rounded text-red-600"
                  />
                  <span>Add Today's Date</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
