import React, { useEffect } from 'react';
import { RegimenProvider, useRegimen } from './context/RegimenContext';
import { Header } from './components/Header';
import { TodayDashboard } from './components/TodayDashboard';
import { RegimenTable } from './components/RegimenTable';

import { MonthlyCalendar } from './components/MonthlyCalendar';
import { MedicationGuide } from './components/MedicationGuide';
import { PrintableSchedule } from './components/PrintableSchedule';
import { AdminModal } from './components/AdminModal';
import { generateMaterialPalette, applyMaterialThemeToCSS } from './utils/materialTheme';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, setIsAdminOpen, highContrast } = useRegimen();

  useEffect(() => {
    // Generate and apply theme based on high contrast mode
    const tokens = generateMaterialPalette('#0284c7', highContrast);
    applyMaterialThemeToCSS(tokens);
  }, [highContrast]);

  return (
    <div className="flex-col h-full" style={{ minHeight: '100vh', backgroundColor: 'var(--md-sys-color-surface)' }}>
      
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingBottom: '64px' }}>
        {activeTab === 'today' && <TodayDashboard />}
        {activeTab === 'table' && <RegimenTable />}

        {activeTab === 'monthly' && <MonthlyCalendar />}
        {activeTab === 'medications' && <MedicationGuide />}
        {activeTab === 'print' && <PrintableSchedule />}
      </main>

      {/* Admin Caregiver Overlay Modal */}
      <AdminModal />

      {/* Footer */}
      <footer className="no-print" style={{ 
        backgroundColor: 'var(--md-sys-color-surface-container)', 
        color: 'var(--md-sys-color-on-surface-variant)', 
        borderTop: '1px solid var(--md-sys-color-outline)', 
        padding: '32px 0' 
      }}>
        <div className="layout-container flex-col items-center gap-6 text-center">
          <div>
            <div className="flex-row items-center justify-center gap-2 text-title-large font-black">
              <span>Chemo Calendar Assistant</span>
              <span style={{ 
                backgroundColor: 'var(--md-sys-color-primary-container)', 
                color: 'var(--md-sys-color-on-primary-container)', 
                padding: '2px 10px', 
                borderRadius: '16px', 
                fontSize: '12px', 
                fontWeight: 'bold' 
              }}>
                NCCN MUM46
              </span>
            </div>
            <p className="text-body-small mt-2" style={{ maxWidth: '600px', margin: '8px auto' }}>
              Designed with high accessibility standards for chemotherapy patients and technical caregivers. Always consult your oncology team for medical guidance.
            </p>
          </div>

          <div className="flex-row items-center justify-center gap-4 text-label-large">
            <md-text-button onClick={() => setActiveTab('print')}>
              <md-icon slot="icon">print</md-icon>
              Print Wall Chart
            </md-text-button>
            <span style={{ color: 'var(--md-sys-color-outline)' }}>&bull;</span>
            <md-text-button onClick={() => setIsAdminOpen(true)}>
              <md-icon slot="icon">admin_panel_settings</md-icon>
              Caregiver Portal (#admin)
            </md-text-button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <RegimenProvider>
      <AppContent />
    </RegimenProvider>
  );
}

export default App;
