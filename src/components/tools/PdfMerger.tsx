import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ToolHeader } from '../common/ToolHeader';
import { FilePlus, Upload, Download, ArrowUp, ArrowDown, Trash2, CheckCircle2, RefreshCw } from 'lucide-react';
import { mergePdfFiles } from '../../utils/pdfAdvanced';
import confetti from 'canvas-confetti';

export const PdfMerger: React.FC = () => {
  const { t, language } = useApp();
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; url: string; pageCount: number; sizeKb: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesAdded = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const added = Array.from(e.target.files).filter((f) => f.type === 'application/pdf');
      setFiles((prev) => [...prev, ...added]);
      setResult(null);
    }
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    setFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setResult(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      alert('Please select at least 2 PDF files to merge.');
      return;
    }
    setIsProcessing(true);
    try {
      const res = await mergePdfFiles(files);
      const url = URL.createObjectURL(res.blob);
      setResult({
        blob: res.blob,
        url,
        pageCount: res.pageCount,
        sizeKb: res.sizeKb,
      });
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    } catch (err) {
      console.error(err);
      alert('Error merging PDFs: ' + (err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = `merged_document_${result.pageCount}pages.pdf`;
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolHeader
        title={t.tools.pdfMerger.name}
        badge={t.tools.pdfMerger.badge}
        description={t.tools.pdfMerger.desc}
        icon={FilePlus}
        iconGradient="from-orange-600 to-amber-700"
      />

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {/* Upload Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-orange-500 rounded-2xl p-8 text-center cursor-pointer transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleFilesAdded}
            className="hidden"
          />
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center">
            <Upload className="w-7 h-7" />
          </div>
          <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-1">
            {language === 'hi' ? 'PDF फाइलें चुनें या ड्रैग करें' : 'Choose or Drag PDF Files'}
          </p>
          <p className="text-xs text-slate-400">
            {language === 'hi' ? 'आप एक साथ 2 या अधिक PDF चुन सकते हैं' : 'Select 2 or more PDF files to combine'}
          </p>
        </div>

        {/* Selected Files List */}
        {files.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
              <span>{files.length} PDFs selected (Arrange order below):</span>
              <button
                onClick={() => setFiles([])}
                className="text-rose-500 hover:underline"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-2">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                      {file.name}
                    </span>
                    <span className="text-slate-400 shrink-0">
                      ({Math.round((file.size / 1024) * 10) / 10} KB)
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveDown(idx)}
                      disabled={idx === files.length - 1}
                      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFile(idx)}
                      className="p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-500"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Merge Action / Result */}
            {result ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-3">
                <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 text-sm font-bold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    Successfully Merged {files.length} PDFs!
                  </span>
                  <span className="text-xs bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded">
                    {result.pageCount} Pages • {result.sizeKb} KB
                  </span>
                </div>
                <button
                  onClick={handleDownload}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Merged PDF</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleMerge}
                disabled={isProcessing || files.length < 2}
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Merging PDFs in Browser...</span>
                  </>
                ) : (
                  <>
                    <FilePlus className="w-4 h-4" />
                    <span>Merge {files.length} PDF Files into Single PDF</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
