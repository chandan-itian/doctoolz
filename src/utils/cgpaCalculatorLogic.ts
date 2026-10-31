/**
 * CGPA to Percentage and Marks Calculator Logic
 */

export type CgpaFormula = 'cbse' | 'aicte' | 'vtu' | 'mumbai' | 'direct10' | 'custom';

export interface CgpaFormulaInfo {
  id: CgpaFormula;
  nameEn: string;
  nameHi: string;
  formulaDesc: string;
}

export const CGPA_FORMULAS: CgpaFormulaInfo[] = [
  {
    id: 'cbse',
    nameEn: 'CBSE 10th / 12th Standard',
    nameHi: 'सीबीएसई (10वीं / 12वीं मानक)',
    formulaDesc: 'Percentage (%) = CGPA × 9.5',
  },
  {
    id: 'aicte',
    nameEn: 'AICTE Engineering Standard',
    nameHi: 'एआईसीटीई इंजीनियरिंग मानक',
    formulaDesc: 'Percentage (%) = (CGPA - 0.75) × 10',
  },
  {
    id: 'direct10',
    nameEn: 'Direct Multiplier (× 10)',
    nameHi: 'प्रत्यक्ष गुणक (× 10)',
    formulaDesc: 'Percentage (%) = CGPA × 10',
  },
  {
    id: 'mumbai',
    nameEn: 'Mumbai University Standard',
    nameHi: 'मुंबई विश्वविद्यालय मानक',
    formulaDesc: 'Percentage (%) = 7.1 × CGPA + 12 (for CGPA ≥ 7)',
  },
  {
    id: 'custom',
    nameEn: 'Custom Multiplier',
    nameHi: 'कस्टम गुणक (मनचाहा फ़ॉर्मूला)',
    formulaDesc: 'Percentage (%) = CGPA × Custom Factor',
  },
];

export function convertCgpaToPercentage(
  cgpa: number,
  formula: CgpaFormula = 'cbse',
  customFactor: number = 9.5
): { percentage: number; division: string; grade: string } {
  if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
    return { percentage: 0, division: 'N/A', grade: 'N/A' };
  }

  let percentage = 0;
  switch (formula) {
    case 'cbse':
      percentage = cgpa * 9.5;
      break;
    case 'aicte':
    case 'vtu':
      percentage = Math.max(0, (cgpa - 0.75) * 10);
      break;
    case 'direct10':
      percentage = cgpa * 10;
      break;
    case 'mumbai':
      if (cgpa >= 7) {
        percentage = 7.1 * cgpa + 12;
      } else {
        percentage = 7.2 * cgpa + 11;
      }
      break;
    case 'custom':
      percentage = cgpa * (customFactor || 9.5);
      break;
  }

  percentage = Math.min(100, Math.round(percentage * 100) / 100);

  // Determine Division & Grade
  let division = 'Third Division (तृतीय श्रेणी)';
  let grade = 'C';
  if (percentage >= 75) {
    division = 'First Class with Distinction (विशिष्ट योग्यता)';
    grade = 'A+';
  } else if (percentage >= 60) {
    division = 'First Division (प्रथम श्रेणी)';
    grade = 'A';
  } else if (percentage >= 45) {
    division = 'Second Division (द्वितीय श्रेणी)';
    grade = 'B';
  } else if (percentage < 33) {
    division = 'Failed (अनुत्तीर्ण)';
    grade = 'F';
  }

  return { percentage, division, grade };
}

export function calculateMarksPercentage(
  obtainedMarks: number,
  totalMarks: number
): { percentage: number; division: string; grade: string } {
  if (totalMarks <= 0 || obtainedMarks < 0 || obtainedMarks > totalMarks) {
    return { percentage: 0, division: 'N/A', grade: 'N/A' };
  }

  const percentage = Math.round((obtainedMarks / totalMarks) * 10000) / 100;

  let division = 'Third Division (तृतीय श्रेणी)';
  let grade = 'C';
  if (percentage >= 75) {
    division = 'First Class with Distinction (विशिष्ट योग्यता)';
    grade = 'A+';
  } else if (percentage >= 60) {
    division = 'First Division (प्रथम श्रेणी)';
    grade = 'A';
  } else if (percentage >= 45) {
    division = 'Second Division (द्वितीय श्रेणी)';
    grade = 'B';
  } else if (percentage < 33) {
    division = 'Failed (अनुत्तीर्ण)';
    grade = 'F';
  }

  return { percentage, division, grade };
}
