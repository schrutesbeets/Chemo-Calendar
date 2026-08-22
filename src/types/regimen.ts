export interface MedicationGuide {
  purpose: string;
  howToTake: string;
  keyPrecautions: string;
}

export type BadgeColor = 'primary' | 'secondary' | 'tertiary' | 'warning' | 'error' | 'success';

export type TimeOfDay = 'morning' | 'evening' | 'split' | 'anytime';

export type RoutineType = 'cycle_days' | 'days_of_week' | 'days_of_month' | 'daily';

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sun, 1 = Mon, ..., 6 = Sat

export interface MedicationRoutine {
  type: RoutineType;
  cycleDays?: number[]; // [1, 4, 8, 11]
  daysOfWeek?: DayOfWeek[]; // [0..6]
  daysOfMonth?: number[]; // [1..31]
}

export interface Medication {
  id: string;
  patientFriendlyName: string;
  name?: string;
  route: string;
  days: number[];
  routine?: MedicationRoutine;
  instructions: string;
  dose?: string;
  badgeColor: BadgeColor;
  timeOfDay?: TimeOfDay;
  guide: MedicationGuide;
  isClinicOnly?: boolean;
}

export interface ClinicContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  hours: string;
  category: 'urgent' | 'clinic' | 'pharmacy' | 'support';
  description?: string;
  badgeColor?: BadgeColor;
}

export interface RegimenConfig {
  cycleDurationDays: number;
  cycleStartDate: string; // ISO "YYYY-MM-DD" e.g. "2026-08-16"
  totalCycles: number;
  regimenName: string;
  specialInstructions: string[];
  medications: Medication[];
  contacts?: ClinicContact[];
  patientName?: string;
  physicianName?: string;
  clinicPhone?: string;
  emergencyPhone?: string;
}

export interface AdherenceDayRecord {
  completedMedIds: string[];
  hydrationCups: number;
  notes?: string;
  lastUpdated?: string;
}

export type AdherenceStore = Record<string, AdherenceDayRecord>; // Key: "YYYY-MM-DD"

export interface CalendarDayInfo {
  cycleNumber: number; // 1-indexed (e.g. 1..4)
  cycleDay: number; // 1-indexed (e.g. 1..28)
  date: Date;
  dateStr: string; // "YYYY-MM-DD"
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  medications: Medication[];
  isRestDay: boolean;
  hasClinicVisit: boolean;
  requiresHydrationAlert: boolean;
  isCurrentMonth?: boolean;
  isWithinRegimen?: boolean;
}
