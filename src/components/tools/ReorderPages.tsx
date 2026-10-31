import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  LayoutGrid,
  Upload,
  Download,
  ArrowUp,
  ArrowDown,
  Trash2,
  RotateCw,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { PDFDocument, degrees } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { generateTwoSamplePdfs } from '../../utils/sampleImages';

interface PageItem {
  pageIndex: number; // 0-based original index
  previewUrl: string;
  rotation: number;
}

export const ReorderPages: React.FC = () => {
  const { setActiveTool, language } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPdfPages = async (pdfFile: File) => {
    setIsProcessing(true);
    setDownloadUrl(null);
    try {
      const buffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
      const loaded: PageItem[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.5 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          await (page as any).render({ canvasContext: ctx, viewport, canvas }).promise;
          loaded.push({
            pageIndex: i - 1,
            previewUrl: canvas.toDataURL('image/jpeg', 0.8),
            rotation: 0,
          });
        }
      }
      setPages(loaded);
      setFile(pdfFile);
    } catch (err) {
      console.error('Error rendering PDF pages:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDemo = async () => {
    try {
      const [f1] = await generateTwoSamplePdfs();
      await loadPdfPages(f1);
    } catch (e) {
      console.error(e);
    }
  };

  const movePage = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= pages.length) return;
    setPages((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[target];
      copy[target] = temp;
      return copy;
    });
  };

  const rotatePage = (index: number) => {
    setPages((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        rotation: (copy[index].rotation + 90) % 360,
      };
      return copy;
    });
  };

  const removePage = (index: number) => {
    setPages((prev) => prev.filter((_, i) => i !== index));
  };

  const saveReorderedPdf = async () => {
    if (!file || pages.length === 0) return;
    setIsProcessing(true);
    try {
      const buffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const newPdf = await PDFDocument.create();

      for (const item of pages) {
        const [copied] = await newPdf.copyPages(sourcePdf, [item.pageIndex]);
        if (item.rotation !== 0) {
          const currentRotation = copied.getRotation().angle;
          copied.setRotation(degrees(currentRotation + item.rotation));
        }
        newPdf.addPage(copied);
      }

      const bytes = await newPdf.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);

      const a = document.createElement('a');
      a.href = url;
      a.download = `DocToolz_Reordered_${Date.now()}.pdf`;
      a.click();
    } catch (err) {
      console.error('Error saving reordered PDF:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setActiveTool(null)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'वापस' : 'Back'}</span>
        </button>
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-blue-500" />
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            {language === 'hi' ? 'पीडीएफ पेज क्रम बदलें' : 'Reorder PDF Pages'}
          </h2>
        </div>
        <div className="w-12"></div>
      </div>

      {!file ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 text-center shadow-xs">
          <Upload className="w-12 h-12 text-blue-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
            {language === 'hi' ? 'पीडीएफ चुनें' : 'Select PDF to Reorder'}
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            {language === 'hi'
              ? 'पेज ड्रैग करें, घुमाएं, हटाएं या नया क्रम सेट करें।'
              : 'Rearrange pages, rotate 90°, delete unwanted pages, and export.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs shadow-md shadow-blue-500/20 active:scale-95"
            >
              {language === 'hi' ? 'पीडीएफ फाइल चुनें' : 'Choose PDF File'}
            </button>
            <button
              onClick={handleDemo}
              className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-xs hover:bg-slate-200 active:scale-95"
            >
              {language === 'hi' ? 'डेमो पीडीएफ आज़माएं' : 'Try Demo PDF'}
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) loadPdfPages(e.target.files[0]);
            }}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-xs">
                {file.name}
              </p>
              <p className="text-[11px] text-slate-400">
                {pages.length} {language === 'hi' ? 'पेज शेष' : 'pages remaining'}
              </p>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setPages([]);
              }}
              className="text-xs font-bold text-red-500 hover:underline"
            >
              {language === 'hi' ? 'बदलें' : 'Change PDF'}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {pages.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl p-2.5 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col items-center"
              >
                <div className="w-full h-36 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center relative mb-2">
                  <img
                    src={item.previewUrl}
                    alt={`Page ${idx + 1}`}
                    style={{ transform: `rotate(${item.rotation}deg)` }}
                    className="max-h-full max-w-full object-contain transition-transform"
                  />
                  <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold">
                    P.{idx + 1}
                  </span>
                </div>
                <div className="flex items-center gap-1 w-full justify-around pt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => movePage(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 text-slate-600 dark:text-slate-300"
                    title="Move Left/Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5 rotate-[-90deg]" />
                  </button>
                  <button
                    onClick={() => rotatePage(idx)}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-600"
                    title="Rotate 90°"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removePage(idx)}
                    className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-red-500"
                    title="Delete Page"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => movePage(idx, 'down')}
                    disabled={idx === pages.length - 1}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 text-slate-600 dark:text-slate-300"
                    title="Move Right/Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5 rotate-[-90deg]" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={saveReorderedPdf}
            disabled={isProcessing || pages.length === 0}
            className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            <span>
              {isProcessing
                ? language === 'hi'
                  ? 'पीडीएफ बन रहा है...'
                  : 'Compiling PDF...'
                : language === 'hi'
                ? `नया पीडीएफ डाउनलोड करें (${pages.length} पेज)`
                : `Download Reordered PDF (${pages.length} Pages)`}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
