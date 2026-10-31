/**
 * Government Exam & Student Age Calculator Logic
 * Calculates exact age on cut-off date with years, months, days, total stats,
 * and category-based eligibility check for competitive exams.
 */

export interface AgeCalculationResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  dayOfWeek: string;
  nextBirthday: {
    months: number;
    days: number;
  };
  eligibility: {
    examName: string;
    minAge: number;
    maxAge: number;
    categoryRelaxation: number;
    effectiveMaxAge: number;
    isEligible: boolean;
    reason: string;
  }[];
}

export type CandidateCategory = 'UR_EWS' | 'OBC' | 'SC_ST' | 'PWD' | 'EX_SERVICEMAN';

export const CATEGORY_RELAXATION: Record<CandidateCategory, { en: string; hi: string; years: number }> = {
  UR_EWS: { en: 'General / EWS (No Relaxation)', hi: 'सामान्य / ईडब्ल्यूएस (छूट नहीं)', years: 0 },
  OBC: { en: 'OBC (Non-Creamy Layer) (+3 Years)', hi: 'ओबीसी (नॉन-क्रीमी लेयर) (+3 वर्ष छूट)', years: 3 },
  SC_ST: { en: 'SC / ST (+5 Years)', hi: 'अनुसूचित जाति / जनजाति (+5 वर्ष छूट)', years: 5 },
  PWD: { en: 'PwD / Divyangjan (+10 Years)', hi: 'दिव्यांगजन (+10 वर्ष छूट)', years: 10 },
  EX_SERVICEMAN: { en: 'Ex-Serviceman (+5 Years)', hi: 'भूतपूर्व सैनिक (+5 वर्ष छूट)', years: 5 },
};

export const POPULAR_EXAMS = [
  { id: 'ssc_cgl', nameEn: 'SSC CGL', nameHi: 'एसएससी सीजीएल', minAge: 18, maxAge: 30 },
  { id: 'upsc_cse', nameEn: 'UPSC Civil Services (IAS/IPS)', nameHi: 'यूपीएससी सिविल सेवा', minAge: 21, maxAge: 32 },
  { id: 'ibps_po', nameEn: 'IBPS PO / Bank PO', nameHi: 'आईबीपीएस बैंक पीओ', minAge: 20, maxAge: 30 },
  { id: 'rrb_ntpc', nameEn: 'Railway RRB NTPC Graduate', nameHi: 'रेलवे आरआरबी एनटीपीसी', minAge: 18, maxAge: 33 },
  { id: 'ssc_chsl', nameEn: 'SSC CHSL (10+2)', nameHi: 'एसएससी सीएचएसएल', minAge: 18, maxAge: 27 },
  { id: 'nda', nameEn: 'NDA (National Defence Academy)', nameHi: 'एनडीए (रक्षा अकादमी)', minAge: 16.5, maxAge: 19.5 },
];

export function calculateAge(
  dobStr: string,
  cutoffDateStr: string,
  category: CandidateCategory = 'UR_EWS',
  lang: 'en' | 'hi' = 'hi'
): AgeCalculationResult | null {
  if (!dobStr || !cutoffDateStr) return null;

  const dob = new Date(dobStr);
  const cutoff = new Date(cutoffDateStr);

  if (isNaN(dob.getTime()) || isNaN(cutoff.getTime()) || dob > cutoff) {
    return null;
  }

  // Calculate Years, Months, Days
  let years = cutoff.getFullYear() - dob.getFullYear();
  let months = cutoff.getMonth() - dob.getMonth();
  let days = cutoff.getDate() - dob.getDate();

  if (days < 0) {
    months -= 1;
    // Days in previous month of cutoff
    const prevMonthLastDay = new Date(cutoff.getFullYear(), cutoff.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  // Total stats
  const diffTime = cutoff.getTime() - dob.getTime();
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;

  // Day of birth
  const daysOfWeekEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const daysOfWeekHi = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
  const dayOfWeek = lang === 'hi' ? daysOfWeekHi[dob.getDay()] : daysOfWeekEn[dob.getDay()];

  // Next birthday relative to cutoff
  const nextBdayYear = cutoff.getMonth() > dob.getMonth() || (cutoff.getMonth() === dob.getMonth() && cutoff.getDate() > dob.getDate())
    ? cutoff.getFullYear() + 1
    : cutoff.getFullYear();
  const nextBday = new Date(nextBdayYear, dob.getMonth(), dob.getDate());
  let bdayMonths = nextBday.getMonth() - cutoff.getMonth();
  let bdayDays = nextBday.getDate() - cutoff.getDate();
  if (bdayDays < 0) {
    bdayMonths -= 1;
    const prevMonthLastDay = new Date(nextBday.getFullYear(), nextBday.getMonth(), 0).getDate();
    bdayDays += prevMonthLastDay;
  }
  if (bdayMonths < 0) {
    bdayMonths += 12;
  }

  // Exact age as a decimal number for exam eligibility checks
  const exactAgeYears = years + months / 12 + days / 365.25;
  const relaxationYears = CATEGORY_RELAXATION[category].years;

  // Exam eligibility evaluations
  const eligibility = POPULAR_EXAMS.map((exam) => {
    const effectiveMaxAge = exam.maxAge + relaxationYears;
    const isMinOk = exactAgeYears >= exam.minAge;
    const isMaxOk = exactAgeYears <= effectiveMaxAge;
    const isEligible = isMinOk && isMaxOk;

    let reason = '';
    if (!isMinOk) {
      reason = lang === 'hi' ? `न्यूनतम आयु (${exam.minAge} वर्ष) से कम` : `Below minimum age (${exam.minAge} yrs)`;
    } else if (!isMaxOk) {
      reason = lang === 'hi'
        ? `अधिकतम आयु सीमा (${effectiveMaxAge} वर्ष छूट सहित) समाप्त`
        : `Exceeds max age limit (${effectiveMaxAge} yrs with relaxation)`;
    } else {
      reason = lang === 'hi' ? 'पात्र हैं (Eligible)' : 'Eligible';
    }

    return {
      examName: lang === 'hi' ? exam.nameHi : exam.nameEn,
      minAge: exam.minAge,
      maxAge: exam.maxAge,
      categoryRelaxation: relaxationYears,
      effectiveMaxAge,
      isEligible,
      reason,
    };
  });

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    totalMonths,
    dayOfWeek,
    nextBirthday: {
      months: bdayMonths,
      days: bdayDays,
    },
    eligibility,
  };
}
