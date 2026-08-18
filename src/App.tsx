import React from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-aria-components';
import {
  CalendarDays,
  BookOpen,
  TableProperties,
  PhoneCall,
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
import { ClinicContactsView } from './components/PatientViews/ClinicContactsView';
import { DesignSystemModal } from './components/DesignSystem/DesignSystemModal';
import { SettingsDrawer } from './components/Settings/SettingsDrawer';
import { PrintFridgeSchedule } from './components/Print/PrintFridgeSchedule';
import { PrintModal } from './components/Print/PrintModal';
import { CaregiverAdminPortal } from './components/Admin/CaregiverAdminPortal';
import { PinAuthModal } from './components/Admin/PinAuthModal';
import { Button, Stack } from './components/common';
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
      <div className="screen-only app-root-screen">
        <AppHeader />

        <main className="app-container app-main-layout">
          <CycleSelector />

          {/* Accessible Main Tab Navigation */}
          <Tabs
            selectedKey={settings.activeTab}
            onSelectionChange={(key) => setActiveTab(key as AppTab)}
            className="react-aria-Tabs"
          >
            <TabList aria-label="Digital Pillbox Navigation Views" className="react-aria-TabList">
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
              <Tab id="contacts" className="react-aria-Tab">
                <PhoneCall size={20} />
                <span>Clinic & Nurse Contacts</span>
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

            <TabPanel id="contacts" className="react-aria-TabPanel">
              <ClinicContactsView />
            </TabPanel>
          </Tabs>
        </main>

        {/* Footer */}
        <footer className="no-print app-footer">
          <div className="app-footer-content">
            <div>
              <strong>Digital Pillbox</strong> • Built for Patients & Caregivers • WCAG AAA High Contrast Ready
            </div>
            <Stack direction="row" gap="2" align="center" wrap>
              <Button
                variant="text"
                size="sm"
                onPress={() => setIsDesignSystemOpen(true)}
                aria-label="Open Design System Showcase"
                leftIcon={<Palette size={16} />}
              >
                Design System Showcase
              </Button>
              <Button
                variant="text"
                size="sm"
                onPress={handleOpenAdmin}
                aria-label="Open Caregiver Admin Portal"
                leftIcon={<ShieldCheck size={16} />}
              >
                Caregiver Admin Portal
              </Button>
            </Stack>
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
