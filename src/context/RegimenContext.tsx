import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type {
  RegimenConfig,
  AdherenceStore,
  CalendarDayInfo,
  Medication,
  ClinicContact
} from '../types/regimen';
import { DEFAULT_MUM46_REGIMEN } from '../data/defaultRegimen';
import {
  getDateForCycleAndDay,
  formatISODate,
  getTodayISODate,
  parseISODate,
  getCycleAndDayFromDate,
  isMedicationScheduled,
  getCalendarDaysForMonth as getCalendarDaysForMonthUtil
} from '../utils/dateUtils';
import { validateRegimenSchema, type ValidationResult } from '../utils/schemaValidator';

interface RegimenContextType {
  regimen: RegimenConfig;
  adherence: AdherenceStore;
  todayDateStr: string;
  updateRegimen: (newConfig: RegimenConfig) => ValidationResult;
  addMedication: (medication: Medication) => ValidationResult;
  addContact: (contact: ClinicContact) => ValidationResult;
  resetToDefaultRegimen: () => void;
  toggleMedicationCompleted: (dateStr: string, medId: string) => void;
  setHydrationCups: (dateStr: string, cups: number) => void;
  clearAdherenceHistory: () => void;
  getCalendarDaysForCycle: (cycleNumber: number) => CalendarDayInfo[];
  getCalendarDaysForMonth: (year: number, month: number) => CalendarDayInfo[];
  getDayInfoForDateStr: (dateStr: string) => CalendarDayInfo | null;
  exportJSON: () => string;
  importJSON: (rawJson: string) => ValidationResult;
}

const REGIMEN_STORAGE_KEY = 'digital_pillbox_regimen_v1';
const ADHERENCE_STORAGE_KEY = 'digital_pillbox_adherence_v1';

const normalizeRegimenConfig = (config: RegimenConfig): RegimenConfig => {
  const normalizedMeds = config.medications.map((m) => {
    if (m.id.includes('dexa')) {
      return {
        ...m,
        patientFriendlyName: m.patientFriendlyName.replace(/\(Steroid Pill\)/i, '(Pill)').replace(/\(Steroid pill\)/i, '(Pill)'),
        badgeColor: 'warning' as const,
        dose: m.dose || (m.id.includes('am') || m.id.includes('pm') ? '20 mg' : '40 mg'),
        timeOfDay: m.timeOfDay || (m.id.includes('pm') || m.id.includes('night') || m.id.includes('evening') ? 'evening' : 'morning')
      };
    }
    if (m.id.includes('cyclo')) {
      return {
        ...m,
        patientFriendlyName: m.patientFriendlyName.replace(/\(Pill \+ Water\)/i, '(Pill)'),
        badgeColor: 'tertiary' as const,
        dose: m.dose || '300 mg/m²',
        timeOfDay: m.timeOfDay || 'morning'
      };
    }
    if (m.id.includes('bortezomib')) {
      return {
        ...m,
        patientFriendlyName: m.patientFriendlyName.replace(/\(Clinic Injection\)/i, '(Injection)'),
        badgeColor: 'primary' as const,
        dose: m.dose || '1.3 mg/m²',
        timeOfDay: m.timeOfDay || 'morning',
        isClinicOnly: m.isClinicOnly !== undefined ? m.isClinicOnly : true
      };
    }
    return m;
  });
  return {
    ...config,
    cycleStartDate: config.cycleStartDate === '2026-08-17' ? '2026-08-16' : config.cycleStartDate,
    medications: normalizedMeds,
    contacts: config.contacts || []
  };
};

const RegimenContext = createContext<RegimenContextType | null>(null);

export const RegimenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Regimen state
  const [regimen, setRegimen] = useState<RegimenConfig>(() => {
    try {
      const saved = localStorage.getItem(REGIMEN_STORAGE_KEY)
        || localStorage.getItem('chemo_regimen_config_v3')
        || localStorage.getItem('chemo_regimen_config_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        const validation = validateRegimenSchema(parsed);
        if (validation.isValid) {
          return normalizeRegimenConfig(parsed);
        }
      }
    } catch {
      console.warn('Failed to load saved regimen from localStorage, using default MUM46');
    }
    return DEFAULT_MUM46_REGIMEN;
  });

  // 2. Adherence state
  const [adherence, setAdherence] = useState<AdherenceStore>(() => {
    try {
      const saved = localStorage.getItem(ADHERENCE_STORAGE_KEY)
        || localStorage.getItem('chemo_adherence_store_v2');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      console.warn('Failed to load adherence store from localStorage');
    }
    return {};
  });

  // Today's date string (default)
  const todayDateStr = useMemo(() => getTodayISODate(), []);

  // Save to localStorage when regimen changes
  useEffect(() => {
    try {
      localStorage.setItem(REGIMEN_STORAGE_KEY, JSON.stringify(regimen, null, 2));
    } catch (e) {
      console.error('Error saving regimen to localStorage', e);
    }
  }, [regimen]);

  // Save to localStorage when adherence changes
  useEffect(() => {
    try {
      localStorage.setItem(ADHERENCE_STORAGE_KEY, JSON.stringify(adherence));
    } catch (e) {
      console.error('Error saving adherence to localStorage', e);
    }
  }, [adherence]);

  // Toggle med completion for a given date
  const toggleMedicationCompleted = useCallback((dateStr: string, medId: string) => {
    setAdherence((prev) => {
      const currentRecord = prev[dateStr] || { completedMedIds: [], hydrationCups: 0 };
      const alreadyCompleted = currentRecord.completedMedIds.includes(medId);

      const newCompleted = alreadyCompleted
        ? currentRecord.completedMedIds.filter((id) => id !== medId)
        : [...currentRecord.completedMedIds, medId];

      return {
        ...prev,
        [dateStr]: {
          ...currentRecord,
          completedMedIds: newCompleted,
          lastUpdated: new Date().toISOString()
        }
      };
    });
  }, []);

  // Set hydration cups for a given date
  const setHydrationCups = useCallback((dateStr: string, cups: number) => {
    setAdherence((prev) => {
      const currentRecord = prev[dateStr] || { completedMedIds: [], hydrationCups: 0 };
      const safeCups = Math.max(0, Math.min(20, cups));
      return {
        ...prev,
        [dateStr]: {
          ...currentRecord,
          hydrationCups: safeCups,
          lastUpdated: new Date().toISOString()
        }
      };
    });
  }, []);

  // Clear adherence history
  const clearAdherenceHistory = useCallback(() => {
    setAdherence({});
    localStorage.removeItem(ADHERENCE_STORAGE_KEY);
  }, []);

  // Update regimen with validation
  const updateRegimen = useCallback((newConfig: RegimenConfig): ValidationResult => {
    const validation = validateRegimenSchema(newConfig);
    if (validation.isValid) {
      setRegimen(newConfig);
    }
    return validation;
  }, []);

  // Add medication helper
  const addMedication = useCallback((newMed: Medication): ValidationResult => {
    const updated: RegimenConfig = {
      ...regimen,
      medications: [...regimen.medications, newMed]
    };
    return updateRegimen(updated);
  }, [regimen, updateRegimen]);

  // Add care team contact helper
  const addContact = useCallback((newContact: ClinicContact): ValidationResult => {
    const updated: RegimenConfig = {
      ...regimen,
      contacts: [...(regimen.contacts || []), newContact]
    };
    return updateRegimen(updated);
  }, [regimen, updateRegimen]);

  // Reset to default
  const resetToDefaultRegimen = useCallback(() => {
    setRegimen(DEFAULT_MUM46_REGIMEN);
  }, []);

  // Export JSON
  const exportJSON = useCallback(() => {
    return JSON.stringify(regimen, null, 2);
  }, [regimen]);

  // Import JSON with validation
  const importJSON = useCallback((rawJson: string): ValidationResult => {
    try {
      const parsed = JSON.parse(rawJson);
      const validation = validateRegimenSchema(parsed);
      if (validation.isValid) {
        setRegimen(parsed);
      }
      return validation;
    } catch {
      return {
        isValid: false,
        errors: ['Invalid JSON syntax. Please check for formatting errors.']
      };
    }
  }, []);

  // Get Calendar days for a cycle
  const getCalendarDaysForCycle = useCallback(
    (cycleNumber: number): CalendarDayInfo[] => {
      const days: CalendarDayInfo[] = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let day = 1; day <= regimen.cycleDurationDays; day++) {
        const date = getDateForCycleAndDay(
          regimen.cycleStartDate,
          regimen.cycleDurationDays,
          cycleNumber,
          day
        );
        const dateStr = formatISODate(date);

        // Find active medications for this cycle day
        const activeMeds: Medication[] = regimen.medications.filter((m) =>
          isMedicationScheduled(m, { date, cycleDay: day, cycleNumber })
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

        days.push({
          cycleNumber,
          cycleDay: day,
          date,
          dateStr,
          isToday,
          isPast,
          isFuture,
          medications: activeMeds,
          isRestDay: activeMeds.length === 0,
          hasClinicVisit,
          requiresHydrationAlert
        });
      }

      return days;
    },
    [regimen]
  );

  // Get single day info from dateStr
  const getDayInfoForDateStr = useCallback(
    (dateStr: string): CalendarDayInfo | null => {
      const targetDate = parseISODate(dateStr);
      const { cycle, day, isWithinRegimen } = getCycleAndDayFromDate(
        regimen.cycleStartDate,
        regimen.cycleDurationDays,
        regimen.totalCycles,
        targetDate
      );

      if (!isWithinRegimen && (cycle < 1 || cycle > regimen.totalCycles)) {
        return null;
      }

      const activeMeds = regimen.medications.filter((m) =>
        isMedicationScheduled(m, { date: targetDate, cycleDay: day, cycleNumber: cycle })
      );
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const isToday = dateStr === getTodayISODate();
      const isPast = targetDate.getTime() < today.getTime();
      const isFuture = targetDate.getTime() > today.getTime();

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

      return {
        cycleNumber: cycle,
        cycleDay: day,
        date: targetDate,
        dateStr,
        isToday,
        isPast,
        isFuture,
        medications: activeMeds,
        isRestDay: activeMeds.length === 0,
        hasClinicVisit,
        requiresHydrationAlert
      };
    },
    [regimen]
  );

  // Get Calendar days for a full month
  const getCalendarDaysForMonth = useCallback(
    (year: number, month: number): CalendarDayInfo[] => {
      return getCalendarDaysForMonthUtil(year, month, regimen);
    },
    [regimen]
  );

  const value = useMemo(
    () => ({
      regimen,
      adherence,
      todayDateStr,
      updateRegimen,
      addMedication,
      addContact,
      resetToDefaultRegimen,
      toggleMedicationCompleted,
      setHydrationCups,
      clearAdherenceHistory,
      getCalendarDaysForCycle,
      getCalendarDaysForMonth,
      getDayInfoForDateStr,
      exportJSON,
      importJSON
    }),
    [
      regimen,
      adherence,
      todayDateStr,
      updateRegimen,
      addMedication,
      addContact,
      resetToDefaultRegimen,
      toggleMedicationCompleted,
      setHydrationCups,
      clearAdherenceHistory,
      getCalendarDaysForCycle,
      getCalendarDaysForMonth,
      getDayInfoForDateStr,
      exportJSON,
      importJSON
    ]
  );

  return <RegimenContext.Provider value={value}>{children}</RegimenContext.Provider>;
};

export const useRegimen = (): RegimenContextType => {
  const context = useContext(RegimenContext);
  if (!context) {
    throw new Error('useRegimen must be used within a RegimenProvider');
  }
  return context;
};
