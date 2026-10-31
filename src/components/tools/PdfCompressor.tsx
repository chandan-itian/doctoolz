import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ToolHeader } from '../common/ToolHeader';
import { FileArchive, Upload, Download, RefreshCw, CheckCircle2, Sparkles } from 'lucide-react';
import { compressPdfToTargetKb } from '../../utils/pdfAdvanced';
import { generateSamplePdf } from '../../utils/sampleImages';
import confetti from 'canvas-confetti';

export const PdfCompressor: React.FC = () => {
  const { t, language } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [targetKb, setTargetKb] = useState<number>(200);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [result, setResult] = useState<{ blob: Blob; url: string; finalKb: number; originalKb: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setResult(null);
    }
  };

  const handleSample = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsProcessing(true);
    try {
      const sample = await generateSamplePdf(3);
      setFile(sample);
      setResult(null);
    } catch (err) {
      console.error('Error generating sample PDF:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(5);
    try {
      const res = await compressPdfToTargetKb(file, targetKb, (p) => setProgress(p));
      const url = URL.createObjectURL(res.blob);
      setResult({
        blob: res.blob,
        url,
        finalKb: res.finalSizeKb,
        originalKb: res.originalSizeKb,
      });
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
    } catch (err) {
      console.error(err);
      alert('Error compressing PDF: ' + (err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const a = document.createElement('a');
    a.href = result.url;
    const name = file.name.replace(/\.pdf$/i, '');
    a.download = `${name}_compressed_${result.finalKb}KB.pdf`;
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolHeader
        title={t.tools.pdfCompressor.name}
        badge={t.tools.pdfCompressor.badge}
        description={t.tools.pdfCompressor.desc}
        icon={FileArchive}
        iconGradient="from-red-600 to-rose-700"
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
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 flex items-center justify-center">
              <Upload className="w-8 h-8" />
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-100 text-base mb-1">
              {language === 'hi' ? 'PDF फाइल यहां अपलोड करें' : 'Upload PDF Document'}
            </p>
            <p className="text-xs text-slate-400 mb-3">
              {language === 'hi' ? 'मार्कशीट, जाति प्रमाण पत्र या कोई भी दस्तावेज' : 'Marksheets, Certificates, Documents'}
            </p>

            <button
              type="button"
              onClick={handleSample}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-950/60 hover:bg-red-100 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? '✨ सैंपल डेमो PDF आज़माएं (3 पेज)' : '✨ Try Demo PDF (3 Pages)'}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center font-bold text-xs">
                  PDF
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                    {file.name}
                  </h4>
                  <span className="text-xs text-slate-500">
                    Original Size: {Math.round((file.size / 1024) * 10) / 10} KB
                  </span>
                </div>
              </div>
              <button
                onClick={() => setFile(null)}
                className="text-xs text-slate-400 hover:text-red-600 font-semibold"
              >
                Change File
              </button>
            </div>

            {/* Target KB Presets */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {language === 'hi' ? 'टारगेट साइज (Target Size Limit):' : 'Select Target Size Limit:'}
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {[100, 200, 300, 500].map((kb) => (
                  <button
                    key={kb}
                    onClick={() => setTargetKb(kb)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      targetKb === kb
                        ? 'bg-red-600 text-white border-red-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-red-400'
                    }`}
                  >
                    Under {kb} KB
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="50"
                  max="10000"
                  value={targetKb}
                  onChange={(e) => setTargetKb(Math.max(50, parseInt(e.target.value) || 50))}
                  className="w-32 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                />
                <span className="text-xs text-slate-500">KB (Custom limit)</span>
              </div>
            </div>

            {/* Progress bar */}
            {isProcessing && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
                  <span>Compressing PDF pages in browser...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-red-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {result ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>PDF Successfully Compressed!</span>
                  </div>
                  <span className="text-xs font-semibold bg-emerald-200 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 px-2.5 py-1 rounded-full">
                    Reduced to {result.finalKb} KB
                  </span>
                </div>
                <button
                  onClick={handleDownload}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Compressed PDF ({result.finalKb} KB)</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleCompress}
                disabled={isProcessing}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Compressing ({progress}%)...</span>
                  </>
                ) : (
                  <>
                    <FileArchive className="w-4 h-4" />
                    <span>Compress PDF to Under {targetKb} KB</span>
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
