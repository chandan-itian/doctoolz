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
  Search,
  ArrowRight,
  Shield,
  Zap,
  Lock,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { t, setActiveTool } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toolsList = useMemo(() => {
    return [
      {
        id: 'compressor' as ToolId,
        icon: FileImage,
        color: 'from-blue-600 to-indigo-600',
        badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
        title: t.tools.compressor.name,
        desc: t.tools.compressor.desc,
        badge: t.tools.compressor.badge,
        category: 'image',
        keywords: ['compress', 'kb', 'reduce', '20kb', '50kb', '100kb', 'size', 'फोटो', 'साइज', 'कम'],
      },
      {
        id: 'passport' as ToolId,
        icon: UserCheck,
        color: 'from-emerald-600 to-teal-600',
        badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
        title: t.tools.passport.name,
        desc: t.tools.passport.desc,
        badge: t.tools.passport.badge,
        category: 'id',
        keywords: ['passport', 'visa', '3.5x4.5', '2x2', 'sheet', 'print', '4x6', 'पासपोर्ट', 'वीजा'],
      },
      {
        id: 'signature' as ToolId,
        icon: PenTool,
        color: 'from-amber-500 to-orange-600',
        badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
        title: t.tools.signature.name,
        desc: t.tools.signature.desc,
        badge: t.tools.signature.badge,
        category: 'exam',
        keywords: ['signature', 'sign', '10kb', '20kb', 'ssc', 'upsc', 'cleaner', 'हस्ताक्षर', 'सिग्नेचर'],
      },
      {
        id: 'dimensionDpi' as ToolId,
        icon: Maximize2,
        color: 'from-cyan-600 to-blue-600',
        badgeColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300',
        title: t.tools.dimensionDpi.name,
        desc: t.tools.dimensionDpi.desc,
        badge: t.tools.dimensionDpi.badge,
        category: 'image',
        keywords: ['dpi', '300', '200', 'bit depth', 'pixels', 'cm', 'inches', 'रेजोल्यूशन', 'पिक्सल'],
      },
      {
        id: 'photoSignMerge' as ToolId,
        icon: Layers,
        color: 'from-purple-600 to-indigo-600',
        badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
        title: t.tools.photoSignMerge.name,
        desc: t.tools.photoSignMerge.desc,
        badge: t.tools.photoSignMerge.badge,
        category: 'exam',
        keywords: ['merge', 'dop', 'date of photo', 'name', 'card', 'मर्ज', 'नाम', 'तारीख'],
      },
      {
        id: 'photoToPdf' as ToolId,
        icon: FileText,
        color: 'from-rose-600 to-pink-600',
        badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
        title: t.tools.photoToPdf.name,
        desc: t.tools.photoToPdf.desc,
        badge: t.tools.photoToPdf.badge,
        category: 'pdf',
        keywords: ['pdf', 'jpg to pdf', 'images to pdf', 'convert', 'फोटो से pdf'],
      },
      {
        id: 'pdfToPhoto' as ToolId,
        icon: ImageIcon,
        color: 'from-indigo-600 to-sky-600',
        badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
        title: t.tools.pdfToPhoto.name,
        desc: t.tools.pdfToPhoto.desc,
        badge: t.tools.pdfToPhoto.badge,
        category: 'pdf',
        keywords: ['pdf to jpg', 'pdf to image', 'extract', 'pages', 'pdf से फोटो'],
      },
      {
        id: 'ocr' as ToolId,
        icon: Sparkles,
        color: 'from-violet-600 to-fuchsia-600',
        badgeColor: 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300',
        title: t.tools.ocr.name,
        desc: t.tools.ocr.desc,
        badge: t.tools.ocr.badge,
        category: 'ocr',
        keywords: ['ocr', 'text', 'extract', 'hindi', 'english', 'image to text', 'टेक्स्ट'],
      },
    ];
  }, [t]);

  const filteredTools = useMemo(() => {
    return toolsList.filter((tool) => {
      const matchesCategory =
        selectedCategory === 'all' || tool.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const inTitle = tool.title.toLowerCase().includes(q);
      const inDesc = tool.desc.toLowerCase().includes(q);
      const inKeywords = tool.keywords.some((k) => k.toLowerCase().includes(q));

      return inTitle || inDesc || inKeywords;
    });
  }, [toolsList, selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <Zap className="w-3.5 h-3.5" />
          <span>Inspired by PI7 • 100% Client-Side Processing</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight sm:leading-tight mb-4">
          {t.tagline}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          Compress to exact KB, format official passport photos, change DPI/bit depth, merge signatures with DOP, convert PDF, and run Hindi OCR — directly in your browser with zero server latency.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto mb-6">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm shadow-lg shadow-slate-200/50 dark:shadow-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
          />
        </div>

        {/* Quick Tags */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300 mr-1">Trending:</span>
          {t.popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag.split(' ')[0])}
              className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'All Tools' },
          { id: 'image', label: 'Image & DPI' },
          { id: 'id', label: 'Passport & Print' },
          { id: 'exam', label: 'Exam Specials' },
          { id: 'pdf', label: 'PDF Suite' },
          { id: 'ocr', label: 'OCR & Text' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-400'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className="group relative bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${tool.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tool.badgeColor}`}>
                    {tool.badge}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2 leading-snug">
                  {tool.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {tool.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                <span>Open Tool</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm font-semibold text-slate-500">No tools match your search criteria.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-3 text-xs font-bold text-indigo-600 dark:text-indigo-400 underline"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Feature Highlights Banner */}
      <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-cyan-500/10 to-emerald-500/10 border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">100% Privacy Focused</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Unlike cloud-upload sites, your sensitive photos and ID documents are processed locally in RAM.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">Instant Execution</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Zero network upload time. Output is produced instantly via WebAssembly & Canvas rendering.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">Official Portal Ready</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Presets strictly aligned with UPSC, SSC, Banking, Railways, and Visa requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
