import React from 'react';
import { RegimenProvider, useRegimen } from './context/RegimenContext';
import { Header } from './components/Header';
import { TodayDashboard } from './components/TodayDashboard';
import { RegimenTable } from './components/RegimenTable';
import { CycleGrid } from './components/CycleGrid';
import { MonthlyCalendar } from './components/MonthlyCalendar';
import { MedicationGuide } from './components/MedicationGuide';
import { PrintableSchedule } from './components/PrintableSchedule';
import { AdminModal } from './components/AdminModal';
import { ShieldAlert, Printer } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, setIsAdminOpen } = useRegimen();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 transition-colors">
      
      {/* Header */}
      <Header />

      {/* Main Content Area based on Active Tab */}
      <main className="flex-1 pb-16">
        {activeTab === 'today' && <TodayDashboard />}
        {activeTab === 'table' && <RegimenTable />}
        {activeTab === 'cycle' && <CycleGrid />}
        {activeTab === 'monthly' && <MonthlyCalendar />}
        {activeTab === 'medications' && <MedicationGuide />}
        {activeTab === 'print' && <PrintableSchedule />}
      </main>

      {/* Admin Caregiver Overlay Modal */}
      <AdminModal />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 border-t-4 border-slate-700 py-8 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-lg font-black text-white">
              <span>Chemo Calendar Assistant</span>
              <span className="text-xs bg-sky-800 text-sky-200 px-2.5 py-0.5 rounded-full font-bold">
                NCCN MUM46
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-400 mt-1 max-w-md">
              Designed with high accessibility standards for chemotherapy patients and technical caregivers. Always consult your oncology team for medical guidance.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold">
            <button
              onClick={() => setActiveTab('print')}
              className="text-emerald-400 hover:underline flex items-center gap-1"
            >
              <Printer className="w-4 h-4" /> Print Wall Chart
            </button>
            <span className="text-slate-600">&bull;</span>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-amber-400 hover:underline flex items-center gap-1"
            >
              <ShieldAlert className="w-4 h-4" /> Caregiver Portal (#admin)
            </button>
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
