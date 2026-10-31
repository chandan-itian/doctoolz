import React from 'react';
import { useApp, MainTab } from '../../context/AppContext';
import { Home, LayoutGrid, DownloadCloud, Settings } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { mainTab, setMainTab, setActiveTool, activeTool, language, downloadedFiles } = useApp();

  const handleTabClick = (tab: MainTab) => {
    if (tab === 'home') {
      setActiveTool(null);
      setMainTab('home');
    } else if (tab === 'tools') {
      setMainTab('tools');
    } else if (tab === 'downloads') {
      setActiveTool(null);
      setMainTab('downloads');
    } else if (tab === 'settings') {
      setActiveTool(null);
      setMainTab('settings');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isSettingsActive = mainTab === 'settings';
  const isDownloadsActive = mainTab === 'downloads';
  const isToolActive = !isSettingsActive && !isDownloadsActive && (mainTab === 'tools' || activeTool !== null);
  const isHomeActive = !isSettingsActive && !isDownloadsActive && !isToolActive;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 pb-[max(env(safe-area-inset-bottom),4px)] pt-1 transition-all shadow-[0_-2px_12px_rgba(0,0,0,0.03)] select-none">
      <div className="flex items-center justify-around max-w-md mx-auto px-4 h-12">
        {/* Tab 1: Home */}
        <button
          onClick={() => handleTabClick('home')}
          className={`flex-1 flex flex-col items-center justify-center py-0.5 transition-all active:scale-95 cursor-pointer relative ${
            isHomeActive
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium'
          }`}
        >
          <Home className="w-4.5 h-4.5" />
          <span className="text-[10px] tracking-tight mt-0.5">
            {language === 'hi' ? 'होम' : 'Home'}
          </span>
          {isHomeActive && (
            <span className="w-6 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full absolute -bottom-0.5"></span>
          )}
        </button>

        {/* Tab 2: Tool */}
        <button
          onClick={() => handleTabClick('tools')}
          className={`flex-1 flex flex-col items-center justify-center py-0.5 transition-all active:scale-95 cursor-pointer relative ${
            isToolActive
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium'
          }`}
        >
          <LayoutGrid className="w-4.5 h-4.5" />
          <span className="text-[10px] tracking-tight mt-0.5">
            {language === 'hi' ? 'टूल्स' : 'Tool'}
          </span>
          {isToolActive && (
            <span className="w-6 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full absolute -bottom-0.5"></span>
          )}
        </button>

        {/* Tab 3: Downloads */}
        <button
          onClick={() => handleTabClick('downloads')}
          className={`flex-1 flex flex-col items-center justify-center py-0.5 transition-all active:scale-95 cursor-pointer relative ${
            isDownloadsActive
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium'
          }`}
        >
          <div className="relative">
            <DownloadCloud className="w-4.5 h-4.5" />
            {downloadedFiles.length > 0 && (
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full absolute -top-0.5 -right-0.5"></span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">
            {language === 'hi' ? 'डाउनलोड्स' : 'Downloads'}
          </span>
          {isDownloadsActive && (
            <span className="w-6 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full absolute -bottom-0.5"></span>
          )}
        </button>

        {/* Tab 4: Settings */}
        <button
          onClick={() => handleTabClick('settings')}
          className={`flex-1 flex flex-col items-center justify-center py-0.5 transition-all active:scale-95 cursor-pointer relative ${
            isSettingsActive
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium'
          }`}
        >
          <Settings className="w-4.5 h-4.5" />
          <span className="text-[10px] tracking-tight mt-0.5">
            {language === 'hi' ? 'सेटिंग्स' : 'Settings'}
          </span>
          {isSettingsActive && (
            <span className="w-6 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full absolute -bottom-0.5"></span>
          )}
        </button>
      </div>
    </nav>
  );
};
