import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ToolHeader } from '../common/ToolHeader';
import { GraduationCap, Calculator, Award, Percent } from 'lucide-react';
import {
  convertCgpaToPercentage,
  calculateMarksPercentage,
  CGPA_FORMULAS,
  CgpaFormula,
} from '../../utils/cgpaCalculatorLogic';

export const CgpaCalculator: React.FC = () => {
  const { t, language } = useApp();
  const [activeTab, setActiveTab] = useState<'cgpa' | 'marks'>('cgpa');

  // CGPA State
  const [cgpaInput, setCgpaInput] = useState<number>(8.4);
  const [formula, setFormula] = useState<CgpaFormula>('cbse');
  const [customMultiplier, setCustomMultiplier] = useState<number>(9.5);

  // Marks State
  const [obtainedMarks, setObtainedMarks] = useState<number>(440);
  const [totalMarks, setTotalMarks] = useState<number>(500);

  const cgpaResult = useMemo(() => {
    return convertCgpaToPercentage(cgpaInput, formula, customMultiplier);
  }, [cgpaInput, formula, customMultiplier]);

  const marksResult = useMemo(() => {
    return calculateMarksPercentage(obtainedMarks, totalMarks);
  }, [obtainedMarks, totalMarks]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolHeader
        title={t.tools.cgpaCalculator.name}
        badge={t.tools.cgpaCalculator.badge}
        description={t.tools.cgpaCalculator.desc}
        icon={GraduationCap}
        iconGradient="from-teal-600 to-emerald-700"
      />

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('cgpa')}
            className={`pb-3 px-5 text-sm font-semibold transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'cgpa'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>{language === 'hi' ? 'CGPA से प्रतिशत (%)' : 'CGPA to Percentage (%)'}</span>
          </button>
          <button
            onClick={() => setActiveTab('marks')}
            className={`pb-3 px-5 text-sm font-semibold transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'marks'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>{language === 'hi' ? 'मार्क्स से प्रतिशत (%)' : 'Marks to Percentage (%)'}</span>
          </button>
        </div>

        {activeTab === 'cgpa' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'hi' ? 'अपना CGPA दर्ज करें (0.0 से 10.0):' : 'Enter Your CGPA (0.0 to 10.0):'}
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  value={cgpaInput}
                  onChange={(e) => setCgpaInput(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 text-base font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'hi' ? 'यूनिवर्सिटी / बोर्ड मानक फ़ॉर्मूला चुनें:' : 'Select Board / University Standard:'}
                </label>
                <div className="space-y-2">
                  {CGPA_FORMULAS.map((item) => (
                    <label
                      key={item.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        formula === item.id
                          ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/40 text-teal-950 dark:text-teal-200'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="formula"
                        checked={formula === item.id}
                        onChange={() => setFormula(item.id)}
                        className="mt-0.5 text-teal-600 focus:ring-teal-500"
                      />
                      <div>
                        <strong className="block font-semibold">
                          {language === 'hi' ? item.nameHi : item.nameEn}
                        </strong>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {item.formulaDesc}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {formula === 'custom' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Custom Multiplier Factor:
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={customMultiplier}
                    onChange={(e) => setCustomMultiplier(parseFloat(e.target.value) || 9.5)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                  />
                </div>
              )}
            </div>

            {/* Right Results */}
            <div className="bg-gradient-to-br from-teal-600 to-emerald-700 rounded-2xl p-6 text-white shadow-lg shadow-teal-600/15 space-y-4">
              <span className="text-xs uppercase font-semibold text-teal-100 tracking-wider">
                {language === 'hi' ? 'परिकलित परिणाम (Calculated Percentage)' : 'Calculated Result'}
              </span>

              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black">{cgpaResult.percentage}%</span>
              </div>

              <div className="pt-4 border-t border-teal-500/40 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-teal-100">Division:</span>
                  <strong className="font-semibold">{cgpaResult.division}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-teal-100">Grade:</span>
                  <span className="px-2.5 py-0.5 bg-white/20 rounded font-bold text-sm">
                    {cgpaResult.grade}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-teal-100">Applied Formula:</span>
                  <span className="font-mono text-[11px]">
                    {CGPA_FORMULAS.find((f) => f.id === formula)?.formulaDesc}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Marks Tab */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'hi' ? 'प्राप्तांक (Marks Obtained):' : 'Marks Obtained:'}
                </label>
                <input
                  type="number"
                  min="0"
                  max={totalMarks}
                  value={obtainedMarks}
                  onChange={(e) => setObtainedMarks(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 text-base font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'hi' ? 'कुल पूर्णांक (Total Maximum Marks):' : 'Total Maximum Marks:'}
                </label>
                <input
                  type="number"
                  min="1"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(parseFloat(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 text-base font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div className="flex gap-2">
                {[500, 600, 800, 1000].map((tot) => (
                  <button
                    key={tot}
                    onClick={() => setTotalMarks(tot)}
                    className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-teal-500"
                  >
                    Total: {tot}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-600 to-emerald-700 rounded-2xl p-6 text-white shadow-lg shadow-teal-600/15 space-y-4">
              <span className="text-xs uppercase font-semibold text-teal-100 tracking-wider">
                {language === 'hi' ? 'कुल प्रतिशत (Total Percentage)' : 'Total Percentage'}
              </span>

              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black">{marksResult.percentage}%</span>
              </div>

              <div className="pt-4 border-t border-teal-500/40 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-teal-100">Division:</span>
                  <strong className="font-semibold">{marksResult.division}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-teal-100">Grade:</span>
                  <span className="px-2.5 py-0.5 bg-white/20 rounded font-bold text-sm">
                    {marksResult.grade}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-teal-100">Marks Ratio:</span>
                  <span className="font-mono text-[11px]">
                    {obtainedMarks} / {totalMarks}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
