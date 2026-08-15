import React, { useState } from 'react';
import { useRegimen } from '../context/RegimenContext';
import { 
  getCycleAndDayForDate, 
  formatDateKey, 
  getMedicationsForCycleDay, 
  getBadgeColorClasses 
} from '../utils/cycleUtils';
import { DayDetailModal } from './DayDetailModal';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

export const MonthlyCalendar: React.FC = () => {
  const { regimenConfig, highContrast } = useRegimen();

  // State for visible month (starts with month of cycleStartDate: e.g. Aug 2026)
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(() => {
    const [y, m] = regimenConfig.cycleStartDate.split('-').map(Number);
    return new Date(y, m - 1, 1);
  });

  const [activeDayModal, setActiveDayModal] = useState<{ dayNum: number; cycleNum: number } | null>(null);

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  // Month navigation handlers
  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  // Calendar matrix calculations
  const firstDayOfMonth = new Date(year, month, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun, 1 = Mon ...
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthTitle = currentMonthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const todayKey = formatDateKey(new Date());

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Month Navigation Header */}
      <div className="bg-white border-4 border-slate-300 rounded-2xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CalendarDays className="w-8 h-8 text-purple-700" />
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {monthTitle}
            </h2>
            <p className="text-sm font-bold text-slate-600">
              Multi-Cycle Regimen Calendar View
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevMonth}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 border-2 border-slate-400 rounded-xl font-extrabold text-slate-800 flex items-center gap-1 senior-touch-target"
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-6 h-6" />
            <span>Prev Month</span>
          </button>

          <button
            onClick={handleNextMonth}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 border-2 border-slate-400 rounded-xl font-extrabold text-slate-800 flex items-center gap-1 senior-touch-target"
            aria-label="Next Month"
          >
            <span>Next Month</span>
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Monthly Grid */}
      <div className="bg-white border-4 border-slate-300 rounded-2xl p-4 shadow-md">
        
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 border-b-2 border-slate-300 pb-2 mb-2 text-center font-black text-slate-700 text-sm sm:text-base">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Calendar Cells */}
        <div className="grid grid-cols-7 gap-2">
          
          {/* Empty padding slots before 1st of month */}
          {Array.from({ length: startingDayOfWeek }).map((_, idx) => (
            <div key={`empty-${idx}`} className="bg-slate-50/50 border-2 border-slate-100 rounded-xl min-h-[110px]" />
          ))}

          {/* Actual days in month */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayOfMonth = idx + 1;
            const cellDate = new Date(year, month, dayOfMonth);
            const dateKey = formatDateKey(cellDate);
            const isToday = dateKey === todayKey;

            const { cycleNumber, cycleDay, isWithinRegimen } = getCycleAndDayForDate(
              cellDate,
              regimenConfig.cycleStartDate,
              regimenConfig.cycleDurationDays
            );

            const isRegimenActive = isWithinRegimen && cycleNumber >= 1 && cycleNumber <= regimenConfig.totalCycles;
            const meds = isRegimenActive ? getMedicationsForCycleDay(cycleDay, regimenConfig.medications) : [];

            return (
              <div
                key={dayOfMonth}
                onClick={() => {
                  if (isRegimenActive) {
                    setActiveDayModal({ dayNum: cycleDay, cycleNum: cycleNumber });
                  }
                }}
                className={`border-2 rounded-xl p-2 min-h-[110px] flex flex-col justify-between transition-all ${
                  isRegimenActive ? 'cursor-pointer hover:border-sky-500 hover:shadow-md' : 'opacity-60 bg-slate-50'
                } ${
                  isToday ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-300 font-extrabold' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className={`text-base font-black ${isToday ? 'text-amber-950' : 'text-slate-900'}`}>
                    {dayOfMonth}
                  </span>
                  {isRegimenActive && (
                    <span className="text-[10px] font-black uppercase bg-slate-800 text-white px-1.5 py-0.5 rounded">
                      C{cycleNumber}D{cycleDay}
                    </span>
                  )}
                </div>

                {/* Medication Pills */}
                {isRegimenActive && (
                  <div className="space-y-1 my-1">
                    {meds.length === 0 ? (
                      <span className="text-[10px] text-slate-400 font-bold italic block">Rest Day</span>
                    ) : (
                      meds.map(m => {
                        const colors = getBadgeColorClasses(m.badgeColor, highContrast);
                        return (
                          <div key={m.id} className={`text-[10px] font-black px-1.5 py-0.5 rounded truncate ${colors.pill}`}>
                            {m.patientFriendlyName}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}

        </div>
      </div>

      {/* Modal for Day Inspection from Monthly View */}
      {activeDayModal && (
        <DayDetailModal
          dayNumber={activeDayModal.dayNum}
          cycleNumber={activeDayModal.cycleNum}
          onClose={() => setActiveDayModal(null)}
        />
      )}

    </div>
  );
};
