import type { Medication, DayOfWeek, RegimenConfig, CalendarDayInfo } from '../types/regimen';

/**
 * Date calculation and formatting helpers for Digital Pillbox
 */

/**
 * Parses YYYY-MM-DD string into a Local Date object at 00:00:00
 */
export function parseISODate(isoStr: string): Date {
  const parts = isoStr.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    return new Date(year, month, day, 0, 0, 0, 0);
  }
  const fallback = new Date(isoStr);
  return new Date(fallback.getFullYear(), fallback.getMonth(), fallback.getDate(), 0, 0, 0, 0);
}

/**
 * Formats a Date object to YYYY-MM-DD
 */
export function formatISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats a Date as Month and Year: "August 2026"
 */
export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Formats a Date for senior-friendly display: "Sunday, August 16, 2026"
 */
export function formatLongDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Formats a Date for compact day badge: "Aug 16"
 */
export function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Formats a Date as "Sun, Aug 16" for table rows and day headers
 */
export function formatWeekdayAndDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Calculates the exact Date for a specific cycle and day of cycle
 * @param startIsoStr Initial regimen cycle 1 start date
 * @param cycleDuration Days per cycle (usually 28)
 * @param cycleNumber 1-indexed cycle number (1..4)
 * @param cycleDay 1-indexed day within cycle (1..28)
 */
export function getDateForCycleAndDay(
  startIsoStr: string,
  cycleDuration: number,
  cycleNumber: number,
  cycleDay: number
): Date {
  const startDate = parseISODate(startIsoStr);
  const totalOffsetDays = (cycleNumber - 1) * cycleDuration + (cycleDay - 1);
  const result = new Date(startDate);
  result.setDate(result.getDate() + totalOffsetDays);
  return result;
}

/**
 * Determines cycle and day corresponding to a given date
 */
export function getCycleAndDayFromDate(
  startIsoStr: string,
  cycleDuration: number,
  totalCycles: number,
  targetDate: Date
): { cycle: number; day: number; isWithinRegimen: boolean } {
  const startDate = parseISODate(startIsoStr);
  const diffTime = targetDate.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { cycle: 1, day: 1, isWithinRegimen: false };
  }

  const cycleIndex = Math.floor(diffDays / cycleDuration);
  const cycle = cycleIndex + 1;
  const day = (diffDays % cycleDuration) + 1;

  if (cycle > totalCycles) {
    return { cycle: totalCycles, day: cycleDuration, isWithinRegimen: false };
  }

  return { cycle, day, isWithinRegimen: true };
}

/**
 * Returns today's date formatted as YYYY-MM-DD in local time
 */
export function getTodayISODate(): string {
  return formatISODate(new Date());
}

/**
 * Compares two ISO date strings
 */
export function isSameDay(dateStrA: string, dateStrB: string): boolean {
  return dateStrA === dateStrB;
}

export interface ScheduleEvaluationContext {
  date: Date;
  cycleDay?: number;
  cycleNumber?: number;
}

export const WEEKDAY_FULL_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
] as const;

export const WEEKDAY_SHORT_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

/**
 * Checks if a medication is scheduled for a given day/context
 */
export function isMedicationScheduled(
  med: Medication,
  context: ScheduleEvaluationContext
): boolean {
  const { date, cycleDay } = context;
  const routine = med.routine;

  if (!routine || routine.type === 'cycle_days') {
    const days = routine?.cycleDays && routine.cycleDays.length > 0 ? routine.cycleDays : med.days || [];
    return cycleDay !== undefined ? days.includes(cycleDay) : false;
  }

  if (routine.type === 'days_of_week') {
    const weekday = date.getDay() as DayOfWeek;
    return (routine.daysOfWeek || []).includes(weekday);
  }

  if (routine.type === 'days_of_month') {
    const monthDay = date.getDate();
    return (routine.daysOfMonth || []).includes(monthDay);
  }

  if (routine.type === 'daily') {
    return true;
  }

  return cycleDay !== undefined ? (med.days || []).includes(cycleDay) : false;
}

/**
 * Helper to convert integer to ordinal string: 1 -> "1st", 2 -> "2nd", 3 -> "3rd", etc.
 */
function getOrdinalNumber(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Formats a medication's routine into a patient-friendly readable string
 */
export function formatMedicationRoutine(med: Medication, cycleDurationDays?: number): string {
  const routine = med.routine;

  if (!routine || routine.type === 'cycle_days') {
    const days = routine?.cycleDays && routine.cycleDays.length > 0 ? routine.cycleDays : med.days || [];
    if (days.length === 0) return 'No cycle days scheduled';
    if (cycleDurationDays) {
      return `Days ${days.join(', ')} (of ${cycleDurationDays} days)`;
    }
    return `Days ${days.join(', ')}`;
  }

  if (routine.type === 'days_of_week') {
    const daysOfWeek = (routine.daysOfWeek || []).slice().sort((a, b) => a - b);
    if (daysOfWeek.length === 0) return 'No weekdays scheduled';
    if (daysOfWeek.length === 7) return 'Every day (Mon–Sun)';
    if (
      daysOfWeek.length === 5 &&
      daysOfWeek.includes(1) &&
      daysOfWeek.includes(2) &&
      daysOfWeek.includes(3) &&
      daysOfWeek.includes(4) &&
      daysOfWeek.includes(5)
    ) {
      return 'Every weekday (Mon–Fri)';
    }
    const names = daysOfWeek.map((d) => WEEKDAY_FULL_NAMES[d]);
    if (names.length === 1) return `Every ${names[0]}`;
    if (names.length === 2) return `Every ${names[0]} and ${names[1]}`;
    return `Every ${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
  }

  if (routine.type === 'days_of_month') {
    const daysOfMonth = (routine.daysOfMonth || []).slice().sort((a, b) => a - b);
    if (daysOfMonth.length === 0) return 'No month dates scheduled';
    const ordinals = daysOfMonth.map(getOrdinalNumber);
    if (ordinals.length === 1) return `Monthly on the ${ordinals[0]}`;
    if (ordinals.length === 2) return `Monthly on the ${ordinals[0]} and ${ordinals[1]}`;
    return `Monthly on the ${ordinals.slice(0, -1).join(', ')}, and ${ordinals[ordinals.length - 1]}`;
  }

  if (routine.type === 'daily') {
    return 'Every day';
  }

  return `Days ${(med.days || []).join(', ')}`;
}

/**
 * Returns complete calendar day info items for a full month (with leading/trailing padding to fill the Sun..Sat grid)
 */
export function getCalendarDaysForMonth(
  year: number,
  month: number, // 0-indexed: 0=Jan, 11=Dec
  regimen: RegimenConfig
): CalendarDayInfo[] {
  const days: CalendarDayInfo[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDateOfMonth = new Date(year, month, 1, 0, 0, 0, 0);
  const firstDayOfWeek = firstDateOfMonth.getDay(); // 0=Sun, 6=Sat
  const daysInMonth = new Date(year, month + 1, 0, 0, 0, 0, 0).getDate();
  const prevMonthDays = new Date(year, month, 0, 0, 0, 0, 0).getDate();

  const createDayInfo = (date: Date, isCurrentMonth: boolean): CalendarDayInfo => {
    const dateStr = formatISODate(date);
    const { cycle, day, isWithinRegimen } = getCycleAndDayFromDate(
      regimen.cycleStartDate,
      regimen.cycleDurationDays,
      regimen.totalCycles,
      date
    );

    const activeMeds = regimen.medications.filter((m) =>
      isMedicationScheduled(m, {
        date,
        cycleDay: isWithinRegimen ? day : undefined,
        cycleNumber: isWithinRegimen ? cycle : undefined
      })
    );

    const hasClinicVisit = activeMeds.some(
      (m) =>
        (typeof m.isClinicOnly === 'boolean' ? m.isClinicOnly : false) ||
        m.id.toLowerCase().includes('bortezomib') ||
        m.route.toLowerCase().includes('clinic') ||
        m.route.toLowerCase().includes('shot') ||
        m.route.toLowerCase().includes('injection')
    );

    const requiresHydrationAlert = activeMeds.some(
      (m) =>
        m.id.toLowerCase().includes('cyclo') ||
        m.instructions.toLowerCase().includes('water') ||
        m.instructions.toLowerCase().includes('hydrat')
    );

    const dateWithoutTime = new Date(date);
    dateWithoutTime.setHours(0, 0, 0, 0);

    const isToday = dateStr === getTodayISODate();
    const isPast = dateWithoutTime.getTime() < today.getTime();
    const isFuture = dateWithoutTime.getTime() > today.getTime();

    return {
      cycleNumber: isWithinRegimen ? cycle : 1,
      cycleDay: isWithinRegimen ? day : 0,
      date,
      dateStr,
      isToday,
      isPast,
      isFuture,
      medications: activeMeds,
      isRestDay: isWithinRegimen && activeMeds.length === 0,
      hasClinicVisit,
      requiresHydrationAlert,
      isCurrentMonth,
      isWithinRegimen
    };
  };

  // 1. Leading days from previous month to align with Sunday start
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(year, month - 1, prevMonthDays - i, 0, 0, 0, 0);
    days.push(createDayInfo(prevDate, false));
  }

  // 2. Days of current month
  for (let day = 1; day <= daysInMonth; day++) {
    const currDate = new Date(year, month, day, 0, 0, 0, 0);
    days.push(createDayInfo(currDate, true));
  }

  // 3. Trailing days from next month to complete the 7-column grid
  const remainder = days.length % 7;
  if (remainder !== 0) {
    const trailingCount = 7 - remainder;
    for (let day = 1; day <= trailingCount; day++) {
      const nextDate = new Date(year, month + 1, day, 0, 0, 0, 0);
      days.push(createDayInfo(nextDate, false));
    }
  }

  return days;
}

export interface RegimenMonthInfo {
  year: number;
  month: number; // 0-indexed (0..11)
  label: string; // "August 2026"
  shortLabel: string; // "Aug 2026"
  monthName: string; // "August"
  shortMonthName: string; // "Aug"
  monthKey: string; // "YYYY-MM" (e.g. "2026-08")
  cycleRangeLabel: string; // "Cycle 1" or "Cycles 1–2"
  primaryCycle: number; // Primary/starting cycle in this month
  activeCycles: number[]; // Array of unique cycle numbers active in this month
}

/**
 * Returns complete info for all calendar months spanned by the active regimen,
 * including computed cycleRangeLabel for month selector navigation.
 */
export function getRegimenMonths(
  startIsoStr: string,
  cycleDurationDays: number,
  totalCycles: number
): RegimenMonthInfo[] {
  const startDate = parseISODate(startIsoStr);
  const totalDays = cycleDurationDays * totalCycles;
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + totalDays - 1);

  const months: RegimenMonthInfo[] = [];
  const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1, 0, 0, 0, 0);
  const endMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1, 0, 0, 0, 0);

  while (current <= endMonth) {
    const year = current.getFullYear();
    const month = current.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Determine active cycles in this calendar month
    const cyclesInMonthSet = new Set<number>();
    for (let d = 1; d <= daysInMonth; d++) {
      const checkDate = new Date(year, month, d, 0, 0, 0, 0);
      if (checkDate >= startDate && checkDate <= endDate) {
        const cycleInfo = getCycleAndDayFromDate(startIsoStr, cycleDurationDays, totalCycles, checkDate);
        if (cycleInfo.isWithinRegimen) {
          cyclesInMonthSet.add(cycleInfo.cycle);
        }
      }
    }

    const activeCycles = Array.from(cyclesInMonthSet).sort((a, b) => a - b);
    let cycleRangeLabel = '';
    if (activeCycles.length === 1) {
      cycleRangeLabel = `Cycle ${activeCycles[0]}`;
    } else if (activeCycles.length > 1) {
      cycleRangeLabel = `Cycles ${activeCycles[0]}–${activeCycles[activeCycles.length - 1]}`;
    }

    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    const label = current.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const shortLabel = current.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const monthName = current.toLocaleDateString('en-US', { month: 'long' });
    const shortMonthName = current.toLocaleDateString('en-US', { month: 'short' });
    const primaryCycle = activeCycles.length > 0 ? activeCycles[0] : 1;

    months.push({
      year,
      month,
      label,
      shortLabel,
      monthName,
      shortMonthName,
      monthKey,
      cycleRangeLabel,
      primaryCycle,
      activeCycles
    });

    current.setMonth(current.getMonth() + 1);
  }

  return months;
}
