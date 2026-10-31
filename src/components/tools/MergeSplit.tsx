import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PdfMerger } from './PdfMerger';
import { PdfSplitter } from './PdfSplitter';
import { ArrowLeft, Layers, Scissors, GitFork } from 'lucide-react';

export const MergeSplit: React.FC = () => {
  const { setActiveTool, language } = useApp();
  const [activeTab, setActiveTab] = useState<'merge' | 'split'>('merge');

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
          <GitFork className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            {language === 'hi' ? 'पीडीएफ मर्ज और स्प्लिट' : 'Merge & Split PDF'}
          </h2>
        </div>
        <div className="w-12"></div>
      </div>

      {/* Segmented Control */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl max-w-sm mx-auto mb-6">
        <button
          onClick={() => setActiveTab('merge')}
          className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'merge'
              ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{language === 'hi' ? 'पीडीएफ जोड़ें (Merge)' : 'Merge PDFs'}</span>
        </button>
        <button
          onClick={() => setActiveTab('split')}
          className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'split'
              ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
          }`}
        >
          <Scissors className="w-4 h-4" />
          <span>{language === 'hi' ? 'पेज अलग करें (Split)' : 'Split Pages'}</span>
        </button>
      </div>

      {/* Render Active Utility */}
      {activeTab === 'merge' ? <PdfMerger /> : <PdfSplitter />}
    </div>
  );
};
