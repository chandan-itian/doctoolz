import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SignaturePad } from './SignaturePad';
import { SignatureResizer } from './SignatureResizer';
import { ArrowLeft, PenTool, Edit3, Sliders } from 'lucide-react';

export const DigitalSignatureStudio: React.FC = () => {
  const { setActiveTool, language } = useApp();
  const [activeTab, setActiveTab] = useState<'draw' | 'resize'>('draw');

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
          <PenTool className="w-5 h-5 text-teal-500" />
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            {language === 'hi' ? 'डिजिटल सिग्नेचर स्टूडियो' : 'Digital Signature Studio'}
          </h2>
        </div>
        <div className="w-12"></div>
      </div>

      {/* Segmented Control */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl max-w-sm mx-auto mb-6">
        <button
          onClick={() => setActiveTab('draw')}
          className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'draw'
              ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>{language === 'hi' ? 'सिग्नेचर बनाएं' : 'Draw Signature'}</span>
        </button>
        <button
          onClick={() => setActiveTab('resize')}
          className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'resize'
              ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>{language === 'hi' ? 'साइज सेट करें (KB)' : 'Resize KB & Dimensions'}</span>
        </button>
      </div>

      {activeTab === 'draw' ? <SignaturePad /> : <SignatureResizer />}
    </div>
  );
};
