import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Dropzone } from '../common/Dropzone';
import { performOcr, OcrResult, OcrProgress } from '../../utils/ocrEngine';
import { generateSampleOcrDocument } from '../../utils/sampleImages';
import { fireConfetti } from '../common/Celebration';
import { Copy, Check, Download, RefreshCw, FileText, ArrowLeft, Sparkles, Brain } from 'lucide-react';

export const OcrExtractor: React.FC = () => {
  const { t, setActiveTool } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const [language, setLanguage] = useState<'eng' | 'hin' | 'eng+hin'>('eng+hin');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<OcrProgress | null>(null);
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleFileSelect = (f: File) => {
    setFile(f);
    setFilePreview(URL.createObjectURL(f));
    setOcrResult(null);
  };

  const handleSample = async () => {
    const sample = await generateSampleOcrDocument();
    handleFileSelect(sample);
  };

  const executeOcr = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress({ status: 'Starting Tesseract WebAssembly engine...', progress: 0 });

    try {
      const res = await performOcr(file, language, (prog) => {
        setProgress(prog);
      });
      setOcrResult(res);
      fireConfetti();
    } catch (err) {
      console.error(err);
      alert('Error during OCR recognition. Please check the image quality.');
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  };

  const handleCopy = () => {
    if (!ocrResult?.text) return;
    navigator.clipboard.writeText(ocrResult.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!ocrResult?.text) return;
    const blob = new Blob([ocrResult.text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `doctoolz-ocr-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
        <span className="text-xs px-2.5 py-1 rounded-full bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 font-medium">
          {t.tools.ocr.badge}
        </span>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {t.tools.ocr.name}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.tools.ocr.desc}
          </p>
        </div>

        {!file ? (
          <Dropzone
            onFileSelect={handleFileSelect}
            onSampleClick={handleSample}
            sampleLabel="Try Demo Hindi/English Document"
          />
        ) : (
          <div className="space-y-6">
            {/* Language Selection & Trigger Bar */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  {t.ocrTab.language}
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'eng+hin', label: t.ocrTab.bilingual },
                    { id: 'hin', label: t.ocrTab.hindi },
                    { id: 'eng', label: t.ocrTab.english },
                  ].map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setLanguage(l.id as 'eng' | 'hin' | 'eng+hin')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        language === l.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-indigo-400'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={executeOcr}
                disabled={isProcessing}
                className="px-6 py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 flex items-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isProcessing ? 'Recognizing...' : t.ocrTab.extractButton}</span>
              </button>
            </div>

            {/* Processing Progress */}
            {isProcessing && (
              <div className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 text-center">
                <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider mb-2">
                  {progress?.status || 'Processing with WebAssembly OCR...'}
                </p>
                <div className="w-full max-w-md mx-auto bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full transition-all duration-300"
                    style={{ width: `${Math.round((progress?.progress || 0) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Results Grid: Image & Extracted Text */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Preview */}
              <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Input Document
                </span>
                {filePreview && (
                  <img
                    src={filePreview}
                    alt="Document preview"
                    className="max-h-72 w-auto object-contain rounded-lg shadow bg-white"
                  />
                )}
              </div>

              {/* Extracted Text Area */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Recognized Text
                  </span>
                  {ocrResult && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                        {ocrResult.confidence}% Confidence
                      </span>
                      <span className="text-slate-500 font-medium">
                        {ocrResult.wordsCount} words
                      </span>
                    </div>
                  )}
                </div>

                <textarea
                  value={ocrResult ? ocrResult.text : ''}
                  onChange={(e) =>
                    ocrResult && setOcrResult({ ...ocrResult, text: e.target.value })
                  }
                  placeholder="Extracted text will appear here. Click 'Extract Text Now' above to begin..."
                  rows={10}
                  className="w-full flex-1 p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none leading-relaxed"
                />

                {ocrResult && (
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={handleCopy}
                      className="flex-1 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? t.ocrTab.copied : t.ocrTab.copyText}</span>
                    </button>

                    <button
                      onClick={handleDownloadTxt}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{t.ocrTab.downloadTxt}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* AI Power Note */}
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3">
              <Brain className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-amber-900 dark:text-amber-200">
                  {t.ocrTab.aiNoteTitle}
                </span>
                <p className="text-amber-800 dark:text-amber-300/90 mt-0.5">
                  {t.ocrTab.aiNoteDesc}
                </p>
              </div>
            </div>

            {/* Reset button */}
            <div className="flex justify-center pt-2">
              <button
                onClick={() => {
                  setFile(null);
                  setFilePreview(null);
                  setOcrResult(null);
                }}
                className="px-5 py-2.5 rounded-2xl font-semibold text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t.processAnother}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
