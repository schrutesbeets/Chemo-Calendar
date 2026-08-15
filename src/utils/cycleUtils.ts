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
 * Returns color classes based on badgeColor string following Material Design 3 tokens
 */
export function getBadgeColorClasses(badgeColor: string, isHighContrast: boolean = false) {
  if (isHighContrast) {
    switch (badgeColor) {
      case 'primary': // Bortezomib Injection
        return {
          bg: 'md-primary-container border-2 border-white',
          badge: 'md-primary-container border border-white font-black',
          pill: 'md-primary-container border-2 border-white font-black',
          border: 'border-2 border-white'
        };
      case 'secondary': // Cyclophosphamide
        return {
          bg: 'md-secondary-container border-2 border-white',
          badge: 'md-secondary-container border border-white font-black',
          pill: 'md-secondary-container border-2 border-white font-black',
          border: 'border-2 border-white'
        };
      case 'tertiary': // Dexamethasone
        return {
          bg: 'md-tertiary-container border-2 border-white',
          badge: 'md-tertiary-container border border-white font-black',
          pill: 'md-tertiary-container border-2 border-white font-black',
          border: 'border-2 border-white'
        };
      default:
        return {
          bg: 'md-success-container border-2 border-white',
          badge: 'md-success-container border border-white font-black',
          pill: 'md-success-container border-2 border-white font-black',
          border: 'border-2 border-white'
        };
    }
  }

  switch (badgeColor) {
    case 'primary': // Bortezomib (Injection) - Material Primary
      return {
        bg: 'md-primary-container border-2 border-sky-400',
        badge: 'bg-sky-700 text-white font-bold',
        pill: 'md-primary-container border border-sky-400 font-bold',
        border: 'border-sky-500'
      };
    case 'secondary': // Cyclophosphamide (Pill) - Material Secondary
      return {
        bg: 'md-secondary-container border-2 border-purple-400',
        badge: 'bg-purple-700 text-white font-bold',
        pill: 'md-secondary-container border border-purple-400 font-bold',
        border: 'border-purple-600'
      };
    case 'tertiary': // Dexamethasone (Steroid Pill) - Material Tertiary
      return {
        bg: 'md-tertiary-container border-2 border-amber-400',
        badge: 'bg-amber-700 text-white font-bold',
        pill: 'md-tertiary-container border border-amber-400 font-bold',
        border: 'border-amber-500'
      };
    default:
      return {
        bg: 'md-success-container border-2 border-emerald-400',
        badge: 'bg-emerald-700 text-white font-bold',
        pill: 'md-success-container border border-emerald-400 font-bold',
        border: 'border-emerald-500'
      };
  }
}
