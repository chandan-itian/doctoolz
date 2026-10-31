import React, { useState, useMemo } from 'react';
import { useApp, ToolId } from '../../context/AppContext';
import {
  FileImage,
  UserCheck,
  PenTool,
  Maximize2,
  Layers,
  FileText,
  ImageIcon,
  Sparkles,
  ArrowUpRight,
  Calendar,
  GraduationCap,
  Pen,
  FileArchive,
  FilePlus,
  Scissors,
  KeyRound,
  ShieldAlert,
  EyeOff,
  QrCode,
  Crop,
  Search,
  X,
  Zap,
} from 'lucide-react';

interface ToolSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ToolSwitcherModal: React.FC<ToolSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { t, activeTool, setActiveTool } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<'all' | 'image' | 'pdf' | 'exam' | 'privacy'>('all');

  const allTools = useMemo(() => [
    {
      id: 'compressor' as ToolId,
      name: t.tools.compressor.name,
      desc: t.tools.compressor.desc,
      badge: t.tools.compressor.badge,
      icon: FileImage,
      color: 'from-blue-600 to-indigo-600',
      categories: ['all', 'image'],
    },
    {
      id: 'passport' as ToolId,
      name: t.tools.passport.name,
      desc: t.tools.passport.desc,
      badge: t.tools.passport.badge,
      icon: UserCheck,
      color: 'from-emerald-600 to-teal-600',
      categories: ['all', 'image', 'exam'],
    },
    {
      id: 'signature' as ToolId,
      name: t.tools.signature.name,
      desc: t.tools.signature.desc,
      badge: t.tools.signature.badge,
      icon: PenTool,
      color: 'from-amber-500 to-orange-600',
      categories: ['all', 'image', 'exam'],
    },
    {
      id: 'dimensionDpi' as ToolId,
      name: t.tools.dimensionDpi.name,
      desc: t.tools.dimensionDpi.desc,
      badge: t.tools.dimensionDpi.badge,
      icon: Maximize2,
      color: 'from-cyan-600 to-blue-600',
      categories: ['all', 'image'],
    },
    {
      id: 'photoSignMerge' as ToolId,
      name: t.tools.photoSignMerge.name,
      desc: t.tools.photoSignMerge.desc,
      badge: t.tools.photoSignMerge.badge,
      icon: Layers,
      color: 'from-purple-600 to-indigo-600',
      categories: ['all', 'image', 'exam'],
    },
    {
      id: 'photoToPdf' as ToolId,
      name: t.tools.photoToPdf.name,
      desc: t.tools.photoToPdf.desc,
      badge: t.tools.photoToPdf.badge,
      icon: FileText,
      color: 'from-rose-600 to-pink-600',
      categories: ['all', 'pdf'],
    },
    {
      id: 'pdfToPhoto' as ToolId,
      name: t.tools.pdfToPhoto.name,
      desc: t.tools.pdfToPhoto.desc,
      badge: t.tools.pdfToPhoto.badge,
      icon: ImageIcon,
      color: 'from-violet-600 to-purple-600',
      categories: ['all', 'pdf'],
    },
    {
      id: 'ocr' as ToolId,
      name: t.tools.ocr.name,
      desc: t.tools.ocr.desc,
      badge: t.tools.ocr.badge,
      icon: Sparkles,
      color: 'from-amber-600 to-yellow-600',
      categories: ['all', 'privacy'],
    },
    // New Tools
    {
      id: 'sizeIncreaser' as ToolId,
      name: t.tools.sizeIncreaser.name,
      desc: t.tools.sizeIncreaser.desc,
      badge: t.tools.sizeIncreaser.badge,
      icon: ArrowUpRight,
      color: 'from-sky-600 to-blue-700',
      categories: ['all', 'image', 'exam'],
    },
    {
      id: 'ageCalculator' as ToolId,
      name: t.tools.ageCalculator.name,
      desc: t.tools.ageCalculator.desc,
      badge: t.tools.ageCalculator.badge,
      icon: Calendar,
      color: 'from-emerald-600 to-green-700',
      categories: ['all', 'exam'],
    },
    {
      id: 'cgpaCalculator' as ToolId,
      name: t.tools.cgpaCalculator.name,
      desc: t.tools.cgpaCalculator.desc,
      badge: t.tools.cgpaCalculator.badge,
      icon: GraduationCap,
      color: 'from-teal-600 to-emerald-700',
      categories: ['all', 'exam'],
    },
    {
      id: 'signaturePad' as ToolId,
      name: t.tools.signaturePad.name,
      desc: t.tools.signaturePad.desc,
      badge: t.tools.signaturePad.badge,
      icon: Pen,
      color: 'from-indigo-600 to-blue-700',
      categories: ['all', 'image', 'exam'],
    },
    {
      id: 'pdfCompressor' as ToolId,
      name: t.tools.pdfCompressor.name,
      desc: t.tools.pdfCompressor.desc,
      badge: t.tools.pdfCompressor.badge,
      icon: FileArchive,
      color: 'from-red-600 to-rose-700',
      categories: ['all', 'pdf'],
    },
    {
      id: 'pdfMerger' as ToolId,
      name: t.tools.pdfMerger.name,
      desc: t.tools.pdfMerger.desc,
      badge: t.tools.pdfMerger.badge,
      icon: FilePlus,
      color: 'from-orange-600 to-amber-700',
      categories: ['all', 'pdf'],
    },
    {
      id: 'pdfSplitter' as ToolId,
      name: t.tools.pdfSplitter.name,
      desc: t.tools.pdfSplitter.desc,
      badge: t.tools.pdfSplitter.badge,
      icon: Scissors,
      color: 'from-pink-600 to-rose-600',
      categories: ['all', 'pdf'],
    },
    {
      id: 'pdfPassword' as ToolId,
      name: t.tools.pdfPassword.name,
      desc: t.tools.pdfPassword.desc,
      badge: t.tools.pdfPassword.badge,
      icon: KeyRound,
      color: 'from-purple-700 to-indigo-800',
      categories: ['all', 'pdf', 'privacy'],
    },
    {
      id: 'watermarkStamper' as ToolId,
      name: t.tools.watermarkStamper.name,
      desc: t.tools.watermarkStamper.desc,
      badge: t.tools.watermarkStamper.badge,
      icon: ShieldAlert,
      color: 'from-amber-600 to-red-600',
      categories: ['all', 'privacy', 'image'],
    },
    {
      id: 'documentRedactor' as ToolId,
      name: t.tools.documentRedactor.name,
      desc: t.tools.documentRedactor.desc,
      badge: t.tools.documentRedactor.badge,
      icon: EyeOff,
      color: 'from-slate-700 to-zinc-900',
      categories: ['all', 'privacy', 'image'],
    },
    {
      id: 'qrTools' as ToolId,
      name: t.tools.qrTools.name,
      desc: t.tools.qrTools.desc,
      badge: t.tools.qrTools.badge,
      icon: QrCode,
      color: 'from-teal-600 to-cyan-700',
      categories: ['all', 'privacy'],
    },
    {
      id: 'imageCropper' as ToolId,
      name: t.tools.imageCropper.name,
      desc: t.tools.imageCropper.desc,
      badge: t.tools.imageCropper.badge,
      icon: Crop,
      color: 'from-fuchsia-600 to-purple-700',
      categories: ['all', 'image', 'exam'],
    },
  ], [t]);

  const filtered = useMemo(() => {
    return allTools.filter((tool) => {
      const matchesCat = selectedCat === 'all' || tool.categories.includes(selectedCat);
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.desc.toLowerCase().includes(q) ||
        tool.badge.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [allTools, selectedCat, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                {t.switchTool}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {allTools.length} Browser-Based Productivity Tools
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchTool}
              className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {(['all', 'image', 'pdf', 'exam', 'privacy'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCat === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {t.categories[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="p-4 overflow-y-auto max-h-[55vh] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((tool) => {
            const Icon = tool.icon;
            const isCurrent = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => {
                  setActiveTool(tool.id);
                  onClose();
                }}
                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  isCurrent
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/30'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg bg-gradient-to-br ${tool.color} text-white flex items-center justify-center shrink-0 shadow-sm`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                      {tool.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>{filtered.length} tools available</span>
          <button
            onClick={() => {
              setActiveTool(null);
              onClose();
            }}
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            {t.backToAllTools}
          </button>
        </div>
      </div>
    </div>
  );
};
