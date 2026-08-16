export type PrintLayoutMode = 'letter-portrait' | 'letter-landscape' | 'tabloid-landscape';

export type AppTab = 'matrix' | 'calendar' | 'guide' | 'contacts';

export interface AppSettings {
  highContrast: boolean; // default false
  fontScale: number; // default 1.0 (range 1.0 to 1.5)
  printLayout: PrintLayoutMode;
  caregiverPin: string; // default "1234"
  pinEnabled: boolean; // default false for easy demo, can be enabled
  activeCycle: number; // 1 to totalCycles
  selectedDateStr: string; // "YYYY-MM-DD"
  activeTab: AppTab;
}
