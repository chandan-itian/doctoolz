import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Moon, Sun, Languages, Sparkles, Zap, ChevronLeft } from 'lucide-react';
import { ToolSwitcherModal } from './ToolSwitcherModal';

export const Navbar: React.FC = () => {
  const { language, toggleLanguage, theme, toggleTheme, activeTool, setActiveTool, t } = useApp();
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  const activeToolName = activeTool && (t.tools as any)[activeTool] ? (t.tools as any)[activeTool].name : null;

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/85 dark:bg-slate-900/85 border-b border-slate-200/80 dark:border-slate-800 transition-colors shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          {/* Left: Brand Logo OR Back Button if inside tool */}
          {activeTool ? (
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => setActiveTool(null)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/80 dark:hover:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs sm:text-sm font-semibold transition-transform active:scale-95 cursor-pointer shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{language === 'hi' ? 'सभी टूल्स' : 'All Tools'}</span>
              </button>
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate hidden xs:inline-block max-w-[150px] sm:max-w-xs">
                {activeToolName}
              </span>
            </div>
          ) : (
            <div
              onClick={() => setActiveTool(null)}
              className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 active:scale-95 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg sm:text-2xl tracking-tight bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                    {t.brand}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    PRO
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block -mt-1 font-medium">
                  Free • Private • Zero Uploads
                </p>
              </div>
            </div>
          )}

          {/* Privacy badge (middle - hidden on mobile, shown on tablet/desktop) */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.privacyBadge}</span>
          </div>

          {/* Controls: Tool Switcher, Language & Theme */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Tools Button */}
            <button
              onClick={() => setIsSwitcherOpen(true)}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-transform active:scale-95 shadow-2xs cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span className="hidden xs:inline">{t.switchTool}</span>
              <span className="xs:hidden">{language === 'hi' ? 'टूल' : 'Tools'}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              title={language === 'en' ? 'Switch to Hindi (हिंदी)' : 'Switch to English'}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-transform active:scale-95 shadow-2xs cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>{language === 'en' ? 'हिं' : 'EN'}</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-1.5 sm:p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-transform active:scale-95 shadow-2xs cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      <ToolSwitcherModal
        isOpen={isSwitcherOpen}
        onClose={() => setIsSwitcherOpen(false)}
      />
    </>
  );
};
