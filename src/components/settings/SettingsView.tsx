import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Zap,
  User,
  Shield,
  ShieldCheck,
  Palette,
  Moon,
  Sun,
  Settings as SettingsIcon,
  Languages,
  Trash2,
  Brush,
  LayoutGrid,
  FileImage,
  Scan,
  Minimize2,
  FileDiff,
  Lock,
  Heart,
  CheckCircle2,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    language,
    setLanguage,
    themeMode,
    setThemeMode,
    materialYou,
    setMaterialYou,
    amoledBlack,
    setAmoledBlack,
    cacheBytes,
    clearCache,
    setActiveTool,
  } = useApp();

  const [cacheClearedToast, setCacheClearedToast] = useState(false);

  const handleClearCache = () => {
    clearCache();
    setCacheClearedToast(true);
    setTimeout(() => setCacheClearedToast(false), 2500);
  };

  const cacheMb = (cacheBytes / (1024 * 1024)).toFixed(1);

  return (
    <div className="max-w-md mx-auto px-4 py-4 pb-28 text-slate-900 dark:text-slate-100 select-none">
      {/* Top Bar Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            DocToolz
          </span>
        </div>
        <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 relative">
          <User className="w-5 h-5" />
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 absolute top-0.5 right-0.5"></span>
        </div>
      </div>

      {/* Screen Title */}
      <div className="mb-5">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Settings & Preferences
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Customize your private, on-device document workspace
        </p>
      </div>

      {/* Suite Active Card */}
      <div className="bg-indigo-50/70 dark:bg-slate-800/70 rounded-3xl p-4 border border-indigo-100 dark:border-slate-700/80 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                DocToolz Suite
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold">V1.0.2</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Active
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl flex items-center gap-3 border border-indigo-50/80 dark:border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">
              100% Offline & On-Device Processing
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Zero cloud uploads • Pure sandboxed privacy
            </p>
          </div>
        </div>
      </div>

      {/* THEME & APPEARANCE */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
            THEME & APPEARANCE
          </span>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
            Dynamic Engine
          </span>
        </div>

        {/* 3 Theme Swatch Cards */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          {/* Light */}
          <button
            onClick={() => setThemeMode('light')}
            className={`p-3.5 rounded-3xl bg-white dark:bg-slate-900 border text-center flex flex-col items-center justify-center transition-all ${
              themeMode === 'light'
                ? 'border-blue-500 ring-2 ring-blue-500/10 shadow-xs'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-2 shadow-2xs">
              <div className="w-6 h-6 rounded-full bg-amber-200"></div>
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Light</span>
            {themeMode === 'light' && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1"></span>
            )}
          </button>

          {/* Dark */}
          <button
            onClick={() => setThemeMode('dark')}
            className={`p-3.5 rounded-3xl bg-white dark:bg-slate-900 border text-center flex flex-col items-center justify-center transition-all ${
              themeMode === 'dark'
                ? 'border-blue-500 ring-2 ring-blue-500/10 shadow-xs'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center mb-2 shadow-2xs">
              <div className="w-6 h-6 rounded-full bg-indigo-200 dark:bg-indigo-800"></div>
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Dark</span>
            {themeMode === 'dark' && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1"></span>
            )}
          </button>

          {/* Auto */}
          <button
            onClick={() => setThemeMode('auto')}
            className={`p-3.5 rounded-3xl bg-white dark:bg-slate-900 border text-center flex flex-col items-center justify-center transition-all ${
              themeMode === 'auto'
                ? 'border-blue-500 ring-2 ring-blue-500/10 shadow-xs'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2 shadow-2xs text-slate-600 dark:text-slate-300">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Auto</span>
            {themeMode === 'auto' && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1"></span>
            )}
          </button>
        </div>

        {/* Toggles */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-3 border border-slate-200 dark:border-slate-800 space-y-3">
          {/* Material You */}
          <div className="flex items-center justify-between p-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Material You Monet
                </h4>
                <p className="text-[10px] text-slate-400">Harmonize with device wallpaper</p>
              </div>
            </div>
            <button
              onClick={() => setMaterialYou(!materialYou)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                materialYou ? 'bg-indigo-600 justify-end' : 'bg-slate-200 dark:bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
            </button>
          </div>

          {/* AMOLED Pitch Black */}
          <div className="flex items-center justify-between p-1 border-t border-slate-100 dark:border-slate-800 pt-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  AMOLED Pitch Black
                </h4>
                <p className="text-[10px] text-slate-400">True zero-lumen background</p>
              </div>
            </div>
            <button
              onClick={() => {
                const nextVal = !amoledBlack;
                setAmoledBlack(nextVal);
                if (nextVal && themeMode === 'light') {
                  setThemeMode('dark');
                }
              }}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                amoledBlack ? 'bg-indigo-600 justify-end' : 'bg-slate-200 dark:bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
            </button>
          </div>
        </div>
      </div>

      {/* LANGUAGE & REGION */}
      <div className="bg-amber-50/50 dark:bg-slate-800/60 rounded-3xl p-4 border border-amber-100 dark:border-slate-700/80 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
              <Languages className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Language & Region
              </h4>
              <p className="text-[10px] text-slate-400">Interface localization</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 text-[10px] font-bold">
            v2 Native
          </span>
        </div>

        {/* Segmented Switcher */}
        <div className="p-1 bg-white dark:bg-slate-900 rounded-full flex border border-amber-100 dark:border-slate-800">
          <button
            onClick={() => setLanguage('en')}
            className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${
              language === 'en'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            English (US)
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${
              language === 'hi'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            हिंदी (Hindi)
          </button>
        </div>
      </div>

      {/* STORAGE & SANDBOX */}
      <div className="bg-emerald-50/50 dark:bg-slate-800/60 rounded-3xl p-4 border border-emerald-100 dark:border-slate-700/80 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <Brush className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Storage & Sandbox
              </h4>
              <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                Local Cache: {cacheMb} MB
              </p>
            </div>
          </div>
          <button
            onClick={handleClearCache}
            className="flex items-center gap-1 px-3 py-1 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold hover:bg-emerald-50 active:scale-95 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>

        {cacheClearedToast && (
          <div className="flex items-center gap-1.5 p-2 px-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>All application caches cleared successfully! (0.0 MB)</span>
          </div>
        )}

        {/* Progress Gauge */}
        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-emerald-100/60 dark:border-slate-800">
          <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">
            <span>Render Temp Buffer</span>
            <span>{cacheMb} MB of 256 MB safe cap</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(6, (parseFloat(cacheMb) / 256) * 100))}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* PINNED SHORTCUTS */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
              <LayoutGrid className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Pinned Shortcuts</h4>
              <p className="text-[10px] text-slate-400">Reorder home quick tools</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold">
            4 Active
          </span>
        </div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: Doc Resizer */}
          <div
            onClick={() => setActiveTool('exactKbResizer')}
            className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 transition-all cursor-pointer shadow-2xs"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center mb-2">
              <FileImage className="w-4 h-4" />
            </div>
            <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">Doc Resizer</h5>
            <p className="text-[10px] text-slate-400 mt-0.5">A4, Letter, Custom</p>
          </div>

          {/* Card 2: HD Scanner */}
          <div
            onClick={() => setActiveTool('docScanner')}
            className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-purple-400 transition-all cursor-pointer shadow-2xs"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center mb-2">
              <Scan className="w-4 h-4" />
            </div>
            <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">HD Scanner</h5>
            <p className="text-[10px] text-slate-400 mt-0.5">Edge auto-detect</p>
          </div>

          {/* Card 3: PDF Compress */}
          <div
            onClick={() => setActiveTool('pdfCompress')}
            className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 transition-all cursor-pointer shadow-2xs"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center mb-2">
              <Minimize2 className="w-4 h-4" />
            </div>
            <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">PDF Compress</h5>
            <p className="text-[10px] text-slate-400 mt-0.5">Lossless • 90%</p>
          </div>

          {/* Card 4: Diff Compare / Format Convert */}
          <div
            onClick={() => setActiveTool('formatConvert')}
            className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-teal-400 transition-all cursor-pointer shadow-2xs"
          >
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 flex items-center justify-center mb-2">
              <FileDiff className="w-4 h-4" />
            </div>
            <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">Diff Compare</h5>
            <p className="text-[10px] text-slate-400 mt-0.5">Side-by-side diff</p>
          </div>
        </div>
      </div>

      {/* PRIVACY GUARANTEED CARD */}
      <div className="p-4 rounded-3xl bg-indigo-50/50 dark:bg-slate-800/50 border border-indigo-100/70 dark:border-slate-700/70 flex items-center gap-3.5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
          <Lock className="w-7 h-7" />
        </div>
        <div>
          <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
            Privacy Guaranteed
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
            Zero server uploads. Works completely offline once loaded.
          </p>
          <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mt-1 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" /> by Chandan Raj
          </p>
        </div>
      </div>
    </div>
  );
};
