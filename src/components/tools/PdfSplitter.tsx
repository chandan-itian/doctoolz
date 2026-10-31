import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ToolHeader } from '../common/ToolHeader';
import { Scissors, Upload, Download, RefreshCw, CheckCircle2 } from 'lucide-react';
import { splitPdfFile } from '../../utils/pdfAdvanced';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';

export const PdfSplitter: React.FC = () => {
  const { t, language } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageRangeInput, setPageRangeInput] = useState<string>('1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; url: string; pageCount: number; sizeKb: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setResult(null);
      try {
        const bytes = await selected.arrayBuffer();
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const count = doc.getPageCount();
        setTotalPages(count);
        setPageRangeInput(count > 1 ? `1-${Math.min(3, count)}` : '1');
      } catch (err) {
        console.error('Error reading PDF pages:', err);
      }
    }
  };

  const parsePageNumbers = (input: string, maxPages: number): number[] => {
    const pages = new Set<number>();
    const parts = input.split(',').map((p) => p.trim());

    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr);
        const end = parseInt(endStr);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
            if (i >= 1 && i <= maxPages) pages.add(i);
          }
        }
      } else {
        const page = parseInt(part);
        if (!isNaN(page) && page >= 1 && page <= maxPages) {
          pages.add(page);
        }
      }
    }

    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!file || totalPages === 0) return;
    const pagesToKeep = parsePageNumbers(pageRangeInput, totalPages);
    if (pagesToKeep.length === 0) {
      alert(`Please enter valid page numbers between 1 and ${totalPages}.`);
      return;
    }

    setIsProcessing(true);
    try {
      const res = await splitPdfFile(file, pagesToKeep);
      const url = URL.createObjectURL(res.blob);
      setResult({
        blob: res.blob,
        url,
        pageCount: res.pageCount,
        sizeKb: res.sizeKb,
      });
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
    } catch (err) {
      console.error(err);
      alert('Error extracting pages: ' + (err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const a = document.createElement('a');
    a.href = result.url;
    const name = file.name.replace(/\.pdf$/i, '');
    a.download = `${name}_extracted_${result.pageCount}pages.pdf`;
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolHeader
        title={t.tools.pdfSplitter.name}
        badge={t.tools.pdfSplitter.badge}
        description={t.tools.pdfSplitter.desc}
        icon={Scissors}
        iconGradient="from-pink-600 to-rose-600"
      />

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {!file ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-pink-500 rounded-2xl p-10 text-center cursor-pointer transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 flex items-center justify-center">
              <Upload className="w-8 h-8" />
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-100 text-base mb-1">
              {language === 'hi' ? 'PDF फाइल चुनें जिसे स्प्लिट करना है' : 'Upload PDF to Split / Extract Pages'}
            </p>
            <p className="text-xs text-slate-400">
              {language === 'hi' ? 'बड़ी PDF में से मनचाहे पेज निकालें' : 'Extract specific pages into a new compact file'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate max-w-sm sm:max-w-md">
                  {file.name}
                </h4>
                <span className="text-xs text-slate-500">
                  Total Pages Found: <strong>{totalPages} Pages</strong> • {Math.round((file.size / 1024) * 10) / 10} KB
                </span>
              </div>
              <button
                onClick={() => setFile(null)}
                className="text-xs text-slate-400 hover:text-pink-600 font-semibold"
              >
                Change PDF
              </button>
            </div>

            {/* Page Range Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {language === 'hi'
                  ? `निकालने वाले पेज नंबर दर्ज करें (1 से ${totalPages}):`
                  : `Enter Page Numbers to Extract (1 to ${totalPages}):`}
              </label>

              <input
                type="text"
                value={pageRangeInput}
                onChange={(e) => setPageRangeInput(e.target.value)}
                placeholder="e.g. 1, 3-5, 8"
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none font-mono"
              />

              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  onClick={() => setPageRangeInput('1')}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-pink-50 dark:hover:bg-pink-950/40 rounded-lg text-slate-600 dark:text-slate-300"
                >
                  Page 1 Only
                </button>
                {totalPages > 1 && (
                  <>
                    <button
                      onClick={() => setPageRangeInput(`1-${Math.min(2, totalPages)}`)}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-pink-50 dark:hover:bg-pink-950/40 rounded-lg text-slate-600 dark:text-slate-300"
                    >
                      Pages 1-2
                    </button>
                    <button
                      onClick={() => {
                        const odds = Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter((p) => p % 2 !== 0)
                          .join(', ');
                        setPageRangeInput(odds);
                      }}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-pink-50 dark:hover:bg-pink-950/40 rounded-lg text-slate-600 dark:text-slate-300"
                    >
                      Odd Pages (1, 3, 5...)
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Split Action */}
            {result ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-3">
                <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 text-sm font-bold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    Pages Extracted Successfully!
                  </span>
                  <span className="text-xs bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-1 rounded">
                    {result.pageCount} Pages • {result.sizeKb} KB
                  </span>
                </div>
                <button
                  onClick={handleDownload}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Extracted PDF ({result.pageCount} Pages)</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleSplit}
                disabled={isProcessing}
                className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-semibold shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Extracting Selected Pages...</span>
                  </>
                ) : (
                  <>
                    <Scissors className="w-4 h-4" />
                    <span>Extract Selected Pages Now</span>
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
