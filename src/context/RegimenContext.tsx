/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { RegimenConfig, DoseLogs, HydrationLogs, FontSize } from '../types/regimen';
import { DEFAULT_REGIMEN } from '../data/defaultRegimen';
import { generateMaterialPalette, applyMaterialThemeToCSS } from '../utils/materialTheme';
import confetti from 'canvas-confetti';

const STORAGE_KEYS = {
  REGIMEN: 'chemo_calendar_regimen_v1',
  DOSE_LOGS: 'chemo_calendar_dose_logs_v1',
  HYDRATION_LOGS: 'chemo_calendar_hydration_logs_v1',
  FONT_SIZE: 'chemo_calendar_font_size',
  HIGH_CONTRAST: 'chemo_calendar_high_contrast'
};

export type ActiveTabType = 'today' | 'cycle' | 'table' | 'monthly' | 'medications' | 'print';

interface RegimenContextType {
  regimenConfig: RegimenConfig;
  doseLogs: DoseLogs;
  hydrationLogs: HydrationLogs;
  fontSize: FontSize;
  highContrast: boolean;
  isAdminOpen: boolean;
  activeTab: ActiveTabType;
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
  setActiveTab: (tab: ActiveTabType) => void;
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
      return saved ? JSON.parse(saved) : DEFAULT_REGIMEN;
    } catch {
      return DEFAULT_REGIMEN;
    }
  });

  // Load Dose Logs
  const [doseLogs, setDoseLogs] = useState<DoseLogs>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DOSE_LOGS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Load Hydration Logs
  const [hydrationLogs, setHydrationLogs] = useState<HydrationLogs>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HYDRATION_LOGS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Accessibility Settings
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FONT_SIZE);
    return (saved as FontSize) || 'normal';
  });

  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.HIGH_CONTRAST) === 'true';
  });

  // UI Navigation State
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTabType>('today');
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

  // Apply High Contrast Body class & Google Material 3 HCT Theme Tokens
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    const materialTokens = generateMaterialPalette('#0284c7', highContrast);
    applyMaterialThemeToCSS(materialTokens);
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

  // Dose Logging Handler
  const toggleDose = (dateKey: string, medId: string, notes?: string) => {
    setDoseLogs(prev => {
      const dayLogs = prev[dateKey] || {};
      const currentMedLog = dayLogs[medId] || { taken: false };
      const willBeTaken = !currentMedLog.taken;

      const updated = {
        ...prev,
        [dateKey]: {
          ...dayLogs,
          [medId]: {
            taken: willBeTaken,
            timestamp: willBeTaken ? new Date().toISOString() : undefined,
            notes: notes || currentMedLog.notes
          }
        }
      };

      // Trigger celebrate animation on dose check
      if (willBeTaken) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      }

      return updated;
    });
  };

  // Hydration Handlers
  const setHydrationCount = (dateKey: string, count: number) => {
    setHydrationLogs(prev => ({
      ...prev,
      [dateKey]: Math.max(0, Math.min(12, count))
    }));
  };

  const incrementHydration = (dateKey: string) => {
    setHydrationLogs(prev => {
      const current = prev[dateKey] || 0;
      return {
        ...prev,
        [dateKey]: Math.min(12, current + 1)
      };
    });
  };

  // Reset to Default Seed Regimen
  const resetToDefaultRegimen = () => {
    setRegimenConfigState(DEFAULT_REGIMEN);
    setDoseLogs({});
    setHydrationLogs({});
    localStorage.removeItem(STORAGE_KEYS.REGIMEN);
    localStorage.removeItem(STORAGE_KEYS.DOSE_LOGS);
    localStorage.removeItem(STORAGE_KEYS.HYDRATION_LOGS);
  };

  // Export JSON File
  const exportRegimenJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(regimenConfig, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `chemo_regimen_${regimenConfig.regimenName.toLowerCase().replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON File with Validation
  const importRegimenJSON = (jsonString: string): { success: boolean; message: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.regimenName || !Array.isArray(parsed.medications)) {
        return { success: false, message: 'Invalid schema: Missing required regimen fields.' };
      }
      const ok = updateRegimenConfig(parsed);
      return ok 
        ? { success: true, message: 'Regimen configuration imported successfully!' }
        : { success: false, message: 'Failed to save imported regimen.' };
    } catch (err: any) {
      return { success: false, message: `JSON Syntax Error: ${err.message}` };
    }
  };

  // Web Speech Synthesis (SpeechReadout helper)
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for elderly patients
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
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
