import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from '../i18n/translations';

export type ToolId =
  // The 20 Canonical Tools for DocToolz v1.0.2
  | 'exactKbResizer'
  | 'pdfCompress'
  | 'mergeSplit'
  | 'docScanner'
  | 'pdfProtect'
  | 'admitCardPrep'
  | 'ageEligibility'
  | 'cgpaPercent'
  | 'digitalSignature'
  | 'documentRedactor'
  | 'customWatermark'
  | 'formatConvert'
  | 'pdfToWordOcr'
  | 'qrBarcodeStudio'
  | 'backgroundRemover'
  | 'reorderPages'
  | 'metadataStripper'
  | 'marksheetCutoff'
  | 'idCardMaker'
  | 'batchProcess'
  // Backward-compatibility aliases
  | 'compressor'
  | 'passport'
  | 'signature'
  | 'dimensionDpi'
  | 'photoSignMerge'
  | 'photoToPdf'
  | 'pdfToPhoto'
  | 'ocr'
  | 'sizeIncreaser'
  | 'ageCalculator'
  | 'cgpaCalculator'
  | 'signaturePad'
  | 'pdfCompressor'
  | 'pdfMerger'
  | 'pdfSplitter'
  | 'pdfPassword'
  | 'watermarkStamper'
  | 'qrTools'
  | 'imageCropper';

export type MainTab = 'home' | 'tools' | 'downloads' | 'settings';
export type ThemeMode = 'light' | 'dark' | 'auto';

export interface DownloadedFileItem {
  id: string;
  name: string;
  type: 'image' | 'pdf';
  sizeKb: number;
  timestamp: number;
  url: string;
}

interface AppContextType {
  mainTab: MainTab;
  setMainTab: (tab: MainTab) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  theme: 'light' | 'dark'; // Effective active theme
  toggleTheme: () => void;
  materialYou: boolean;
  setMaterialYou: (val: boolean) => void;
  amoledBlack: boolean;
  setAmoledBlack: (val: boolean) => void;
  activeTool: ToolId | null;
  setActiveTool: (tool: ToolId | null) => void;
  pinnedShortcuts: ToolId[];
  setPinnedShortcuts: (shortcuts: ToolId[]) => void;
  cacheBytes: number;
  clearCache: () => void;
  downloadedFiles: DownloadedFileItem[];
  recordDownload: (item: Omit<DownloadedFileItem, 'id' | 'timestamp'>) => void;
  deleteDownloadedFile: (id: string) => void;
  t: typeof translations['en'];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [mainTab, setMainTab] = useState<MainTab>('home');
  const [activeTool, setActiveToolState] = useState<ToolId | null>(null);

  // Language State
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('doctoolz_lang');
    return saved === 'hi' || saved === 'en' ? saved : 'en'; // English as default matching screenshots, full Hindi toggle
  });

  // Theme Mode State ('light' | 'dark' | 'auto')
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('doctoolz_theme_mode') as ThemeMode;
    return saved === 'light' || saved === 'dark' || saved === 'auto' ? saved : 'light';
  });

  // Effective Theme ('light' | 'dark')
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  // Material You & AMOLED Toggles
  const [materialYou, setMaterialYouState] = useState<boolean>(() => {
    return localStorage.getItem('doctoolz_material_you') !== 'false';
  });

  const [amoledBlack, setAmoledBlackState] = useState<boolean>(() => {
    return localStorage.getItem('doctoolz_amoled') === 'true';
  });

  // Pinned Shortcuts
  const [pinnedShortcuts, setPinnedShortcutsState] = useState<ToolId[]>(() => {
    try {
      const saved = localStorage.getItem('doctoolz_pinned');
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['exactKbResizer', 'docScanner', 'pdfCompress', 'admitCardPrep'];
  });

  // Simulated & calculated local cache buffer (14.2 MB baseline)
  const [cacheBytes, setCacheBytes] = useState<number>(() => {
    const saved = localStorage.getItem('doctoolz_cache_bytes');
    return saved ? parseInt(saved, 10) : 14.2 * 1024 * 1024;
  });

  // Local Downloads list
  const [downloadedFiles, setDownloadedFiles] = useState<DownloadedFileItem[]>(() => {
    try {
      const saved = localStorage.getItem('doctoolz_downloads');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const recordDownload = (item: Omit<DownloadedFileItem, 'id' | 'timestamp'>) => {
    const newItem: DownloadedFileItem = {
      ...item,
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
    };
    setDownloadedFiles((prev) => {
      const updated = [newItem, ...prev].slice(0, 50); // Keep last 50
      try {
        localStorage.setItem('doctoolz_downloads', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteDownloadedFile = (id: string) => {
    setDownloadedFiles((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      try {
        localStorage.setItem('doctoolz_downloads', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Listen to system dark mode preference for 'auto'
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = () => {
      let active: 'light' | 'dark' = 'light';
      if (themeMode === 'auto') {
        active = mediaQuery.matches ? 'dark' : 'light';
      } else {
        active = themeMode;
      }
      setEffectiveTheme(active);

      const root = document.documentElement;
      if (active === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }

      if (amoledBlack && active === 'dark') {
        root.classList.add('amoled');
      } else {
        root.classList.remove('amoled');
      }

      if (materialYou) {
        root.classList.add('monet');
      } else {
        root.classList.remove('monet');
      }
    };

    updateTheme();
    mediaQuery.addEventListener('change', updateTheme);
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, [themeMode, amoledBlack, materialYou]);

  // Persist settings
  useEffect(() => {
    localStorage.setItem('doctoolz_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('doctoolz_theme_mode', themeMode);
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem('doctoolz_material_you', materialYou.toString());
  }, [materialYou]);

  useEffect(() => {
    localStorage.setItem('doctoolz_amoled', amoledBlack.toString());
  }, [amoledBlack]);

  useEffect(() => {
    localStorage.setItem('doctoolz_pinned', JSON.stringify(pinnedShortcuts));
  }, [pinnedShortcuts]);

  useEffect(() => {
    localStorage.setItem('doctoolz_cache_bytes', cacheBytes.toString());
  }, [cacheBytes]);

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const toggleTheme = () => {
    setThemeModeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setActiveTool = (tool: ToolId | null) => {
    setActiveToolState(tool);
    if (tool) {
      setMainTab('tools');
    }
  };

  const clearCache = () => {
    try {
      // Clear session storage and cache storage
      sessionStorage.clear();
      setCacheBytes(0);
      localStorage.setItem('doctoolz_cache_bytes', '0');

      // Clear browser caches if supported
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        });
      }

      // If Android Native Bridge is available, call clearAppCache()
      if ((window as any).AndroidBridge && typeof (window as any).AndroidBridge.clearAppCache === 'function') {
        (window as any).AndroidBridge.clearAppCache();
      }
    } catch (e) {
      console.error('Error clearing cache:', e);
    }
  };

  const t = translations[language];

  return (
    <AppContext.Provider
      value={{
        mainTab,
        setMainTab,
        language,
        setLanguage: setLanguageState,
        toggleLanguage,
        themeMode,
        setThemeMode: setThemeModeState,
        theme: effectiveTheme,
        toggleTheme,
        materialYou,
        setMaterialYou: setMaterialYouState,
        amoledBlack,
        setAmoledBlack: setAmoledBlackState,
        activeTool,
        setActiveTool,
        pinnedShortcuts,
        setPinnedShortcuts: setPinnedShortcutsState,
        cacheBytes,
        clearCache,
        downloadedFiles,
        recordDownload,
        deleteDownloadedFile,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
