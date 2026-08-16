import React, { useState } from 'react';
import { useRegimen } from '../context/RegimenContext';
import { 
  getCycleAndDayForDate, 
  formatDateKey, 
  getMedicationsForCycleDay
} from '../utils/cycleUtils';
import { DayDetailModal } from './DayDetailModal';

export const MonthlyCalendar: React.FC = () => {
  const { regimenConfig } = useRegimen();

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
    <div className="layout-container py-6 flex-col gap-6" style={{ maxWidth: '1200px' }}>
      
      {/* Month Navigation Header */}
      <md-elevated-card style={{ padding: '24px' }}>
        <div className="flex-row items-center justify-between gap-4 flex-wrap">
          <div className="flex-row items-center gap-4">
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--md-sys-color-primary)', color: 'var(--md-sys-color-on-primary)' }}>
              <md-icon style={{ fontSize: '32px' }}>date_range</md-icon>
            </div>
            <div>
              <h2 className="text-headline" style={{ margin: 0, fontWeight: 900 }}>
                {monthTitle}
              </h2>
              <p className="text-body-large" style={{ margin: 0, marginTop: '4px', color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 'bold' }}>
                Multi-Cycle Regimen Calendar View
              </p>
            </div>
          </div>

          <div className="flex-row items-center gap-2">
            <md-outlined-button onClick={handlePrevMonth} aria-label="Previous Month">
              <md-icon slot="icon">chevron_left</md-icon>
              Prev Month
            </md-outlined-button>

            <md-outlined-button onClick={handleNextMonth} aria-label="Next Month">
              Next Month
              <md-icon slot="icon">chevron_right</md-icon>
            </md-outlined-button>
          </div>
        </div>
      </md-elevated-card>

      {/* Monthly Grid */}
      <md-elevated-card style={{ padding: '16px' }}>
        
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2" style={{ borderBottom: '2px solid var(--md-sys-color-outline)', paddingBottom: '8px', marginBottom: '8px', textAlign: 'center', fontWeight: 900, color: 'var(--md-sys-color-on-surface-variant)' }}>
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
            <div key={`empty-${idx}`} style={{ minHeight: '120px', borderRadius: '12px', backgroundColor: 'var(--md-sys-color-surface-container)' }} />
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
                style={{
                  minHeight: '120px',
                  padding: '8px',
                  borderRadius: '12px',
                  border: '2px solid',
                  borderColor: isToday ? 'var(--md-sys-color-tertiary)' : isRegimenActive ? 'var(--md-sys-color-outline-variant)' : 'var(--md-sys-color-outline-variant)',
                  backgroundColor: isToday ? 'var(--md-sys-color-tertiary-container)' : isRegimenActive ? 'var(--md-sys-color-surface)' : 'var(--md-sys-color-surface-container)',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: isRegimenActive ? 'pointer' : 'default',
                  opacity: isRegimenActive ? 1 : 0.6,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  position: 'relative'
                }}
                onMouseOver={(e) => {
                  if (isRegimenActive) {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                  }
                }}
                onMouseOut={(e) => {
                  if (isRegimenActive) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {isRegimenActive && <md-ripple></md-ripple>}
                
                <div className="flex-row items-start justify-between">
                  <span className="text-title-medium font-black" style={{ color: isToday ? 'var(--md-sys-color-on-tertiary-container)' : 'var(--md-sys-color-on-surface)' }}>
                    {dayOfMonth}
                  </span>
                  {isRegimenActive && (
                    <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', backgroundColor: 'var(--md-sys-color-primary-container)', color: 'var(--md-sys-color-on-primary-container)', padding: '2px 4px', borderRadius: '4px' }}>
                      C{cycleNumber}D{cycleDay}
                    </span>
                  )}
                </div>

                {/* Medication Pills */}
                {isRegimenActive && (
                  <div className="flex-col gap-1 mt-2">
                    {meds.length === 0 ? (
                      <span style={{ fontSize: '10px', fontWeight: 'bold', fontStyle: 'italic', color: 'var(--md-sys-color-on-surface-variant)' }}>Rest Day</span>
                    ) : (
                      meds.map(m => {
                        const medColor = m.badgeColor || 'primary';
                        return (
                          <div key={m.id} style={{
                            fontSize: '10px',
                            fontWeight: 900,
                            padding: '2px 4px',
                            borderRadius: '4px',
                            whiteSpace: 'normal',
                            lineHeight: '1.2',
                            backgroundColor: `var(--md-sys-color-${medColor}-container)`,
                            color: `var(--md-sys-color-on-${medColor}-container)`,
                            border: `1px solid var(--md-sys-color-${medColor})`
                          }}>
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
      </md-elevated-card>

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
