/**
 * Date calculation and formatting helpers for Chemo Calendar
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
 * Formats a Date for senior-friendly display: "Monday, August 17, 2026"
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
 * Formats a Date for compact day badge: "Aug 17"
 */
export function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Formats a Date as "Mon, Aug 17" for table rows and day headers
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
