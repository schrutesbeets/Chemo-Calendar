export interface Medication {
  id: string;
  clinicalName: string;
  patientFriendlyName: string;
  route: string;
  days: number[];
  instructions: string;
  badgeColor: 'primary' | 'secondary' | 'tertiary' | string;
  sideEffects?: string[];
}

export interface RegimenConfig {
  cycleDurationDays: number;
  cycleStartDate: string; // YYYY-MM-DD
  totalCycles: number;
  regimenName: string;
  specialInstructions: string[];
  medications: Medication[];
}

export interface DoseRecord {
  taken: boolean;
  timestamp?: string; // ISO string
  notes?: string;
}

export type DoseLogs = Record<string, Record<string, DoseRecord>>; // dateKey (YYYY-MM-DD) -> medId -> DoseRecord

export type HydrationLogs = Record<string, number>; // dateKey (YYYY-MM-DD) -> cups count

export type FontSize = 'normal' | 'large' | 'jumbo';
