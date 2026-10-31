import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkle, FileImage, FileText, GraduationCap, Zap } from 'lucide-react';
import { ToolSwitcherModal } from './ToolSwitcherModal';

interface MobileBottomBarProps {
  selectedCategory?: 'all' | 'image' | 'pdf' | 'exam' | 'privacy';
  onSelectCategory?: (category: 'all' | 'image' | 'pdf' | 'exam' | 'privacy') => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  selectedCategory = 'all',
  onSelectCategory,
}) => {
  const { activeTool, setActiveTool, language } = useApp();
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  const handleTabClick = (category: 'all' | 'image' | 'pdf' | 'exam') => {
    if (activeTool) {
      setActiveTool(null);
    }
    if (onSelectCategory) {
      onSelectCategory(category);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden backdrop-blur-xl bg-white/92 dark:bg-slate-900/92 border-t border-slate-200/90 dark:border-slate-800/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)] pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5 transition-colors">
        <div className="flex items-center justify-around px-2 max-w-md mx-auto">
          {/* Tab 1: All / Home */}
          <button
            onClick={() => handleTabClick('all')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all active:scale-95 cursor-pointer ${
              !activeTool && selectedCategory === 'all'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${!activeTool && selectedCategory === 'all' ? 'bg-indigo-50 dark:bg-indigo-950/80' : ''}`}>
              <Sparkle className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">
              {language === 'hi' ? 'सभी' : 'All'}
            </span>
          </button>

          {/* Tab 2: Photos / Image */}
          <button
            onClick={() => handleTabClick('image')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all active:scale-95 cursor-pointer ${
              !activeTool && selectedCategory === 'image'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${!activeTool && selectedCategory === 'image' ? 'bg-indigo-50 dark:bg-indigo-950/80' : ''}`}>
              <FileImage className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">
              {language === 'hi' ? 'फोटो' : 'Photos'}
            </span>
          </button>

          {/* Tab 3: Center Fast Switcher Badge */}
          <button
            onClick={() => setIsSwitcherOpen(true)}
            className="flex flex-col items-center justify-center -mt-4 group cursor-pointer active:scale-90 transition-transform"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-4 ring-white dark:ring-slate-900">
              <Zap className="w-6 h-6 fill-white" />
            </div>
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 mt-1">
              {language === 'hi' ? 'खोजें' : 'Search'}
            </span>
          </button>

          {/* Tab 4: PDF Tools */}
          <button
            onClick={() => handleTabClick('pdf')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all active:scale-95 cursor-pointer ${
              !activeTool && selectedCategory === 'pdf'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${!activeTool && selectedCategory === 'pdf' ? 'bg-indigo-50 dark:bg-indigo-950/80' : ''}`}>
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">PDF</span>
          </button>

          {/* Tab 5: Exam Tools */}
          <button
            onClick={() => handleTabClick('exam')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all active:scale-95 cursor-pointer ${
              !activeTool && selectedCategory === 'exam'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${!activeTool && selectedCategory === 'exam' ? 'bg-indigo-50 dark:bg-indigo-950/80' : ''}`}>
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">
              {language === 'hi' ? 'एग्जाम' : 'Exams'}
            </span>
          </button>
        </div>
      </nav>

      <ToolSwitcherModal
        isOpen={isSwitcherOpen}
        onClose={() => setIsSwitcherOpen(false)}
      />
    </>
  );
};
