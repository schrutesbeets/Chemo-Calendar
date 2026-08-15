import React, { useState, useRef, useEffect } from 'react';
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
  BookOpen,
  Settings,
  X
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

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or ESC key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleReadHeaderAloud = () => {
    speakText(`Chemo Calendar. Active regimen: ${regimenConfig.regimenName}. You have ${regimenConfig.totalCycles} total cycles of ${regimenConfig.cycleDurationDays} days.`);
  };

  return (
    <header className="bg-white border-b-4 border-slate-300 shadow-sm no-print sticky top-0 z-30 transition-colors">
      
      {/* Main Header Brand & Title Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & Regimen info */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-sky-700 text-white rounded-2xl flex items-center justify-center shadow-md border-2 border-sky-800 shrink-0">
            <Pill className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Chemo Calendar
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 flex items-center gap-2">
              <span>{regimenConfig.regimenName}</span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full border border-sky-300 font-bold">
                {regimenConfig.cycleDurationDays}-Day Cycle
              </span>
            </p>
          </div>
        </div>

        {/* Right side: Regimen Schedule Stats & Settings Entry Point */}
        <div className="flex items-center gap-3">
          
          {/* Regimen Schedule Stats */}
          <div className="bg-slate-100 border-2 border-slate-300 rounded-xl px-4 py-2 text-right hidden sm:block">
            <div className="text-xs uppercase font-bold text-slate-500">Regimen Schedule</div>
            <div className="text-sm sm:text-base font-extrabold text-slate-800">
              Started: {regimenConfig.cycleStartDate}
            </div>
            <div className="text-xs font-bold text-sky-700">
              {regimenConfig.totalCycles} Total Cycles ({regimenConfig.cycleDurationDays * regimenConfig.totalCycles} Days)
            </div>
          </div>

          {/* Settings Entry Point directly to the right of Regimen Schedule */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-900 text-white font-extrabold rounded-xl border-2 border-slate-900 flex items-center gap-2 shadow-md transition-all senior-touch-target"
              aria-label="Settings and Accessibility Menu"
              aria-expanded={isSettingsOpen}
            >
              <Settings className="w-6 h-6 text-amber-400" />
              <span className="text-base">Settings</span>
            </button>

            {/* Settings Dropdown Flyout */}
            {isSettingsOpen && (
              <div 
                className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border-4 border-slate-400 rounded-3xl shadow-2xl p-5 z-50 space-y-4 animate-in fade-in zoom-in-95 duration-100"
                role="menu"
                aria-orientation="vertical"
              >
                {/* Flyout Header */}
                <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Settings className="w-6 h-6 text-slate-800" />
                    <h2 className="text-lg font-black text-slate-900">
                      Settings & Accessibility
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsSettingsOpen(false)}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full border border-slate-300"
                    aria-label="Close settings"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Control 1: Text Size Selector */}
                <div className="space-y-1.5">
                  <label className="block text-xs uppercase font-extrabold text-slate-500 tracking-wider">
                    Text Size (Senior Accessibility)
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-300" role="group" aria-label="Text Size Controls">
                    {(['normal', 'large', 'jumbo'] as FontSize[]).map(size => (
                      <button
                        key={size}
                        onClick={() => setFontSize(size)}
                        className={`py-2 text-xs font-bold rounded-lg transition-all ${
                          fontSize === size 
                            ? 'bg-sky-700 text-white shadow-sm font-black' 
                            : 'text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {size === 'normal' && 'A Normal'}
                        {size === 'large' && 'A+ Large'}
                        {size === 'jumbo' && 'A++ Jumbo'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Control 2: High Contrast Toggle */}
                <div className="pt-1">
                  <button
                    onClick={() => setHighContrast(!highContrast)}
                    className={`w-full py-3 px-4 rounded-xl font-extrabold text-sm border-2 flex items-center justify-between transition-all senior-touch-target ${
                      highContrast
                        ? 'bg-yellow-400 text-black border-black'
                        : 'bg-slate-800 text-white border-slate-900 hover:bg-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {highContrast ? <Sun className="w-5 h-5 text-black" /> : <Moon className="w-5 h-5 text-amber-300" />}
                      <span>High Contrast Mode</span>
                    </span>
                    <span className="text-xs uppercase px-2 py-0.5 rounded font-black bg-white/20">
                      {highContrast ? 'ON' : 'OFF'}
                    </span>
                  </button>
                </div>

                {/* Control 3: Speech Readout */}
                <div>
                  <button
                    onClick={() => {
                      handleReadHeaderAloud();
                      setIsSettingsOpen(false);
                    }}
                    className="w-full py-3 px-4 text-sm font-extrabold text-slate-900 bg-sky-100 border-2 border-sky-400 rounded-xl hover:bg-sky-200 flex items-center justify-between transition-all senior-touch-target"
                  >
                    <span className="flex items-center gap-2">
                      <Volume2 className="w-5 h-5 text-sky-700" />
                      <span>Read Schedule Aloud</span>
                    </span>
                    <span className="text-xs font-bold text-sky-800">Voice</span>
                  </button>
                </div>

                <div className="border-t border-slate-200 pt-3 space-y-2">
                  {/* Control 4: Print Schedule Shortcut */}
                  <button
                    onClick={() => {
                      setActiveTab('print');
                      setIsSettingsOpen(false);
                    }}
                    className="w-full py-3 px-4 text-sm font-extrabold text-slate-900 bg-emerald-100 border-2 border-emerald-400 rounded-xl hover:bg-emerald-200 flex items-center justify-between transition-all senior-touch-target"
                  >
                    <span className="flex items-center gap-2">
                      <Printer className="w-5 h-5 text-emerald-700" />
                      <span>Print Fridge Schedule</span>
                    </span>
                    <span className="text-xs font-bold text-emerald-800">PDF</span>
                  </button>

                  {/* Control 5: Caregiver Admin Layer Access */}
                  <button
                    onClick={() => {
                      setIsAdminOpen(true);
                      setIsSettingsOpen(false);
                    }}
                    className="w-full py-3 px-4 text-sm font-extrabold text-slate-900 bg-amber-100 border-2 border-amber-400 rounded-xl hover:bg-amber-200 flex items-center justify-between transition-all senior-touch-target"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-amber-700" />
                      <span>Caregiver Admin Portal</span>
                    </span>
                    <span className="text-xs font-bold text-amber-800">JSON</span>
                  </button>
                </div>

              </div>
            )}
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
