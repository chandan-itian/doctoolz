import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ToolHeader } from '../common/ToolHeader';
import { Calendar, CheckCircle2, XCircle, Clock, Award, Sparkles } from 'lucide-react';
import {
  calculateAge,
  CandidateCategory,
  CATEGORY_RELAXATION,
} from '../../utils/ageCalculatorLogic';

export const AgeCalculator: React.FC = () => {
  const { t, language } = useApp();
  const [dob, setDob] = useState<string>('2000-08-15');
  const [cutoffDate, setCutoffDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [category, setCategory] = useState<CandidateCategory>('UR_EWS');

  const result = useMemo(() => {
    return calculateAge(dob, cutoffDate, category, language);
  }, [dob, cutoffDate, category, language]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <ToolHeader
        title={t.tools.ageCalculator.name}
        badge={t.tools.ageCalculator.badge}
        description={t.tools.ageCalculator.desc}
        icon={Calendar}
        iconGradient="from-emerald-600 to-green-700"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Inputs */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 lg:col-span-1">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>{language === 'hi' ? 'आयु विवरण दर्ज करें' : 'Enter Age Details'}</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {language === 'hi' ? 'जन्म तिथि (Date of Birth):' : 'Date of Birth (DOB):'}
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {language === 'hi' ? 'कट-ऑफ तिथि (Age as on Date):' : 'Cut-off Date (Age as on):'}
            </label>
            <input
              type="date"
              value={cutoffDate}
              onChange={(e) => setCutoffDate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              <button
                onClick={() => setCutoffDate(new Date().toISOString().split('T')[0])}
                className="text-[11px] px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-600 dark:text-slate-300 rounded-md transition-colors"
              >
                {language === 'hi' ? 'आज की तारीख' : 'Today'}
              </button>
              <button
                onClick={() => setCutoffDate('2025-08-01')}
                className="text-[11px] px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-600 dark:text-slate-300 rounded-md transition-colors"
              >
                01-08-2025 (SSC/UPSC)
              </button>
              <button
                onClick={() => setCutoffDate('2025-01-01')}
                className="text-[11px] px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-600 dark:text-slate-300 rounded-md transition-colors"
              >
                01-01-2025
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {language === 'hi' ? 'श्रेणी (Category for Age Relaxation):' : 'Category (Age Relaxation):'}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CandidateCategory)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              {(Object.keys(CATEGORY_RELAXATION) as CandidateCategory[]).map((cat) => (
                <option key={cat} value={cat}>
                  {language === 'hi' ? CATEGORY_RELAXATION[cat].hi : CATEGORY_RELAXATION[cat].en}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Results */}
        <div className="space-y-6 lg:col-span-2">
          {result ? (
            <>
              {/* Primary Age Banner */}
              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-lg shadow-emerald-600/15">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-100 mb-1">
                  {language === 'hi' ? 'कट-ऑफ तिथि पर आपकी सटीक आयु' : 'Exact Age on Cut-off Date'}
                </p>
                <div className="flex flex-wrap items-baseline gap-3 my-2">
                  <span className="text-4xl sm:text-5xl font-black tracking-tight">
                    {result.years}
                  </span>
                  <span className="text-lg font-medium text-emerald-100">
                    {language === 'hi' ? 'वर्ष (Years)' : 'Years'}
                  </span>
                  <span className="text-4xl sm:text-5xl font-black tracking-tight">
                    {result.months}
                  </span>
                  <span className="text-lg font-medium text-emerald-100">
                    {language === 'hi' ? 'माह (Months)' : 'Months'}
                  </span>
                  <span className="text-4xl sm:text-5xl font-black tracking-tight">
                    {result.days}
                  </span>
                  <span className="text-lg font-medium text-emerald-100">
                    {language === 'hi' ? 'दिन (Days)' : 'Days'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-emerald-500/40 text-xs">
                  <div>
                    <span className="text-emerald-200 block">
                      {language === 'hi' ? 'जन्म का दिन' : 'Birth Day'}
                    </span>
                    <strong className="text-sm font-semibold">{result.dayOfWeek}</strong>
                  </div>
                  <div>
                    <span className="text-emerald-200 block">
                      {language === 'hi' ? 'कुल दिन' : 'Total Days'}
                    </span>
                    <strong className="text-sm font-semibold">{result.totalDays.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-emerald-200 block">
                      {language === 'hi' ? 'कुल सप्ताह' : 'Total Weeks'}
                    </span>
                    <strong className="text-sm font-semibold">{result.totalWeeks.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-emerald-200 block">
                      {language === 'hi' ? 'अगला जन्मदिन' : 'Next Birthday'}
                    </span>
                    <strong className="text-sm font-semibold">
                      {result.nextBirthday.months}m {result.nextBirthday.days}d
                    </strong>
                  </div>
                </div>
              </div>

              {/* Exam Eligibility Checker */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-600" />
                    <span>
                      {language === 'hi'
                        ? 'प्रमुख सरकारी प्रतियोगी परीक्षा पात्रता (Eligibility Check)'
                        : 'Popular Competitive Exams Eligibility'}
                    </span>
                  </h3>
                  <span className="text-xs px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold rounded-lg border border-emerald-200 dark:border-emerald-800">
                    {CATEGORY_RELAXATION[category].years > 0
                      ? `+${CATEGORY_RELAXATION[category].years} Yrs Relaxation Applied`
                      : 'No Relaxation'}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                        <th className="py-2.5 px-3">Exam</th>
                        <th className="py-2.5 px-3">Age Limit</th>
                        <th className="py-2.5 px-3">Max Allowed</th>
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {result.eligibility.map((exam, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                            {exam.examName}
                          </td>
                          <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                            {exam.minAge} – {exam.maxAge} Yrs
                          </td>
                          <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                            {exam.effectiveMaxAge} Yrs
                          </td>
                          <td className="py-3 px-3 text-right">
                            {exam.isEligible ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>{language === 'hi' ? 'पात्र (Eligible)' : 'Eligible'}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                                <XCircle className="w-3.5 h-3.5" />
                                <span>{exam.reason}</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center border border-slate-200 dark:border-slate-800 text-slate-400">
              {language === 'hi' ? 'कृपया मान्य जन्म तिथि दर्ज करें' : 'Please enter a valid date of birth'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
