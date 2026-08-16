import React from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-aria-components';
import {
  CalendarDays,
  BookOpen,
  TableProperties,
  Palette,
  ShieldCheck
} from 'lucide-react';
import { RegimenProvider } from './context/RegimenContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { AppHeader } from './components/Header/AppHeader';
import { CycleSelector } from './components/Header/CycleSelector';
import { DayTableView } from './components/PatientViews/DayTableView';
import { CalendarGridView } from './components/PatientViews/CalendarGridView';
import { MedicationGuideView } from './components/PatientViews/MedicationGuideView';
import { DesignSystemModal } from './components/DesignSystem/DesignSystemModal';
import { SettingsDrawer } from './components/Settings/SettingsDrawer';
import { PrintFridgeSchedule } from './components/Print/PrintFridgeSchedule';
import { PrintModal } from './components/Print/PrintModal';
import { CaregiverAdminPortal } from './components/Admin/CaregiverAdminPortal';
import { PinAuthModal } from './components/Admin/PinAuthModal';
import type { AppTab } from './types/settings';

const MainAppContent: React.FC = () => {
  const {
    settings,
    setActiveTab,
    setIsAdminOpen,
    setIsPinAuthModalOpen,
    setIsDesignSystemOpen
  } = useSettings();

  const handleOpenAdmin = () => {
    if (settings.pinEnabled) {
      setIsPinAuthModalOpen(true);
    } else {
      setIsAdminOpen(true);
    }
  };

  return (
    <>
      {/* Screen Only Container */}
      <div className="screen-only" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppHeader />

        <main className="app-container" style={{ flex: 1 }}>
          <CycleSelector />

          {/* Accessible Main Tab Navigation */}
          <Tabs
            selectedKey={settings.activeTab}
            onSelectionChange={(key) => setActiveTab(key as AppTab)}
            className="react-aria-Tabs"
          >
            <TabList aria-label="Chemo Calendar Navigation Views" className="react-aria-TabList">
              <Tab id="matrix" className="react-aria-Tab">
                <TableProperties size={20} />
                <span>Day Table</span>
              </Tab>
              <Tab id="calendar" className="react-aria-Tab">
                <CalendarDays size={20} />
                <span>28 Day Cycle</span>
              </Tab>
              <Tab id="guide" className="react-aria-Tab">
                <BookOpen size={20} />
                <span>Medication Guide</span>
              </Tab>
            </TabList>

            <TabPanel id="matrix" className="react-aria-TabPanel">
              <DayTableView />
            </TabPanel>

            <TabPanel id="calendar" className="react-aria-TabPanel">
              <CalendarGridView />
            </TabPanel>

            <TabPanel id="guide" className="react-aria-TabPanel">
              <MedicationGuideView />
            </TabPanel>
          </Tabs>
        </main>

        {/* Footer */}
        <footer
          className="no-print"
          style={{
            backgroundColor: 'var(--md-sys-color-surface-container)',
            borderTop: 'var(--app-border-width) solid var(--md-sys-color-outline-variant)',
            padding: '20px',
            textAlign: 'center',
            fontSize: '0.9rem',
            color: 'var(--md-sys-color-on-surface-variant)',
            marginTop: 'auto'
          }}
        >
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <strong>Chemo Calendar</strong> • Built for Patients & Caregivers • WCAG AAA High Contrast Ready
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setIsDesignSystemOpen(true)}
                className="footer-link-btn"
                aria-label="Open Design System Showcase"
              >
                <Palette size={16} />
                <span>Design System Showcase</span>
              </button>
              <button
                type="button"
                onClick={handleOpenAdmin}
                className="footer-link-btn"
                aria-label="Open Caregiver Admin Portal"
              >
                <ShieldCheck size={16} />
                <span>Caregiver Admin Portal</span>
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Dedicated Print Sheet Component (active during window.print()) */}
      <PrintFridgeSchedule />

      {/* Dialog Modals */}
      <SettingsDrawer />
      <PrintModal />
      <CaregiverAdminPortal />
      <PinAuthModal />
      <DesignSystemModal />
    </>
  );
};

export function App() {
  return (
    <RegimenProvider>
      <SettingsProvider>
        <MainAppContent />
      </SettingsProvider>
    </RegimenProvider>
  );
}

export default App;
