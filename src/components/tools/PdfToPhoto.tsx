import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { renderPdfToImages, RenderedPdfPage } from '../../utils/pdfRenderer';
import { fireConfetti } from '../common/Celebration';
import { Download, RefreshCw, Upload, FileText, ArrowLeft, Image as ImageIcon } from 'lucide-react';

export const PdfToPhoto: React.FC = () => {
  const { t, setActiveTool } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [dpi, setDpi] = useState<number>(200);
  const [format, setFormat] = useState<'image/jpeg' | 'image/png'>('image/jpeg');

  const [pages, setPages] = useState<RenderedPdfPage[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPages([]);
      await executePdfRender(selectedFile, dpi, format);
    }
  };

  const executePdfRender = async (
    pdfFile: File,
    renderDpi: number,
    outFormat: 'image/jpeg' | 'image/png'
  ) => {
    setIsProcessing(true);
    setProgress({ current: 0, total: 1 });

    try {
      const rendered = await renderPdfToImages(pdfFile, renderDpi, outFormat, (cur, tot) => {
        setProgress({ current: cur, total: tot });
      });

      setPages(rendered);
      fireConfetti();
    } catch (err) {
      console.error(err);
      alert('Error rendering PDF. Please ensure file is a valid PDF.');
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  };

  const handleDownloadSingle = (page: RenderedPdfPage) => {
    const a = document.createElement('a');
    a.href = page.dataUrl;
    const ext = format === 'image/jpeg' ? 'jpg' : 'png';
    const baseName = file?.name.replace(/\.[^/.]+$/, '') || 'pdf-page';
    a.download = `${baseName}-page-${page.pageNumber}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadAll = () => {
    pages.forEach((page, index) => {
      setTimeout(() => {
        handleDownloadSingle(page);
      }, index * 200);
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setActiveTool(null)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToAllTools}</span>
        </button>
        <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-medium">
          {t.tools.pdfToPhoto.badge}
        </span>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {t.tools.pdfToPhoto.name}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.tools.pdfToPhoto.desc}
          </p>
        </div>

        {!file ? (
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-10 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <ImageIcon className="w-8 h-8" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">
              Select a PDF file to extract all pages as high-res images
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Processed 100% inside your browser using Mozilla PDF.js. No server uploads.
            </p>
            <label className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow-md transition-all">
              <Upload className="w-4 h-4" />
              <span>Choose PDF File</span>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Settings Bar */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
                  Resolution (DPI):
                </span>
                <div className="flex gap-2">
                  {[
                    { val: 150, label: '150 DPI (Fast)' },
                    { val: 200, label: '200 DPI (Exam)' },
                    { val: 300, label: '300 DPI (HD Print)' },
                  ].map((item) => (
                    <button
                      key={item.val}
                      onClick={() => {
                        setDpi(item.val);
                        if (file) executePdfRender(file, item.val, format);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        dpi === item.val
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
                  Format:
                </span>
                <div className="flex gap-2">
                  {(['image/jpeg', 'image/png'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => {
                        setFormat(fmt);
                        if (file) executePdfRender(file, dpi, fmt);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all uppercase ${
                        format === fmt
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      {fmt === 'image/jpeg' ? 'JPG' : 'PNG'}
                    </button>
                  ))}
                </div>
              </div>

              {pages.length > 1 && (
                <button
                  onClick={handleDownloadAll}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download All ({pages.length} Pages)</span>
                </button>
              )}
            </div>

            {/* Rendering Progress */}
            {isProcessing ? (
              <div className="p-12 text-center">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {progress
                    ? `Rendering Page ${progress.current} of ${progress.total}...`
                    : 'Loading PDF Document...'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {pages.map((p) => (
                  <div
                    key={p.pageNumber}
                    className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 shadow-md flex flex-col"
                  >
                    <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>Page {p.pageNumber}</span>
                      <span className="text-slate-500">{p.width} × {p.height} px</span>
                    </div>

                    <div className="p-4 flex-1 flex items-center justify-center bg-slate-100 dark:bg-slate-950/40">
                      <img
                        src={p.dataUrl}
                        alt={`Page ${p.pageNumber}`}
                        className="max-h-60 w-auto object-contain shadow rounded bg-white"
                      />
                    </div>

                    <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() => handleDownloadSingle(p)}
                        className="w-full py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Page {p.pageNumber}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Change File button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={() => {
                  setFile(null);
                  setPages([]);
                }}
                className="px-5 py-2.5 rounded-2xl font-semibold text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Process Another PDF</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
