import type { Medication } from '../types/regimen';

export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatDateKey(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function formatFriendlyDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Returns the cycle number (1..totalCycles) and cycle day (1..cycleDurationDays) for a given date
 */
export function getCycleAndDayForDate(
  targetDate: Date,
  cycleStartDateStr: string,
  cycleDurationDays: number
): { cycleNumber: number; cycleDay: number; dateKey: string; isWithinRegimen: boolean } {
  const startDate = parseLocalDate(cycleStartDateStr);
  
  // Normalize both dates to midnight local time
  const startMs = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime();
  const targetMs = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).getTime();

  const diffDays = Math.floor((targetMs - startMs) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return { cycleNumber: 1, cycleDay: 1, dateKey: formatDateKey(targetDate), isWithinRegimen: false };
  }

  const cycleNumber = Math.floor(diffDays / cycleDurationDays) + 1;
  const cycleDay = (diffDays % cycleDurationDays) + 1;

  return {
    cycleNumber,
    cycleDay,
    dateKey: formatDateKey(targetDate),
    isWithinRegimen: true
  };
}

/**
 * Calculates the exact Date object for a given Cycle Number and Cycle Day
 */
export function getDateForCycleAndDay(
  cycleNumber: number,
  cycleDay: number,
  cycleStartDateStr: string,
  cycleDurationDays: number
): Date {
  const startDate = parseLocalDate(cycleStartDateStr);
  const totalOffsetDays = (cycleNumber - 1) * cycleDurationDays + (cycleDay - 1);
  
  const result = new Date(startDate);
  result.setDate(startDate.getDate() + totalOffsetDays);
  return result;
}

/**
 * Gets list of medications scheduled for a specific cycle day (1-28)
 */
export function getMedicationsForCycleDay(cycleDay: number, medications: Medication[]): Medication[] {
  return medications.filter(med => med.days.includes(cycleDay));
}

/**
 * Checks if a specific cycle day requires a clinic visit (e.g., Bortezomib injection)
 */
export function isClinicVisitDay(cycleDay: number, medications: Medication[]): boolean {
  const meds = getMedicationsForCycleDay(cycleDay, medications);
  return meds.some(m => m.route.toLowerCase().includes('clinic') || m.route.toLowerCase().includes('injection') || m.route.toLowerCase().includes('shot'));
}

/**
 * Checks if a day is a rest day (no medications due)
 */
export function isRestDay(cycleDay: number, medications: Medication[]): boolean {
  return getMedicationsForCycleDay(cycleDay, medications).length === 0;
}

/**
 * Returns color classes based on badgeColor string
 */
export function getBadgeColorClasses(badgeColor: string, isHighContrast: boolean = false) {
  if (isHighContrast) {
    return {
      bg: 'bg-black border-2 border-white text-white',
      badge: 'hc-light-bg bg-white text-black font-black',
      pill: 'bg-black text-white border-white',
      border: 'border-white'
    };
  }

  switch (badgeColor) {
    case 'primary': // Bortezomib (Injection) - Deep Sky Blue / Indigo
      return {
        bg: 'bg-sky-50 border-sky-300 text-sky-950',
        badge: 'bg-sky-600 text-white font-bold',
        pill: 'bg-sky-100 text-sky-900 border-sky-400',
        border: 'border-sky-500'
      };
    case 'secondary': // Cyclophosphamide (Pill) - Violet / Purple
      return {
        bg: 'bg-purple-50 border-purple-300 text-purple-950',
        badge: 'bg-purple-700 text-white font-bold',
        pill: 'bg-purple-100 text-purple-900 border-purple-400',
        border: 'border-purple-600'
      };
    case 'tertiary': // Dexamethasone (Steroid Pill) - Amber / Warm Coral
      return {
        bg: 'bg-amber-50 border-amber-300 text-amber-950',
        badge: 'bg-amber-600 text-white font-bold',
        pill: 'bg-amber-100 text-amber-900 border-amber-400',
        border: 'border-amber-500'
      };
    default:
      return {
        bg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
        badge: 'bg-emerald-600 text-white font-bold',
        pill: 'bg-emerald-100 text-emerald-900 border-emerald-400',
        border: 'border-emerald-500'
      };
  }
}
