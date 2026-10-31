import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Zap, LucideIcon } from 'lucide-react';
import { ToolSwitcherModal } from './ToolSwitcherModal';

interface ToolHeaderProps {
  title: string;
  badge?: string;
  description: string;
  icon: LucideIcon;
  iconGradient?: string;
}

export const ToolHeader: React.FC<ToolHeaderProps> = ({
  title,
  badge,
  description,
  icon: Icon,
  iconGradient = 'from-blue-600 to-indigo-600',
}) => {
  const { t, setActiveTool } = useApp();
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  return (
    <>
      <div className="mb-6 bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveTool(null)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors w-fit group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>{t.backToAllTools}</span>
          </button>

          {/* Quick Tool Switcher Button */}
          <button
            onClick={() => setIsSwitcherOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all self-start sm:self-auto cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{t.switchTool}</span>
          </button>
        </div>

        <div className="flex items-start gap-3 sm:gap-4 mt-4">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${iconGradient} text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/10`}
          >
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {title}
              </h1>
              {badge && (
                <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800">
                  {badge}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
              {description}
            </p>
          </div>
        </div>
      </div>

      <ToolSwitcherModal
        isOpen={isSwitcherOpen}
        onClose={() => setIsSwitcherOpen(false)}
      />
    </>
  );
};
