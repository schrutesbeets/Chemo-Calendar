import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { RegimenConfig, DoseLogs, HydrationLogs, FontSize } from '../types/regimen';
import { DEFAULT_REGIMEN } from '../data/defaultRegimen';
import confetti from 'canvas-confetti';

const STORAGE_KEYS = {
  REGIMEN: 'chemo_calendar_regimen_v1',
  DOSE_LOGS: 'chemo_calendar_dose_logs_v1',
  HYDRATION_LOGS: 'chemo_calendar_hydration_logs_v1',
  FONT_SIZE: 'chemo_calendar_font_size',
  HIGH_CONTRAST: 'chemo_calendar_high_contrast'
};

interface RegimenContextType {
  regimenConfig: RegimenConfig;
  doseLogs: DoseLogs;
  hydrationLogs: HydrationLogs;
  fontSize: FontSize;
  highContrast: boolean;
  isAdminOpen: boolean;
  activeTab: 'today' | 'cycle' | 'monthly' | 'medications' | 'print';
  currentSelectedCycle: number;
  selectedDayModal: number | null;
  
  // Actions
  updateRegimenConfig: (newConfig: RegimenConfig) => boolean;
  toggleDose: (dateKey: string, medId: string, notes?: string) => void;
  setHydrationCount: (dateKey: string, count: number) => void;
  incrementHydration: (dateKey: string) => void;
  resetToDefaultRegimen: () => void;
  setFontSize: (size: FontSize) => void;
  setHighContrast: (enabled: boolean) => void;
  setIsAdminOpen: (open: boolean) => void;
  setActiveTab: (tab: 'today' | 'cycle' | 'monthly' | 'medications' | 'print') => void;
  setCurrentSelectedCycle: (cycle: number) => void;
  setSelectedDayModal: (day: number | null) => void;
  exportRegimenJSON: () => void;
  importRegimenJSON: (jsonString: string) => { success: boolean; message: string };
  speakText: (text: string) => void;
}

const RegimenContext = createContext<RegimenContextType | undefined>(undefined);

export const RegimenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load Regimen Configuration
  const [regimenConfig, setRegimenConfigState] = useState<RegimenConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REGIMEN);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.medications && Array.isArray(parsed.medications)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse saved regimen config from localStorage', e);
    }
    return DEFAULT_REGIMEN;
  });

  // Load Dose Logs
  const [doseLogs, setDoseLogs] = useState<DoseLogs>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DOSE_LOGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved dose logs', e);
    }
    return {};
  });

  // Load Hydration Logs
  const [hydrationLogs, setHydrationLogs] = useState<HydrationLogs>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HYDRATION_LOGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved hydration logs', e);
    }
    return {};
  });

  // Accessibility State
  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    return (localStorage.getItem(STORAGE_KEYS.FONT_SIZE) as FontSize) || 'normal';
  });

  const [highContrast, setHighContrastState] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.HIGH_CONTRAST) === 'true';
  });

  // UI Navigation State
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'today' | 'cycle' | 'monthly' | 'medications' | 'print'>('today');
  const [currentSelectedCycle, setCurrentSelectedCycle] = useState<number>(1);
  const [selectedDayModal, setSelectedDayModal] = useState<number | null>(null);

  // Sync Regimen to LocalStorage
  const updateRegimenConfig = (newConfig: RegimenConfig): boolean => {
    try {
      localStorage.setItem(STORAGE_KEYS.REGIMEN, JSON.stringify(newConfig));
      setRegimenConfigState(newConfig);
      return true;
    } catch (e) {
      console.error('Error saving regimen config', e);
      return false;
    }
  };

  // Sync Dose Logs to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOSE_LOGS, JSON.stringify(doseLogs));
  }, [doseLogs]);

  // Sync Hydration Logs to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HYDRATION_LOGS, JSON.stringify(hydrationLogs));
  }, [hydrationLogs]);

  // Apply Font Size CSS scale
  useEffect(() => {
    const root = document.documentElement;
    let scale = '1';
    if (fontSize === 'large') scale = '1.2';
    if (fontSize === 'jumbo') scale = '1.45';
    root.style.setProperty('--font-scale', scale);
    localStorage.setItem(STORAGE_KEYS.FONT_SIZE, fontSize);
  }, [fontSize]);

  // Apply High Contrast Body class
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    localStorage.setItem(STORAGE_KEYS.HIGH_CONTRAST, String(highContrast));
  }, [highContrast]);

  // Check URL Hash for #admin on mount or hashchange
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const setFontSize = (size: FontSize) => setFontSizeState(size);
  const setHighContrast = (enabled: boolean) => setHighContrastState(enabled);

  // Dose Logging Action
  const toggleDose = (dateKey: string, medId: string, notes?: string) => {
    setDoseLogs(prev => {
      const currentDayLogs = prev[dateKey] || {};
      const isCurrentlyTaken = currentDayLogs[medId]?.taken || false;
      const nextTaken = !isCurrentlyTaken;

      if (nextTaken) {
        // Trigger celebratory confetti effect for elderly positive feedback!
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 }
          });
        } catch (e) {
          // fallback if confetti fails
        }
      }

      return {
        ...prev,
        [dateKey]: {
          ...currentDayLogs,
          [medId]: {
            taken: nextTaken,
            timestamp: nextTaken ? new Date().toISOString() : undefined,
            notes: notes !== undefined ? notes : currentDayLogs[medId]?.notes
          }
        }
      };
    });
  };

  // Hydration Actions
  const setHydrationCount = (dateKey: string, count: number) => {
    setHydrationLogs(prev => ({
      ...prev,
      [dateKey]: Math.max(0, Math.min(16, count))
    }));
  };

  const incrementHydration = (dateKey: string) => {
    setHydrationLogs(prev => ({
      ...prev,
      [dateKey]: Math.min(16, (prev[dateKey] || 0) + 1)
    }));
  };

  // Reset to Default
  const resetToDefaultRegimen = () => {
    localStorage.removeItem(STORAGE_KEYS.REGIMEN);
    setRegimenConfigState(DEFAULT_REGIMEN);
  };

  // Export JSON
  const exportRegimenJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(regimenConfig, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `chemo-regimen-${regimenConfig.regimenName.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON with Schema Validation
  const importRegimenJSON = (jsonString: string): { success: boolean; message: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, message: 'Invalid JSON format.' };
      }
      if (!parsed.cycleDurationDays || typeof parsed.cycleDurationDays !== 'number') {
        return { success: false, message: 'Missing or invalid "cycleDurationDays" (number).' };
      }
      if (!parsed.cycleStartDate || typeof parsed.cycleStartDate !== 'string') {
        return { success: false, message: 'Missing or invalid "cycleStartDate" (YYYY-MM-DD).' };
      }
      if (!parsed.medications || !Array.isArray(parsed.medications)) {
        return { success: false, message: 'Missing or invalid "medications" array.' };
      }

      for (const med of parsed.medications) {
        if (!med.id || !med.clinicalName || !med.patientFriendlyName || !Array.isArray(med.days)) {
          return { success: false, message: `Medication "${med.clinicalName || 'unknown'}" is missing required fields (id, clinicalName, patientFriendlyName, days array).` };
        }
      }

      updateRegimenConfig(parsed as RegimenConfig);
      return { success: true, message: 'Regimen successfully updated!' };
    } catch (e: any) {
      return { success: false, message: `JSON syntax error: ${e.message}` };
    }
  };

  // Speech Synthesis Helper
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any active speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower, clear speech pace for seniors
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <RegimenContext.Provider
      value={{
        regimenConfig,
        doseLogs,
        hydrationLogs,
        fontSize,
        highContrast,
        isAdminOpen,
        activeTab,
        currentSelectedCycle,
        selectedDayModal,
        updateRegimenConfig,
        toggleDose,
        setHydrationCount,
        incrementHydration,
        resetToDefaultRegimen,
        setFontSize,
        setHighContrast,
        setIsAdminOpen,
        setActiveTab,
        setCurrentSelectedCycle,
        setSelectedDayModal,
        exportRegimenJSON,
        importRegimenJSON,
        speakText
      }}
    >
      {children}
    </RegimenContext.Provider>
  );
};

export const useRegimen = () => {
  const context = useContext(RegimenContext);
  if (!context) {
    throw new Error('useRegimen must be used within a RegimenProvider');
  }
  return context;
};
