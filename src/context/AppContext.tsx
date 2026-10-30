import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from '../i18n/translations';

export type ToolId =
  | 'compressor'
  | 'passport'
  | 'signature'
  | 'dimensionDpi'
  | 'photoSignMerge'
  | 'photoToPdf'
  | 'pdfToPhoto'
  | 'ocr';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  activeTool: ToolId | null;
  setActiveTool: (tool: ToolId | null) => void;
  t: typeof translations['en'];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('doctoolz_lang');
    return (saved === 'hi' || saved === 'en') ? saved : 'hi'; // Default Hindi for user convenience
  });

  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('doctoolz_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [activeTool, setActiveTool] = useState<ToolId | null>(null);

  useEffect(() => {
    localStorage.setItem('doctoolz_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('doctoolz_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const t = translations[language];

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage: setLanguageState,
        toggleLanguage,
        theme,
        setTheme: setThemeState,
        toggleTheme,
        activeTool,
        setActiveTool,
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
