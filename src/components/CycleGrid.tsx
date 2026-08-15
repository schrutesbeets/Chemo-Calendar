import React from 'react';
import { useRegimen } from '../context/RegimenContext';
import { 
  getDateForCycleAndDay, 
  formatDateKey, 
  getMedicationsForCycleDay, 
  isRestDay,
  getBadgeColorClasses
} from '../utils/cycleUtils';
import { DayDetailModal } from './DayDetailModal';
import { Calendar, Syringe, CheckCircle2 } from 'lucide-react';

export const CycleGrid: React.FC = () => {
  const { 
    regimenConfig, 
    doseLogs, 
    currentSelectedCycle, 
    setCurrentSelectedCycle, 
    selectedDayModal, 
    setSelectedDayModal,
    highContrast
  } = useRegimen();

  const totalCycles = regimenConfig.totalCycles;
  const cycleDaysCount = regimenConfig.cycleDurationDays; // 28

  const cycleStartDate = getDateForCycleAndDay(
    currentSelectedCycle, 
    1, 
    regimenConfig.cycleStartDate, 
    cycleDaysCount
  );
  
  const cycleEndDate = getDateForCycleAndDay(
    currentSelectedCycle, 
    cycleDaysCount, 
    regimenConfig.cycleStartDate, 
    cycleDaysCount
  );

  const todayKey = formatDateKey(new Date());

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Cycle Selector & Dates Header */}
      <div className="bg-white border-4 border-slate-300 rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-7 h-7 text-sky-700" />
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              28-Day Cycle Grid
            </h2>
          </div>
          <p className="text-base font-bold text-slate-600 mt-1">
            {regimenConfig.regimenName} &bull; Cycle {currentSelectedCycle} of {totalCycles}
          </p>
          <div className="text-sm font-extrabold text-sky-800 mt-0.5">
            Dates: {cycleStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} &ndash; {cycleEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        {/* Cycle Tabs Switcher */}
        <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Select Cycle">
          {Array.from({ length: totalCycles }).map((_, idx) => {
            const cycleNum = idx + 1;
            const isSelected = currentSelectedCycle === cycleNum;

            return (
              <button
                key={cycleNum}
                onClick={() => setCurrentSelectedCycle(cycleNum)}
                className={`px-5 py-3 rounded-xl font-black text-base border-3 transition-all senior-touch-target ${
                  isSelected
                    ? 'bg-sky-700 text-white border-sky-900 shadow-md scale-105'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                }`}
                role="tab"
                aria-selected={isSelected}
                aria-label={`Cycle ${cycleNum}`}
              >
                Cycle {cycleNum}
              </button>
            );
          })}
        </div>
      </div>

      {/* Medication Badge Legend Bar */}
      <div className="bg-slate-100 border-3 border-slate-300 rounded-2xl p-4 flex flex-wrap items-center justify-around gap-4 text-sm font-extrabold text-slate-800">
        <span className="text-xs uppercase font-black text-slate-500">Badge Legend:</span>
        {regimenConfig.medications.map(med => {
          const colors = getBadgeColorClasses(med.badgeColor, highContrast);
          return (
            <div key={med.id} className="flex items-center gap-2">
              <span className={`w-4 h-4 rounded-full ${colors.badge} inline-block shadow-sm`} />
              <span>{med.patientFriendlyName}</span>
              <span className="text-xs font-bold text-slate-500">({med.route})</span>
            </div>
          );
        })}
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-emerald-100 border-2 border-emerald-500 inline-block" />
          <span>Rest Day (No Meds)</span>
        </div>
      </div>

      {/* 28-Day Calendar Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {Array.from({ length: cycleDaysCount }).map((_, idx) => {
          const dayNum = idx + 1;
          const dayDate = getDateForCycleAndDay(
            currentSelectedCycle, 
            dayNum, 
            regimenConfig.cycleStartDate, 
            cycleDaysCount
          );
          const dateKey = formatDateKey(dayDate);
          const isToday = dateKey === todayKey;

          const meds = getMedicationsForCycleDay(dayNum, regimenConfig.medications);
          const isRest = isRestDay(dayNum, regimenConfig.medications);

          const currentDayLogs = doseLogs[dateKey] || {};
          const allMedsTaken = meds.length > 0 && meds.every(m => currentDayLogs[m.id]?.taken);

          return (
            <div
              key={dayNum}
              onClick={() => setSelectedDayModal(dayNum)}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedDayModal(dayNum); }}
              className={`border-4 rounded-2xl p-3 flex flex-col justify-between min-h-[160px] cursor-pointer transition-all hover:scale-[1.02] focus:ring-4 focus:ring-sky-600 focus:outline-none ${
                isToday
                  ? 'bg-amber-50 border-amber-400 ring-4 ring-amber-300 shadow-xl'
                  : allMedsTaken
                  ? 'bg-emerald-50 border-emerald-400 shadow-sm'
                  : isRest
                  ? 'bg-slate-50 border-slate-300 hover:border-slate-400'
                  : 'bg-white border-slate-300 hover:border-sky-400 shadow-sm'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xl font-black text-slate-900 block">
                    Day {dayNum}
                  </span>
                  <span className="text-xs font-extrabold text-slate-600">
                    {dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                {isToday && (
                  <span className="bg-amber-500 text-black px-2 py-0.5 rounded-full text-xs font-black uppercase tracking-wider animate-pulse">
                    TODAY
                  </span>
                )}
                {allMedsTaken && (
                  <span className="bg-emerald-600 text-white p-1 rounded-full" title="All meds taken!">
                    <CheckCircle2 className="w-5 h-5" />
                  </span>
                )}
              </div>

              {/* Day Badges & Med Indicators */}
              <div className="my-2 space-y-1.5">
                {isRest ? (
                  <div className="text-xs font-bold text-slate-500 italic bg-slate-100 p-1.5 rounded-lg text-center">
                    Rest Day
                  </div>
                ) : (
                  meds.map(med => {
                    const colors = getBadgeColorClasses(med.badgeColor, highContrast);
                    const taken = currentDayLogs[med.id]?.taken;

                    return (
                      <div
                        key={med.id}
                        className={`text-xs font-black px-2 py-1 rounded-lg border flex items-center justify-between gap-1 truncate ${
                          taken ? 'bg-emerald-100 text-emerald-950 border-emerald-400 line-through opacity-80' : `${colors.pill}`
                        }`}
                      >
                        <span className="truncate">{med.patientFriendlyName}</span>
                        {med.id === 'bortezomib' && <Syringe className="w-3.5 h-3.5 shrink-0" />}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Day Footer Action */}
              <div className="text-right pt-1 border-t border-slate-200 text-xs font-extrabold text-sky-700">
                View Details &rarr;
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Day Inspection Modal Overlay */}
      {selectedDayModal !== null && (
        <DayDetailModal
          dayNumber={selectedDayModal}
          cycleNumber={currentSelectedCycle}
          onClose={() => setSelectedDayModal(null)}
        />
      )}

    </div>
  );
};
