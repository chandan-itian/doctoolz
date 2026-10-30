import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Zap, Heart, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useApp();

  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm transition-colors py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-black text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                {t.brand}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                100% Free
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              {t.footer.builtFor}
            </p>
          </div>

          {/* Privacy Guarantee */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Privacy & Security Guarantee</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              {t.footer.privacyCommitment}
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> No Registration
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Zero Cloud Storage
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Works Offline
              </span>
            </div>
          </div>

          {/* Standards & Presets */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-indigo-500" />
              <span>Exam & Official Standards</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Built with precision templates conforming to UPSC, SSC CGL/CHSL, IBPS, SBI, Railway RRB, CTET, NEET, JEE, US Visa (DS-160), and Indian Passport Seva Kendra standards.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} {t.brand}. {t.footer.rights}</p>
          <p className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>by Chandan Raj</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
