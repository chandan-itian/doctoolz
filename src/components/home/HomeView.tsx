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
  ArrowRight,
  Shield,
  Zap,
  Lock,
  Sparkle,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { t, setActiveTool, language } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'image' | 'pdf' | 'exam' | 'privacy'>('all');

  const toolsList = useMemo(() => {
    return [
      // 1. Image Compressor
      {
        id: 'compressor' as ToolId,
        icon: FileImage,
        color: 'from-blue-600 to-indigo-600',
        badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
        title: t.tools.compressor.name,
        desc: t.tools.compressor.desc,
        badge: t.tools.compressor.badge,
        categories: ['all', 'image', 'exam'],
        keywords: ['compress', 'kb', 'reduce', '20kb', '50kb', '100kb', 'size', 'फोटो', 'साइज', 'कम'],
      },
      // 2. Passport Photo Maker
      {
        id: 'passport' as ToolId,
        icon: UserCheck,
        color: 'from-emerald-600 to-teal-600',
        badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
        title: t.tools.passport.name,
        desc: t.tools.passport.desc,
        badge: t.tools.passport.badge,
        categories: ['all', 'image', 'exam'],
        keywords: ['passport', 'visa', '3.5x4.5', '2x2', 'sheet', 'print', '4x6', 'पासपोर्ट', 'वीजा'],
      },
      // 3. Signature Resizer
      {
        id: 'signature' as ToolId,
        icon: PenTool,
        color: 'from-amber-500 to-orange-600',
        badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
        title: t.tools.signature.name,
        desc: t.tools.signature.desc,
        badge: t.tools.signature.badge,
        categories: ['all', 'image', 'exam'],
        keywords: ['signature', 'sign', '10kb', '12kb', '15kb', '16kb', '20kb', 'ssc', 'upsc', 'cleaner', 'हस्ताक्षर', 'सिग्नेचर'],
      },
      // 4. Custom Dimension DPI
      {
        id: 'dimensionDpi' as ToolId,
        icon: Maximize2,
        color: 'from-cyan-600 to-blue-600',
        badgeColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300',
        title: t.tools.dimensionDpi.name,
        desc: t.tools.dimensionDpi.desc,
        badge: t.tools.dimensionDpi.badge,
        categories: ['all', 'image'],
        keywords: ['dpi', '300', '200', 'bit depth', 'pixels', 'cm', 'inches', 'रेजोल्यूशन', 'पिक्सल'],
      },
      // 5. Photo & Signature Merger
      {
        id: 'photoSignMerge' as ToolId,
        icon: Layers,
        color: 'from-purple-600 to-indigo-600',
        badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
        title: t.tools.photoSignMerge.name,
        desc: t.tools.photoSignMerge.desc,
        badge: t.tools.photoSignMerge.badge,
        categories: ['all', 'image', 'exam'],
        keywords: ['merge', 'photo and signature', 'card', 'मर्ज', 'सिग्नेचर', 'फोटो'],
      },
      // 6. Photo to PDF
      {
        id: 'photoToPdf' as ToolId,
        icon: FileText,
        color: 'from-rose-600 to-pink-600',
        badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
        title: t.tools.photoToPdf.name,
        desc: t.tools.photoToPdf.desc,
        badge: t.tools.photoToPdf.badge,
        categories: ['all', 'pdf'],
        keywords: ['pdf', 'jpg to pdf', 'images to pdf', 'convert', 'फोटो से pdf'],
      },
      // 7. PDF to Photo
      {
        id: 'pdfToPhoto' as ToolId,
        icon: ImageIcon,
        color: 'from-violet-600 to-purple-600',
        badgeColor: 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300',
        title: t.tools.pdfToPhoto.name,
        desc: t.tools.pdfToPhoto.desc,
        badge: t.tools.pdfToPhoto.badge,
        categories: ['all', 'pdf'],
        keywords: ['pdf to jpg', 'pdf to png', 'extract', 'pages', 'pdf से फोटो'],
      },
      // 8. OCR Image to Text
      {
        id: 'ocr' as ToolId,
        icon: Sparkles,
        color: 'from-amber-600 to-yellow-600',
        badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
        title: t.tools.ocr.name,
        desc: t.tools.ocr.desc,
        badge: t.tools.ocr.badge,
        categories: ['all', 'privacy'],
        keywords: ['ocr', 'text', 'hindi', 'english', 'extract', 'फोटो से टेक्स्ट'],
      },
      // 9. Size Increaser
      {
        id: 'sizeIncreaser' as ToolId,
        icon: ArrowUpRight,
        color: 'from-sky-600 to-blue-700',
        badgeColor: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
        title: t.tools.sizeIncreaser.name,
        desc: t.tools.sizeIncreaser.desc,
        badge: t.tools.sizeIncreaser.badge,
        categories: ['all', 'image', 'exam'],
        keywords: ['increase', 'kb', 'size increaser', 'minimum', '20kb', '50kb', 'बढ़ाएं', 'साइज'],
      },
      // 10. Exam Age Calculator
      {
        id: 'ageCalculator' as ToolId,
        icon: Calendar,
        color: 'from-emerald-600 to-green-700',
        badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
        title: t.tools.ageCalculator.name,
        desc: t.tools.ageCalculator.desc,
        badge: t.tools.ageCalculator.badge,
        categories: ['all', 'exam'],
        keywords: ['age', 'calculator', 'cutoff', 'ssc', 'upsc', 'eligibility', 'उम्र', 'आयु', 'कैलकुलेटर'],
      },
      // 11. CGPA Calculator
      {
        id: 'cgpaCalculator' as ToolId,
        icon: GraduationCap,
        color: 'from-teal-600 to-emerald-700',
        badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300',
        title: t.tools.cgpaCalculator.name,
        desc: t.tools.cgpaCalculator.desc,
        badge: t.tools.cgpaCalculator.badge,
        categories: ['all', 'exam'],
        keywords: ['cgpa', 'percentage', 'marks', 'cbse', 'aicte', 'grade', 'प्रतिशत', 'मार्कशीट'],
      },
      // 12. Digital Signature Pad
      {
        id: 'signaturePad' as ToolId,
        icon: Pen,
        color: 'from-indigo-600 to-blue-700',
        badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
        title: t.tools.signaturePad.name,
        desc: t.tools.signaturePad.desc,
        badge: t.tools.signaturePad.badge,
        categories: ['all', 'image', 'exam'],
        keywords: ['pad', 'draw signature', 'transparent', 'png', 'डिजिटल सिग्नेचर'],
      },
      // 13. PDF Compressor
      {
        id: 'pdfCompressor' as ToolId,
        icon: FileArchive,
        color: 'from-red-600 to-rose-700',
        badgeColor: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
        title: t.tools.pdfCompressor.name,
        desc: t.tools.pdfCompressor.desc,
        badge: t.tools.pdfCompressor.badge,
        categories: ['all', 'pdf', 'exam'],
        keywords: ['pdf compress', '100kb', '200kb', 'reduce pdf', 'पीडीएफ कंप्रेस'],
      },
      // 14. PDF Merger
      {
        id: 'pdfMerger' as ToolId,
        icon: FilePlus,
        color: 'from-orange-600 to-amber-700',
        badgeColor: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300',
        title: t.tools.pdfMerger.name,
        desc: t.tools.pdfMerger.desc,
        badge: t.tools.pdfMerger.badge,
        categories: ['all', 'pdf'],
        keywords: ['merge pdf', 'combine', 'multiple pdf', 'जोड़ें', 'मर्ज'],
      },
      // 15. PDF Splitter
      {
        id: 'pdfSplitter' as ToolId,
        icon: Scissors,
        color: 'from-pink-600 to-rose-600',
        badgeColor: 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300',
        title: t.tools.pdfSplitter.name,
        desc: t.tools.pdfSplitter.desc,
        badge: t.tools.pdfSplitter.badge,
        categories: ['all', 'pdf'],
        keywords: ['split pdf', 'extract pages', 'अलग करें', 'पेज'],
      },
      // 16. PDF Password
      {
        id: 'pdfPassword' as ToolId,
        icon: KeyRound,
        color: 'from-purple-700 to-indigo-800',
        badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
        title: t.tools.pdfPassword.name,
        desc: t.tools.pdfPassword.desc,
        badge: t.tools.pdfPassword.badge,
        categories: ['all', 'pdf', 'privacy'],
        keywords: ['password', 'protect', 'encrypt', 'lock pdf', 'पासवर्ड'],
      },
      // 17. Watermark Stamper
      {
        id: 'watermarkStamper' as ToolId,
        icon: ShieldAlert,
        color: 'from-amber-600 to-red-600',
        badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
        title: t.tools.watermarkStamper.name,
        desc: t.tools.watermarkStamper.desc,
        badge: t.tools.watermarkStamper.badge,
        categories: ['all', 'privacy', 'image'],
        keywords: ['watermark', 'aadhaar', 'pan', 'stamp', 'security', 'वाटरमार्क'],
      },
      // 18. Document Redactor
      {
        id: 'documentRedactor' as ToolId,
        icon: EyeOff,
        color: 'from-slate-700 to-zinc-900',
        badgeColor: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
        title: t.tools.documentRedactor.name,
        desc: t.tools.documentRedactor.desc,
        badge: t.tools.documentRedactor.badge,
        categories: ['all', 'privacy', 'image'],
        keywords: ['redact', 'blur', 'mask', 'hide', 'aadhaar number', 'ब्लर', 'छिपाएं'],
      },
      // 19. QR Tools
      {
        id: 'qrTools' as ToolId,
        icon: QrCode,
        color: 'from-teal-600 to-cyan-700',
        badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300',
        title: t.tools.qrTools.name,
        desc: t.tools.qrTools.desc,
        badge: t.tools.qrTools.badge,
        categories: ['all', 'privacy'],
        keywords: ['qr code', 'scanner', 'upi', 'wifi', 'camera', 'क्यूआर कोड'],
      },
      // 20. Image Cropper
      {
        id: 'imageCropper' as ToolId,
        icon: Crop,
        color: 'from-fuchsia-600 to-purple-700',
        badgeColor: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-950 dark:text-fuchsia-300',
        title: t.tools.imageCropper.name,
        desc: t.tools.imageCropper.desc,
        badge: t.tools.imageCropper.badge,
        categories: ['all', 'image', 'exam'],
        keywords: ['crop', 'circle cut', 'aspect ratio', '1:1', 'avatar', 'क्रॉप'],
      },
    ];
  }, [t]);

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      all: toolsList.length,
      image: toolsList.filter((t) => t.categories.includes('image')).length,
      pdf: toolsList.filter((t) => t.categories.includes('pdf')).length,
      exam: toolsList.filter((t) => t.categories.includes('exam')).length,
      privacy: toolsList.filter((t) => t.categories.includes('privacy')).length,
    };
  }, [toolsList]);

  // Filter tools
  const filteredTools = useMemo(() => {
    return toolsList.filter((tool) => {
      const matchesCategory =
        selectedCategory === 'all' || tool.categories.includes(selectedCategory);

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tool.title.toLowerCase().includes(q) ||
        tool.desc.toLowerCase().includes(q) ||
        tool.badge.toLowerCase().includes(q) ||
        tool.keywords.some((k) => k.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [toolsList, selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-4 shadow-sm animate-pulse">
          <Zap className="w-3.5 h-3.5" />
          <span>20+ Fast & 100% Private Client-Side Tools</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {t.brand} ⚡
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium">
          {t.tagline}
        </p>

        {/* Search Bar */}
        <div className="mt-6 relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Quick Tag Pills */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500">
          <span className="font-semibold text-slate-400">Quick Tags:</span>
          {t.popularTags.map((tag, i) => (
            <button
              key={i}
              onClick={() => setSearchQuery(tag.split(' ')[0])}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Senior-grade Category Filter Tabs */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {(
            [
              { id: 'all', icon: Sparkle, label: t.categories.all, count: categoryCounts.all },
              { id: 'image', icon: FileImage, label: t.categories.image, count: categoryCounts.image },
              { id: 'pdf', icon: FileText, label: t.categories.pdf, count: categoryCounts.pdf },
              { id: 'exam', icon: GraduationCap, label: t.categories.exam, count: categoryCounts.exam },
              { id: 'privacy', icon: Shield, label: t.categories.privacy, count: categoryCounts.privacy },
            ] as const
          ).map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`group px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`} />
                <span>{cat.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className="group bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800/90 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 shadow-2xs hover:shadow-xl active:scale-[0.98] transition-all duration-200 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tool.color} text-white flex items-center justify-center shadow-md shadow-indigo-500/15 group-hover:scale-105 active:scale-95 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${tool.badgeColor}`}
                  >
                    {tool.badge}
                  </span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {tool.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {tool.desc}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/70 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  {language === 'hi' ? 'टूल खोलें' : 'Open Tool'}
                </span>
                <div className="w-7 h-7 rounded-full bg-indigo-50 dark:bg-indigo-950/80 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredTools.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 mt-6">
          <Search className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base">
            No tools found for "{searchQuery}"
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Try searching with different keywords or switch category filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Trust & Privacy Guarantee Bar */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-slate-900 dark:to-slate-900/60 border border-blue-100 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              100% In-Browser Privacy
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Zero cloud uploads. Your confidential Aadhaar, certificates, and photos never leave your device.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Sub-Second Speed
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Powered by WebAssembly and HTML5 Canvas with instant client-side execution.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Free & Open Architecture
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Hosted 100% free on GitHub Pages with zero subscription fees, ads, or login walls.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
