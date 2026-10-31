import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  TrendingUp,
  Award,
  Calculator,
  Plus,
  Trash2,
  CheckCircle2,
  BarChart3,
} from 'lucide-react';

interface SubjectEntry {
  id: string;
  name: string;
  obtained: number;
  maxMarks: number;
}

export const MarksheetCutoff: React.FC = () => {
  const { setActiveTool, language } = useApp();
  const [subjects, setSubjects] = useState<SubjectEntry[]>([
    { id: '1', name: 'Mathematics', obtained: 85, maxMarks: 100 },
    { id: '2', name: 'Physics / Science', obtained: 78, maxMarks: 100 },
    { id: '3', name: 'General Studies / English', obtained: 82, maxMarks: 100 },
  ]);
  const [cutoffMarks, setCutoffMarks] = useState<number>(220);
  const [category, setCategory] = useState<'UR' | 'OBC' | 'EWS' | 'SC' | 'ST'>('UR');

  const addSubject = () => {
    setSubjects((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        name: `Subject ${prev.length + 1}`,
        obtained: 75,
        maxMarks: 100,
      },
    ]);
  };

  const updateSubject = (id: string, field: keyof SubjectEntry, value: any) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const removeSubject = (id: string) => {
    if (subjects.length <= 1) return;
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const totalObtained = subjects.reduce((sum, s) => sum + (Number(s.obtained) || 0), 0);
  const totalMax = subjects.reduce((sum, s) => sum + (Number(s.maxMarks) || 0), 0);
  const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : '0';
  const margin = (totalObtained - cutoffMarks).toFixed(1);
  const isQualified = totalObtained >= cutoffMarks;

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setActiveTool(null)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'वापस' : 'Back'}</span>
        </button>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            {language === 'hi' ? 'मार्कशीट कटऑफ कैलकुलेटर' : 'Marksheet & Cutoff'}
          </h2>
        </div>
        <div className="w-12"></div>
      </div>

      {/* Aggregate Score Card */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 rounded-3xl p-5 border border-amber-200/80 dark:border-amber-900/60 shadow-xs mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
            {language === 'hi' ? 'कुल प्राप्तांक और प्रतिशत' : 'Total Score & Aggregate'}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              isQualified
                ? 'bg-emerald-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {isQualified
              ? language === 'hi'
                ? '✓ कटऑफ से ऊपर'
                : '✓ Above Cutoff'
              : language === 'hi'
              ? '✗ कटऑफ से नीचे'
              : '✗ Below Cutoff'}
          </span>
        </div>

        <div className="flex items-baseline gap-3 my-2">
          <span className="text-4xl font-black text-slate-900 dark:text-white">
            {percentage}%
          </span>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            ({totalObtained} / {totalMax} Marks)
          </span>
        </div>

        <div className="mt-3 pt-3 border-t border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between text-xs font-bold">
          <span className="text-slate-600 dark:text-slate-300">
            {language === 'hi' ? 'कटऑफ अंतर (Margin):' : 'Cutoff Margin:'}
          </span>
          <span className={Number(margin) >= 0 ? 'text-emerald-600' : 'text-red-500'}>
            {Number(margin) >= 0 ? `+${margin}` : margin} Marks
          </span>
        </div>
      </div>

      {/* Cutoff Target Settings */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs mb-4">
        <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-2">
          {language === 'hi' ? 'परीक्षा कटऑफ लक्ष्य' : 'Exam Cutoff Benchmark (Marks)'}
        </label>
        <input
          type="number"
          value={cutoffMarks}
          onChange={(e) => setCutoffMarks(Number(e.target.value))}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-800 dark:text-slate-100 mb-3"
        />

        <div className="flex gap-2">
          {(['UR', 'OBC', 'EWS', 'SC', 'ST'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                category === cat
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Subject-wise Marks List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
            {language === 'hi' ? 'विषयवार प्राप्तांक' : 'Subject Marks'}
          </span>
          <button
            onClick={addSubject}
            className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2.5 py-1 rounded-xl"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'विषय जोड़ें' : 'Add Subject'}</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {subjects.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700"
            >
              <input
                type="text"
                value={sub.name}
                onChange={(e) => updateSubject(sub.id, 'name', e.target.value)}
                className="flex-1 px-2.5 py-1.5 bg-white dark:bg-slate-900 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700"
              />
              <input
                type="number"
                value={sub.obtained}
                onChange={(e) => updateSubject(sub.id, 'obtained', Number(e.target.value))}
                className="w-16 px-2 py-1.5 bg-white dark:bg-slate-900 rounded-lg text-xs font-bold text-center border border-slate-200 dark:border-slate-700"
                placeholder="Obt."
              />
              <span className="text-xs text-slate-400">/</span>
              <input
                type="number"
                value={sub.maxMarks}
                onChange={(e) => updateSubject(sub.id, 'maxMarks', Number(e.target.value))}
                className="w-16 px-2 py-1.5 bg-white dark:bg-slate-900 rounded-lg text-xs font-bold text-center border border-slate-200 dark:border-slate-700"
                placeholder="Max"
              />
              <button
                onClick={() => removeSubject(sub.id)}
                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
