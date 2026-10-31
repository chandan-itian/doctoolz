import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PhotoToPdf } from './PhotoToPdf';
import { PdfToPhoto } from './PdfToPhoto';
import { ArrowLeft, Repeat, FileImage, FileText } from 'lucide-react';

export const FormatConverter: React.FC = () => {
  const { setActiveTool, language } = useApp();
  const [direction, setDirection] = useState<'imgToPdf' | 'pdfToImg'>('imgToPdf');

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setActiveTool(null)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'वापस' : 'Back'}</span>
        </button>
        <div className="flex items-center gap-2">
          <Repeat className="w-5 h-5 text-purple-500" />
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            {language === 'hi' ? 'फॉर्मेट कन्वर्टर' : 'Format Converter'}
          </h2>
        </div>
        <div className="w-12"></div>
      </div>

      {/* Segmented Control */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl max-w-sm mx-auto mb-6">
        <button
          onClick={() => setDirection('imgToPdf')}
          className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
            direction === 'imgToPdf'
              ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Image → PDF</span>
        </button>
        <button
          onClick={() => setDirection('pdfToImg')}
          className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
            direction === 'pdfToImg'
              ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
          }`}
        >
          <FileImage className="w-4 h-4" />
          <span>PDF → Image</span>
        </button>
      </div>

      {direction === 'imgToPdf' ? <PhotoToPdf /> : <PdfToPhoto />}
    </div>
  );
};
