import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { convertImagesToPdf, ImageToPdfOptions } from '../../utils/pdfTools';
import { generateSamplePortrait } from '../../utils/sampleImages';
import { fireConfetti } from '../common/Celebration';
import { Download, RefreshCw, Upload, Trash2, FileText, ArrowLeft, Plus } from 'lucide-react';

interface UploadedImageItem {
  id: string;
  file: File;
  dataUrl: string;
}

export const PhotoToPdf: React.FC = () => {
  const { t, setActiveTool } = useApp();
  const [images, setImages] = useState<UploadedImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'A4' | 'Letter' | 'Fit'>('A4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [margin, setMargin] = useState<number>(18);

  const [pdfResult, setPdfResult] = useState<{ blob: Blob; url: string; sizeKb: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newItems: UploadedImageItem[] = [];

    Array.from(files).forEach((f) => {
      if (f.type.startsWith('image/')) {
        newItems.push({
          id: Math.random().toString(36).substring(7),
          file: f,
          dataUrl: URL.createObjectURL(f),
        });
      }
    });

    setImages((prev) => [...prev, ...newItems]);
    setPdfResult(null);
  };

  const handleAddSample = async () => {
    const s = await generateSamplePortrait();
    handleFiles([s] as unknown as FileList);
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setPdfResult(null);
  };

  const handleGeneratePdf = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    try {
      const options: ImageToPdfOptions = {
        pageSize,
        orientation,
        margin,
        quality: 0.9,
      };

      const result = await convertImagesToPdf(images, options);
      setPdfResult(result);
      fireConfetti();
    } catch (err) {
      console.error(err);
      alert('Error generating PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!pdfResult) return;
    const a = document.createElement('a');
    a.href = pdfResult.url;
    a.download = `doctoolz-document-${images.length}pages.pdf`;
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
        <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-medium">
          {t.tools.photoToPdf.badge}
        </span>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {t.tools.photoToPdf.name}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.tools.photoToPdf.desc}
          </p>
        </div>

        {images.length === 0 ? (
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-10 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">
              Select one or multiple photos to combine into PDF
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Supports JPG, PNG, and WebP files. Reorder or configure before generating.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <label className="px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow-md transition-all flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>Upload Photos</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFiles(e.target.files)}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleAddSample}
                className="px-4 py-2.5 rounded-xl font-semibold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition-colors"
              >
                Try Demo Photo
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Gallery of Uploaded Photos */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Photos to Convert ({images.length} pages)
                </span>
                <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 cursor-pointer hover:bg-indigo-100">
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.photoToPdfTab.addMoreImages}</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFiles(e.target.files)}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {images.map((item, index) => (
                  <div
                    key={item.id}
                    className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 aspect-3/4 flex items-center justify-center"
                  >
                    <img
                      src={item.dataUrl}
                      alt={`Page ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold">
                      #{index + 1}
                    </div>
                    <button
                      onClick={() => removeImage(item.id)}
                      className="absolute top-1 right-1 p-1 rounded bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove page"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Page & Margin Options */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Page Size */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  {t.photoToPdfTab.pageSize}
                </label>
                <div className="flex gap-2">
                  {(['A4', 'Letter', 'Fit'] as const).map((ps) => (
                    <button
                      key={ps}
                      onClick={() => setPageSize(ps)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        pageSize === ps
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      {ps}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orientation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  {t.photoToPdfTab.orientation}
                </label>
                <div className="flex gap-2">
                  {(['portrait', 'landscape'] as const).map((ori) => (
                    <button
                      key={ori}
                      onClick={() => setOrientation(ori)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all capitalize ${
                        orientation === ori
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      {ori}
                    </button>
                  ))}
                </div>
              </div>

              {/* Margin */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  {t.photoToPdfTab.margin}
                </label>
                <div className="flex gap-2">
                  {[
                    { val: 0, label: 'None' },
                    { val: 18, label: 'Small' },
                    { val: 36, label: 'Standard' },
                  ].map((m) => (
                    <button
                      key={m.val}
                      onClick={() => setMargin(m.val)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        margin === m.val
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              {!pdfResult ? (
                <button
                  onClick={handleGeneratePdf}
                  disabled={isProcessing}
                  className="px-8 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  <FileText className="w-4 h-4" />
                  <span>
                    {isProcessing ? 'Generating PDF...' : `Generate PDF from ${images.length} Photos`}
                  </span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleDownload}
                    className="px-8 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF ({pdfResult.sizeKb} KB)</span>
                  </button>

                  <button
                    onClick={() => {
                      setImages([]);
                      setPdfResult(null);
                    }}
                    className="px-5 py-3.5 rounded-2xl font-semibold text-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>{t.processAnother}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
