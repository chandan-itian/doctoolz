import React, { useState, useMemo } from 'react';
import { useApp, ToolId } from '../../context/AppContext';
import {
  Zap,
  Sun,
  Moon,
  User,
  Search,
  Mic,
  Lock,
  Crop,
  Minimize2,
  GitFork,
  Scan,
  Calendar,
  Percent,
  PenTool,
  EyeOff,
  Stamp,
  Repeat,
  Type,
  QrCode,
  Wand2,
  LayoutGrid,
  Brush,
  TrendingUp,
  CreditCard,
  Layers,
} from 'lucide-react';

interface ToolItem {
  id: ToolId;
  titleLine1: string;
  titleLine2: string;
  bgColorLight: string;
  bgColorDark: string;
  iconColor: string;
  icon: React.ComponentType<{ className?: string }>;
  categories: Array<'all' | 'image' | 'pdf' | 'exam' | 'privacy'>;
  keywords: string[];
}

export const HomeView: React.FC = () => {
  const { setActiveTool, theme, toggleTheme, language, setMainTab } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'image' | 'pdf' | 'exam' | 'privacy'>('all');

  // The 20 Canonical Tools exactly matching Screen 1 (3-column pastel grid)
  const allTools: ToolItem[] = useMemo(
    () => [
      // 1. Photo Compressor (formerly Exact-KB Resizer)
      {
        id: 'exactKbResizer',
        titleLine1: 'Photo',
        titleLine2: 'Compressor',
        bgColorLight: 'bg-[#EEF5FF]',
        bgColorDark: 'dark:bg-[#1A2536]',
        iconColor: 'text-[#2563EB]',
        icon: Crop,
        categories: ['all', 'image', 'exam'],
        keywords: ['compress', 'photo compressor', 'exact', 'resizer', 'kb', '50kb', '20kb', 'image', 'फोटो', 'साइज'],
      },
      // 2. PDF Compress
      {
        id: 'pdfCompress',
        titleLine1: 'PDF',
        titleLine2: 'Compress',
        bgColorLight: 'bg-[#F5EEFD]',
        bgColorDark: 'dark:bg-[#251A36]',
        iconColor: 'text-[#9333EA]',
        icon: Minimize2,
        categories: ['all', 'pdf', 'exam'],
        keywords: ['pdf', 'compress', 'reduce', '100kb', '200kb', 'पीडीएफ'],
      },
      // 3. Merge & Split
      {
        id: 'mergeSplit',
        titleLine1: 'Merge &',
        titleLine2: 'Split',
        bgColorLight: 'bg-[#FFF7EC]',
        bgColorDark: 'dark:bg-[#332519]',
        iconColor: 'text-[#EA580C]',
        icon: GitFork,
        categories: ['all', 'pdf'],
        keywords: ['merge', 'split', 'combine', 'extract pages', 'जोड़ें', 'अलग'],
      },
      // 4. Document Scanner
      {
        id: 'docScanner',
        titleLine1: 'Document',
        titleLine2: 'Scanner',
        bgColorLight: 'bg-[#E6FAF5]',
        bgColorDark: 'dark:bg-[#142B28]',
        iconColor: 'text-[#0D9488]',
        icon: Scan,
        categories: ['all', 'image', 'pdf'],
        keywords: ['scanner', 'camera', 'scan', 'doc', 'hd', 'स्कैनर'],
      },
      // 5. PDF Protect
      {
        id: 'pdfProtect',
        titleLine1: 'PDF',
        titleLine2: 'Protect',
        bgColorLight: 'bg-[#FFF0F2]',
        bgColorDark: 'dark:bg-[#331C22]',
        iconColor: 'text-[#E11D48]',
        icon: Lock,
        categories: ['all', 'pdf', 'privacy'],
        keywords: ['protect', 'password', 'encrypt', 'lock', 'सुरक्षा', 'पासवर्ड'],
      },
      // 6. Photo and Signature Merger (formerly Admit Card Prep)
      {
        id: 'admitCardPrep',
        titleLine1: 'Photo & Sign',
        titleLine2: 'Merger',
        bgColorLight: 'bg-[#EEF5FF]',
        bgColorDark: 'dark:bg-[#1A2536]',
        iconColor: 'text-[#2563EB]',
        icon: CreditCard,
        categories: ['all', 'exam', 'image'],
        keywords: ['admit card', 'photo and signature merger', 'photo signature', 'upsc', 'ssc', 'merger', 'एडमिट कार्ड'],
      },
      // 7. Age & Eligibility
      {
        id: 'ageEligibility',
        titleLine1: 'Age &',
        titleLine2: 'Eligibility',
        bgColorLight: 'bg-[#F5EEFD]',
        bgColorDark: 'dark:bg-[#251A36]',
        iconColor: 'text-[#9333EA]',
        icon: Calendar,
        categories: ['all', 'exam'],
        keywords: ['age', 'calculator', 'eligibility', 'cutoff', 'उम्र', 'कैलकुलेटर'],
      },
      // 8. CGPA to Percent
      {
        id: 'cgpaPercent',
        titleLine1: 'CGPA to',
        titleLine2: 'Percent',
        bgColorLight: 'bg-[#FFF7EC]',
        bgColorDark: 'dark:bg-[#332519]',
        iconColor: 'text-[#EA580C]',
        icon: Percent,
        categories: ['all', 'exam'],
        keywords: ['cgpa', 'percentage', 'grade', 'cbse', 'marks', 'प्रतिशत'],
      },
      // 9. Digital Signature
      {
        id: 'digitalSignature',
        titleLine1: 'Digital',
        titleLine2: 'Signature',
        bgColorLight: 'bg-[#E6FAF5]',
        bgColorDark: 'dark:bg-[#142B28]',
        iconColor: 'text-[#0D9488]',
        icon: PenTool,
        categories: ['all', 'image', 'exam'],
        keywords: ['signature', 'sign', 'draw', 'pad', 'हस्ताक्षर'],
      },
      // 10. Document Redactor
      {
        id: 'documentRedactor',
        titleLine1: 'Document',
        titleLine2: 'Redactor',
        bgColorLight: 'bg-[#FFF0F2]',
        bgColorDark: 'dark:bg-[#331C22]',
        iconColor: 'text-[#E11D48]',
        icon: EyeOff,
        categories: ['all', 'privacy', 'image'],
        keywords: ['redact', 'mask', 'hide', 'aadhaar', 'pan', 'ब्लर'],
      },
      // 11. Custom Watermark
      {
        id: 'customWatermark',
        titleLine1: 'Custom',
        titleLine2: 'Watermark',
        bgColorLight: 'bg-[#EDF7FF]',
        bgColorDark: 'dark:bg-[#17263A]',
        iconColor: 'text-[#0284C7]',
        icon: Stamp,
        categories: ['all', 'privacy', 'pdf', 'image'],
        keywords: ['watermark', 'stamp', 'confidential', 'वाटरमार्क'],
      },
      // 12. PhotoToPdf (formerly Format Convert)
      {
        id: 'formatConvert',
        titleLine1: 'PhotoToPdf',
        titleLine2: 'Convert',
        bgColorLight: 'bg-[#F5EEFD]',
        bgColorDark: 'dark:bg-[#251A36]',
        iconColor: 'text-[#9333EA]',
        icon: Repeat,
        categories: ['all', 'image', 'pdf'],
        keywords: ['phototopdf', 'convert', 'jpg to pdf', 'pdf to photo', 'png', 'webp', 'कन्वर्ट'],
      },
      // 13. PDF to Word & OCR
      {
        id: 'pdfToWordOcr',
        titleLine1: 'PDF to Word',
        titleLine2: '& OCR',
        bgColorLight: 'bg-[#FFF7EC]',
        bgColorDark: 'dark:bg-[#332519]',
        iconColor: 'text-[#EA580C]',
        icon: Type,
        categories: ['all', 'pdf', 'exam'],
        keywords: ['ocr', 'text', 'extract', 'pdf to word', 'टेक्स्ट'],
      },
      // 14. QR & Barcode Studio
      {
        id: 'qrBarcodeStudio',
        titleLine1: 'QR &',
        titleLine2: 'Barcode Studio',
        bgColorLight: 'bg-[#E6FAF5]',
        bgColorDark: 'dark:bg-[#142B28]',
        iconColor: 'text-[#0D9488]',
        icon: QrCode,
        categories: ['all', 'privacy'],
        keywords: ['qr', 'barcode', 'scanner', 'upi', 'wifi', 'क्यूआर'],
      },
      // 15. Background Remover
      {
        id: 'backgroundRemover',
        titleLine1: 'Background',
        titleLine2: 'Remover',
        bgColorLight: 'bg-[#FFF0F2]',
        bgColorDark: 'dark:bg-[#331C22]',
        iconColor: 'text-[#E11D48]',
        icon: Wand2,
        categories: ['all', 'image', 'exam'],
        keywords: ['background', 'remover', 'white bg', 'passport', 'हटाएं'],
      },
      // 16. Page Reorder Pdf (formerly Reorder Pages)
      {
        id: 'reorderPages',
        titleLine1: 'Page Reorder',
        titleLine2: 'Pdf',
        bgColorLight: 'bg-[#EEF5FF]',
        bgColorDark: 'dark:bg-[#1A2536]',
        iconColor: 'text-[#2563EB]',
        icon: LayoutGrid,
        categories: ['all', 'pdf'],
        keywords: ['page reorder pdf', 'reorder', 'rotate', 'delete page', 'pdf', 'क्रम'],
      },
      // 17. Metadata Stripper
      {
        id: 'metadataStripper',
        titleLine1: 'Metadata',
        titleLine2: 'Stripper',
        bgColorLight: 'bg-[#F5EEFD]',
        bgColorDark: 'dark:bg-[#251A36]',
        iconColor: 'text-[#9333EA]',
        icon: Brush,
        categories: ['all', 'privacy'],
        keywords: ['metadata', 'exif', 'gps', 'cleaner', 'scrub', 'मेटाडेटा'],
      },
      // 18. Marksheet Cutoff
      {
        id: 'marksheetCutoff',
        titleLine1: 'Marksheet',
        titleLine2: 'Cutoff',
        bgColorLight: 'bg-[#FFF7EC]',
        bgColorDark: 'dark:bg-[#332519]',
        iconColor: 'text-[#EA580C]',
        icon: TrendingUp,
        categories: ['all', 'exam'],
        keywords: ['marksheet', 'cutoff', 'score', 'merit', 'rank', 'मार्कशीट'],
      },
      // 19. ID Card Maker
      {
        id: 'idCardMaker',
        titleLine1: 'ID Card',
        titleLine2: 'Maker',
        bgColorLight: 'bg-[#E6FAF5]',
        bgColorDark: 'dark:bg-[#142B28]',
        iconColor: 'text-[#0D9488]',
        icon: CreditCard,
        categories: ['all', 'exam', 'image'],
        keywords: ['id card', 'admit', 'candidate', 'student', 'आईडी कार्ड'],
      },
      // 20. Batch Process
      {
        id: 'batchProcess',
        titleLine1: 'Batch',
        titleLine2: 'Process',
        bgColorLight: 'bg-[#FFF0F2]',
        bgColorDark: 'dark:bg-[#331C22]',
        iconColor: 'text-[#E11D48]',
        icon: Layers,
        categories: ['all', 'image'],
        keywords: ['batch', 'multiple', 'bulk', 'resize all', 'बैच'],
      },
    ],
    []
  );

  // Category counts
  const categoryCounts = useMemo(
    () => ({
      all: allTools.length, // 20
      image: allTools.filter((t) => t.categories.includes('image')).length, // 8
      pdf: allTools.filter((t) => t.categories.includes('pdf')).length, // 6
      exam: allTools.filter((t) => t.categories.includes('exam')).length, // 8
      privacy: allTools.filter((t) => t.categories.includes('privacy')).length, // 5
    }),
    [allTools]
  );

  // Filtered tools
  const filteredTools = useMemo(() => {
    return allTools.filter((tool) => {
      const matchCat =
        selectedCategory === 'all' || tool.categories.includes(selectedCategory);
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        tool.titleLine1.toLowerCase().includes(q) ||
        tool.titleLine2.toLowerCase().includes(q) ||
        tool.keywords.some((k) => k.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [allTools, selectedCategory, searchQuery]);

  return (
    <div className="max-w-md mx-auto px-4 py-3 pb-28 text-slate-900 dark:text-slate-100 select-none">
      {/* Top Bar Header matching Screen 1 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            DocToolz
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme outline circle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-transform active:scale-95"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          {/* User profile avatar outline circle with green dot */}
          <button
            onClick={() => setMainTab('settings')}
            className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 relative cursor-pointer active:scale-95 transition-transform"
            aria-label="Settings & Profile"
          >
            <User className="w-5 h-5" />
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 absolute top-0.5 right-0.5"></span>
          </button>
        </div>
      </div>

      {/* Rounded Search Bar */}
      <div className="relative mb-3.5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            language === 'hi'
              ? 'टूल्स खोजें (compress, resizer, pdf)...'
              : 'Search tools (compress, resizer, pdf)...'
          }
          className="w-full pl-11 pr-11 py-3 rounded-full bg-[#F6F8FB] dark:bg-slate-800 border border-[#E5EAF2] dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        <Mic className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      </div>

      {/* Horizontal Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-5 no-scrollbar scroll-smooth">
        {[
          { id: 'all', label: 'All Tools', count: categoryCounts.all },
          { id: 'image', label: 'Photo & KB', count: categoryCounts.image },
          { id: 'pdf', label: 'PDF Tools', count: categoryCounts.pdf },
          { id: 'exam', label: 'Exam & Students', count: categoryCounts.exam },
          { id: 'privacy', label: 'Privacy & Safety', count: categoryCounts.privacy },
        ].map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#245FF4] text-white shadow-xs'
                  : 'bg-[#F1F4F9] dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive
                    ? 'bg-blue-700/60 text-white'
                    : 'bg-slate-200/80 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Section Header: ADDITIONAL TOOLS 20 */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-[11px] font-bold text-[#7B8B9E] dark:text-slate-400 tracking-wider uppercase">
          ADDITIONAL TOOLS
        </span>
        <span className="px-2 py-0.5 rounded-full bg-[#EEF4FF] dark:bg-blue-950/80 text-[#245FF4] dark:text-blue-400 text-xs font-bold">
          {filteredTools.length}
        </span>
      </div>

      {/* 3-Column Grid of 20 Rounded Pastel Cards */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-6">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`rounded-[26px] p-3 pt-4 pb-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-150 active:scale-95 shadow-2xs hover:shadow-sm ${tool.bgColorLight} ${tool.bgColorDark}`}
            >
              {/* White Circular Icon Container */}
              <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-xs flex items-center justify-center mb-2.5">
                <Icon className={`w-5 h-5 ${tool.iconColor}`} />
              </div>

              {/* 2-line Centered Label */}
              <div className="text-[11px] font-extrabold text-slate-800 dark:text-slate-100 leading-tight">
                <p>{tool.titleLine1}</p>
                <p>{tool.titleLine2}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Privacy Pill matching Screen 1 */}
      <div className="flex items-center justify-center mb-2">
        <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#F0F6FF] dark:bg-slate-800 border border-blue-100/70 dark:border-slate-700 text-[11px] font-medium text-slate-500 dark:text-slate-400 shadow-2xs">
          <Lock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span>100% On-Device • Zero Cloud Uploads</span>
        </div>
      </div>
    </div>
  );
};
