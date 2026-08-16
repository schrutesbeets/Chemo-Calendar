import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { AppSettings, PrintLayoutMode, AppTab } from '../types/settings';
import { getTodayISODate } from '../utils/dateUtils';

interface SettingsContextType {
  settings: AppSettings;
  setHighContrast: (enabled: boolean) => void;
  toggleHighContrast: () => void;
  setFontScale: (scale: number) => void;
  setPrintLayout: (layout: PrintLayoutMode) => void;
  setActiveCycle: (cycle: number) => void;
  setSelectedDateStr: (dateStr: string) => void;
  setActiveTab: (tab: AppTab) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isPrintModalOpen: boolean;
  setIsPrintModalOpen: (open: boolean) => void;
  isPinAuthModalOpen: boolean;
  setIsPinAuthModalOpen: (open: boolean) => void;
  isDesignSystemOpen: boolean;
  setIsDesignSystemOpen: (open: boolean) => void;
  verifyAndOpenAdmin: (enteredPin: string) => boolean;
  triggerDirectPrint: () => void;
}

const SETTINGS_STORAGE_KEY = 'chemo_app_settings_v3';

const DEFAULT_SETTINGS: AppSettings = {
  highContrast: false,
  fontScale: 1.0,
  printLayout: 'letter-portrait',
  caregiverPin: '1234',
  pinEnabled: false,
  activeCycle: 1,
  selectedDateStr: getTodayISODate(),
  activeTab: 'matrix'
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const validTabs = ['matrix', 'calendar', 'guide'];
        const activeTab: AppTab = validTabs.includes(parsed.activeTab) ? parsed.activeTab : 'matrix';
        return { ...DEFAULT_SETTINGS, ...parsed, activeTab };
      }
    } catch {
      console.warn('Failed to load settings from localStorage');
    }
    return DEFAULT_SETTINGS;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isPinAuthModalOpen, setIsPinAuthModalOpen] = useState(false);
  const [isDesignSystemOpen, setIsDesignSystemOpen] = useState(false);

  // Apply High Contrast mode to root DOM element
  useEffect(() => {
    if (settings.highContrast) {
      document.documentElement.setAttribute('data-high-contrast', 'true');
    } else {
      document.documentElement.removeAttribute('data-high-contrast');
    }
  }, [settings.highContrast]);

  // Apply font scaling CSS custom property to root
  useEffect(() => {
    document.documentElement.style.setProperty('--app-type-scale', String(settings.fontScale));
  }, [settings.fontScale]);

  // Listen to URL hash changes (e.g. #admin, #design-system)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      } else if (window.location.hash === '#design-system') {
        setIsDesignSystemOpen(true);
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Save settings on update
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings to localStorage', e);
    }
  }, [settings]);

  const setHighContrast = useCallback((enabled: boolean) => {
    setSettings((prev) => ({ ...prev, highContrast: enabled }));
  }, []);

  const toggleHighContrast = useCallback(() => {
    setSettings((prev) => ({ ...prev, highContrast: !prev.highContrast }));
  }, []);

  const setFontScale = useCallback((scale: number) => {
    const clamped = Math.max(1.0, Math.min(1.5, Number(scale.toFixed(2))));
    setSettings((prev) => ({ ...prev, fontScale: clamped }));
  }, []);

  const setPrintLayout = useCallback((layout: PrintLayoutMode) => {
    setSettings((prev) => ({ ...prev, printLayout: layout }));
  }, []);

  const setActiveCycle = useCallback((cycle: number) => {
    setSettings((prev) => ({ ...prev, activeCycle: cycle }));
  }, []);

  const setSelectedDateStr = useCallback((dateStr: string) => {
    setSettings((prev) => ({ ...prev, selectedDateStr: dateStr }));
  }, []);

  const setActiveTab = useCallback((tab: AppTab) => {
    setSettings((prev) => ({ ...prev, activeTab: tab }));
  }, []);

  const verifyAndOpenAdmin = useCallback(
    (enteredPin: string): boolean => {
      if (!settings.pinEnabled || enteredPin === settings.caregiverPin) {
        setIsAdminOpen(true);
        setIsPinAuthModalOpen(false);
        return true;
      }
      return false;
    },
    [settings.pinEnabled, settings.caregiverPin]
  );

  const triggerDirectPrint = useCallback(() => {
    window.print();
  }, []);

  const value = useMemo(
    () => ({
      settings,
      setHighContrast,
      toggleHighContrast,
      setFontScale,
      setPrintLayout,
      setActiveCycle,
      setSelectedDateStr,
      setActiveTab,
      isSettingsOpen,
      setIsSettingsOpen,
      isAdminOpen,
      setIsAdminOpen,
      isPrintModalOpen,
      setIsPrintModalOpen,
      isPinAuthModalOpen,
      setIsPinAuthModalOpen,
      isDesignSystemOpen,
      setIsDesignSystemOpen,
      verifyAndOpenAdmin,
      triggerDirectPrint
    }),
    [
      settings,
      setHighContrast,
      toggleHighContrast,
      setFontScale,
      setPrintLayout,
      setActiveCycle,
      setSelectedDateStr,
      setActiveTab,
      isSettingsOpen,
      isAdminOpen,
      isPrintModalOpen,
      isPinAuthModalOpen,
      isDesignSystemOpen,
      verifyAndOpenAdmin,
      triggerDirectPrint
    ]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
