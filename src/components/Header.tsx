import React from 'react';
import { useRegimen } from '../context/RegimenContext';
import { 
  Calendar, 
  CalendarDays, 
  Pill, 
  Printer, 
  ShieldAlert, 
  Volume2, 
  Sun, 
  Moon, 
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import type { FontSize } from '../types/regimen';

export const Header: React.FC = () => {
  const { 
    regimenConfig, 
    fontSize, 
    setFontSize, 
    highContrast, 
    setHighContrast, 
    setIsAdminOpen,
    activeTab,
    setActiveTab,
    speakText
  } = useRegimen();

  const handleReadHeaderAloud = () => {
    speakText(`Chemo Calendar. Active regimen: ${regimenConfig.regimenName}. You have 4 total cycles of 28 days.`);
  };

  return (
    <header className="bg-white border-b-4 border-slate-300 shadow-sm no-print sticky top-0 z-30 transition-colors">
      {/* Top Accessibility & Caregiver Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-slate-50">
        
        {/* Patient Accessibility Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">
            Patient Controls:
          </span>

          {/* Font Size Selector */}
          <div className="inline-flex rounded-lg border-2 border-slate-400 p-0.5 bg-white" role="group" aria-label="Text Size Controls">
            {(['normal', 'large', 'jumbo'] as FontSize[]).map(size => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`px-3 py-1 text-sm font-bold rounded-md transition-all senior-touch-target ${
                  fontSize === size 
                    ? 'bg-sky-700 text-white shadow-sm' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
                aria-label={`Set text size to ${size}`}
              >
                {size === 'normal' && 'A (Normal)'}
                {size === 'large' && 'A+ (Large)'}
                {size === 'jumbo' && 'A++ (Jumbo)'}
              </button>
            ))}
          </div>

          {/* High Contrast Toggle */}
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`px-3 py-2 text-sm font-bold rounded-lg border-2 flex items-center gap-2 transition-all senior-touch-target ${
              highContrast
                ? 'bg-yellow-400 text-black border-black'
                : 'bg-slate-800 text-white border-slate-900 hover:bg-slate-700'
            }`}
            aria-label="Toggle High Contrast Mode"
          >
            {highContrast ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span>{highContrast ? 'High Contrast ON' : 'High Contrast'}</span>
          </button>

          {/* Speech Readout */}
          <button
            onClick={handleReadHeaderAloud}
            className="px-3 py-2 text-sm font-bold text-slate-800 bg-sky-100 border-2 border-sky-400 rounded-lg hover:bg-sky-200 flex items-center gap-2 transition-all senior-touch-target"
            aria-label="Listen to page header aloud"
          >
            <Volume2 className="w-5 h-5 text-sky-700" />
            <span>Read Aloud</span>
          </button>
        </div>

        {/* Caregiver Admin & Print Shortcut */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('print')}
            className="px-4 py-2 text-sm font-bold text-slate-800 bg-emerald-100 border-2 border-emerald-400 rounded-lg hover:bg-emerald-200 flex items-center gap-2 transition-all senior-touch-target"
            aria-label="Print Fridge Schedule"
          >
            <Printer className="w-5 h-5 text-emerald-700" />
            <span>Print Schedule</span>
          </button>

          {/* Discreet Caregiver Admin Access */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="px-4 py-2 text-sm font-bold text-slate-700 bg-amber-100 border-2 border-amber-400 rounded-lg hover:bg-amber-200 flex items-center gap-2 transition-all senior-touch-target"
            title="Caregiver Admin Settings (or use URL #admin)"
            aria-label="Caregiver Admin Layer"
          >
            <ShieldAlert className="w-5 h-5 text-amber-700" />
            <span>Caregiver Admin</span>
          </button>
        </div>
      </div>

      {/* Main Header Brand & Title */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-sky-700 text-white rounded-2xl flex items-center justify-center shadow-md border-2 border-sky-800">
            <Pill className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Chemo Calendar
            </h1>
            <p className="text-sm sm:text-base font-semibold text-slate-600 flex items-center gap-2">
              <span>{regimenConfig.regimenName}</span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full border border-sky-300 font-bold">
                {regimenConfig.cycleDurationDays}-Day Cycle
              </span>
            </p>
          </div>
        </div>

        {/* Start Date & Regimen Quick Stats */}
        <div className="bg-slate-100 border-2 border-slate-300 rounded-xl px-4 py-2 text-right hidden md:block">
          <div className="text-xs uppercase font-bold text-slate-500">Regimen Schedule</div>
          <div className="text-base font-extrabold text-slate-800">
            Started: {regimenConfig.cycleStartDate}
          </div>
          <div className="text-xs font-bold text-sky-700">
            {regimenConfig.totalCycles} Total Cycles ({regimenConfig.cycleDurationDays * regimenConfig.totalCycles} Days)
          </div>
        </div>
      </div>

      {/* Main Senior-Friendly Tab Navigation */}
      <nav className="bg-slate-800 text-white border-t border-slate-700" aria-label="Main Navigation">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-around sm:justify-start gap-2">
          
          <button
            onClick={() => setActiveTab('today')}
            className={`px-5 py-3 font-extrabold text-base sm:text-lg flex items-center gap-2 border-b-4 transition-all senior-touch-target ${
              activeTab === 'today'
                ? 'bg-sky-700 text-white border-amber-400'
                : 'text-slate-200 hover:bg-slate-700 hover:text-white border-transparent'
            }`}
            aria-current={activeTab === 'today' ? 'page' : undefined}
          >
            <CheckCircle2 className="w-6 h-6 text-amber-300" />
            <span>Today's Schedule</span>
          </button>

          <button
            onClick={() => setActiveTab('cycle')}
            className={`px-5 py-3 font-extrabold text-base sm:text-lg flex items-center gap-2 border-b-4 transition-all senior-touch-target ${
              activeTab === 'cycle'
                ? 'bg-sky-700 text-white border-amber-400'
                : 'text-slate-200 hover:bg-slate-700 hover:text-white border-transparent'
            }`}
            aria-current={activeTab === 'cycle' ? 'page' : undefined}
          >
            <Calendar className="w-6 h-6 text-sky-300" />
            <span>28-Day Cycle Grid</span>
          </button>

          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-5 py-3 font-extrabold text-base sm:text-lg flex items-center gap-2 border-b-4 transition-all senior-touch-target ${
              activeTab === 'monthly'
                ? 'bg-sky-700 text-white border-amber-400'
                : 'text-slate-200 hover:bg-slate-700 hover:text-white border-transparent'
            }`}
            aria-current={activeTab === 'monthly' ? 'page' : undefined}
          >
            <CalendarDays className="w-6 h-6 text-purple-300" />
            <span>Monthly Calendar</span>
          </button>

          <button
            onClick={() => setActiveTab('medications')}
            className={`px-5 py-3 font-extrabold text-base sm:text-lg flex items-center gap-2 border-b-4 transition-all senior-touch-target ${
              activeTab === 'medications'
                ? 'bg-sky-700 text-white border-amber-400'
                : 'text-slate-200 hover:bg-slate-700 hover:text-white border-transparent'
            }`}
            aria-current={activeTab === 'medications' ? 'page' : undefined}
          >
            <BookOpen className="w-6 h-6 text-emerald-300" />
            <span>Medication Guide</span>
          </button>

        </div>
      </nav>
    </header>
  );
};
