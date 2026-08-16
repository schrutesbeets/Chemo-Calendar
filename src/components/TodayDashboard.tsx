import React, { useState } from 'react';
import { useRegimen } from '../context/RegimenContext';
import { 
  getCycleAndDayForDate, 
  formatDateKey, 
  formatFriendlyDate, 
  getMedicationsForCycleDay, 
  isClinicVisitDay, 
  isRestDay
} from '../utils/cycleUtils';

export const TodayDashboard: React.FC = () => {
  const { 
    regimenConfig, 
    doseLogs, 
    hydrationLogs, 
    toggleDose, 
    setHydrationCount, 
    incrementHydration
  } = useRegimen();

  // Selected date state (defaults to today's date)
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());

  const dateKey = formatDateKey(selectedDate);
  const { cycleNumber, cycleDay } = getCycleAndDayForDate(
    selectedDate,
    regimenConfig.cycleStartDate,
    regimenConfig.cycleDurationDays
  );

  const medsToday = getMedicationsForCycleDay(cycleDay, regimenConfig.medications);
  const clinicDay = isClinicVisitDay(cycleDay, regimenConfig.medications);
  const rest = isRestDay(cycleDay, regimenConfig.medications);

  const currentDoseLogs = doseLogs[dateKey] || {};
  const currentHydration = hydrationLogs[dateKey] || 0;
  const isCycloDay = medsToday.some(m => m.id === 'cyclophosphamide');

  // Date Navigation handlers
  const handlePrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };

  const handleResetToToday = () => {
    setSelectedDate(new Date());
  };

  const isToday = formatDateKey(new Date()) === dateKey;

  // Check if all meds for today are completed
  const allMedsTaken = medsToday.length > 0 && medsToday.every(m => currentDoseLogs[m.id]?.taken);

  return (
    <div className="layout-container py-6 flex-col gap-6" style={{ maxWidth: '1000px' }}>
      
      {/* Date & Cycle Header Bar - Material Design 3 Surface Container */}
      <md-elevated-card style={{ padding: '24px' }}>
        <div className="flex-row justify-between items-center pb-4" style={{ borderBottom: '1px solid var(--md-sys-color-outline)' }}>
          
          <div>
            <div className="flex-row items-center gap-2">
              <span style={{
                fontSize: '12px',
                textTransform: 'uppercase',
                fontWeight: 900,
                letterSpacing: '0.05em',
                padding: '4px 12px',
                borderRadius: '16px',
                backgroundColor: 'var(--md-sys-color-primary)',
                color: 'var(--md-sys-color-on-primary)'
              }}>
                {isToday ? "Today's Schedule" : "Selected Date"}
              </span>
              {!isToday && (
                <md-text-button onClick={handleResetToToday}>
                  Return to Today
                </md-text-button>
              )}
            </div>
            <h2 className="text-display mt-2" style={{ margin: 0 }}>
              {formatFriendlyDate(selectedDate)}
            </h2>
          </div>

          {/* Date Picker & Nav Controls */}
          <div className="flex-row items-center gap-2">
            <md-outlined-button onClick={handlePrevDay} aria-label="Previous Day">
              <md-icon slot="icon">chevron_left</md-icon>
              Prev Day
            </md-outlined-button>

            <md-filled-button onClick={handleResetToToday} style={{ '--md-filled-button-container-color': isToday ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-surface-container-highest)', '--md-filled-button-label-text-color': isToday ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface)' } as React.CSSProperties}>
              Today
            </md-filled-button>

            <md-outlined-button onClick={handleNextDay} aria-label="Next Day">
              Next Day
              <md-icon slot="icon">chevron_right</md-icon>
            </md-outlined-button>
          </div>

        </div>

        {/* Cycle Progress Tracker - Material Primary Container */}
        <div className="flex-row justify-between items-center mt-4">
          <div className="flex-row items-center gap-3">
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '18px',
              backgroundColor: 'var(--md-sys-color-primary-container)',
              color: 'var(--md-sys-color-on-primary-container)',
              border: '1px solid var(--md-sys-color-primary)'
            }}>
              C{cycleNumber}
            </div>
            <div>
              <div className="text-label-large" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Regimen Progress</div>
              <div className="text-title-large">
                Cycle {cycleNumber} of {regimenConfig.totalCycles} &bull; <span style={{ color: 'var(--md-sys-color-primary)', fontWeight: 900 }}>Day {cycleDay}</span> of {regimenConfig.cycleDurationDays}
              </div>
            </div>
          </div>
        </div>
      </md-elevated-card>

      {/* Day Status Banner */}
      {rest ? (
        <md-filled-card style={{ padding: '24px', '--md-sys-color-surface-container-highest': 'var(--md-sys-color-success-container)', color: 'var(--md-sys-color-on-success-container)' } as React.CSSProperties}>
          <div className="flex-row items-start gap-4">
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backgroundColor: 'rgba(0,0,0,0.1)' }}>
              <md-icon style={{ fontSize: '32px' }}>auto_awesome</md-icon>
            </div>
            <div>
              <h3 className="text-headline" style={{ margin: 0, fontWeight: 900 }}>Rest Day — No Chemotherapy Meds</h3>
              <p className="text-body-large mt-2" style={{ fontWeight: 'bold' }}>
                Give your body time to rest and rebuild. Stay well hydrated, take gentle walks if comfortable, and follow your general care guidelines.
              </p>
            </div>
          </div>
        </md-filled-card>
      ) : clinicDay ? (
        <md-filled-card style={{ padding: '24px', '--md-sys-color-surface-container-highest': 'var(--md-sys-color-primary-container)', color: 'var(--md-sys-color-on-primary-container)' } as React.CSSProperties}>
          <div className="flex-row items-start gap-4">
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backgroundColor: 'var(--md-sys-color-primary)', color: 'var(--md-sys-color-on-primary)' }}>
              <md-icon style={{ fontSize: '32px' }}>vaccines</md-icon>
            </div>
            <div>
              <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px', border: '1px solid var(--md-sys-color-primary)' }}>
                Clinic Appointment Scheduled
              </div>
              <h3 className="text-headline" style={{ margin: 0, fontWeight: 900 }}>Clinic Visit Day (Bortezomib Injection)</h3>
              <p className="text-body-large mt-2" style={{ fontWeight: 'bold' }}>
                You have a scheduled injection at the oncology clinic today. Allow rest time after your shot.
              </p>
            </div>
          </div>
        </md-filled-card>
      ) : (
        <md-filled-card style={{ padding: '24px', '--md-sys-color-surface-container-highest': 'var(--md-sys-color-secondary-container)', color: 'var(--md-sys-color-on-secondary-container)' } as React.CSSProperties}>
          <div className="flex-row items-start gap-4">
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backgroundColor: 'var(--md-sys-color-secondary)', color: 'var(--md-sys-color-on-secondary)' }}>
              <md-icon style={{ fontSize: '32px' }}>pill</md-icon>
            </div>
            <div>
              <h3 className="text-headline" style={{ margin: 0, fontWeight: 900 }}>Home Medication Day</h3>
              <p className="text-body-large mt-2" style={{ fontWeight: 'bold' }}>
                Take your oral medications by mouth as directed below with food and water.
              </p>
            </div>
          </div>
        </md-filled-card>
      )}

      {/* Medications Due Today Checklist Section */}
      {!rest && (
        <md-elevated-card style={{ padding: '24px' }}>
          <div className="flex-row items-center justify-between pb-3 mb-4" style={{ borderBottom: '1px solid var(--md-sys-color-outline)' }}>
            <h3 className="text-headline flex-row items-center gap-2" style={{ margin: 0, fontWeight: 900 }}>
              <md-icon style={{ color: 'var(--md-sys-color-primary)' }}>pill</md-icon>
              <span>Today's Medications ({medsToday.length})</span>
            </h3>
            {allMedsTaken && (
              <span style={{ 
                backgroundColor: 'var(--md-sys-color-success-container)', 
                color: 'var(--md-sys-color-on-success-container)',
                border: '1px solid currentColor',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '14px',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <md-icon style={{ fontSize: '20px' }}>check_circle</md-icon>
                All Doses Completed!
              </span>
            )}
          </div>

          <div className="flex-col gap-4">
            {medsToday.map(med => {
              const doseRecord = currentDoseLogs[med.id] || { taken: false };
              const taken = doseRecord.taken;

              // Material dynamic coloring per medicine (simplified mapping)
              const medColor = med.badgeColor || 'primary';
              const cardBg = taken ? 'var(--md-sys-color-success-container)' : `var(--md-sys-color-${medColor}-container)`;
              const cardColor = taken ? 'var(--md-sys-color-on-success-container)' : `var(--md-sys-color-on-${medColor}-container)`;

              return (
                <md-outlined-card
                  key={med.id}
                  style={{ 
                    padding: '20px', 
                    backgroundColor: cardBg, 
                    color: cardColor,
                    borderColor: taken ? 'var(--md-sys-color-on-success-container)' : `var(--md-sys-color-${medColor})`,
                    borderWidth: '2px'
                  }}
                >
                  <div className="flex-row items-center justify-between gap-4">
                    <div className="flex-col gap-2" style={{ flex: 1 }}>
                      <div className="flex-row items-center gap-2">
                        <span style={{ padding: '4px 12px', borderRadius: '8px', fontSize: '12px', textTransform: 'uppercase', fontWeight: 900, backgroundColor: `var(--md-sys-color-${medColor})`, color: `var(--md-sys-color-on-${medColor})` }}>
                          {med.route}
                        </span>
                        {taken && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', backgroundColor: 'var(--md-sys-color-on-success-container)', color: 'var(--md-sys-color-success-container)' }}>
                            <md-icon style={{ fontSize: '16px' }}>check_circle</md-icon> Taken
                          </span>
                        )}
                      </div>

                      <h4 className="text-headline" style={{ margin: 0, fontWeight: 900 }}>
                        {med.patientFriendlyName}
                      </h4>
                      
                      <div className="text-body-medium font-bold">
                        <span>Clinical Name:</span> {med.clinicalName}
                      </div>

                      <div style={{ border: '2px solid currentColor', borderRadius: '12px', padding: '12px', fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'flex-start', gap: '8px', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                        <md-icon style={{ marginTop: '2px' }}>info</md-icon>
                        <span>{med.instructions}</span>
                      </div>

                      {taken && doseRecord.timestamp && (
                        <div className="text-body-small font-bold flex-row items-center gap-1">
                          <md-icon style={{ fontSize: '16px' }}>schedule</md-icon>
                          <span>Confirmed on {new Date(doseRecord.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      )}
                    </div>

                    <md-filled-button
                      onClick={() => toggleDose(dateKey, med.id)}
                      style={{
                        '--md-filled-button-container-color': taken ? 'var(--md-sys-color-on-success-container)' : 'var(--md-sys-color-surface)',
                        '--md-filled-button-label-text-color': taken ? 'var(--md-sys-color-success-container)' : 'var(--md-sys-color-on-surface)',
                        padding: '16px 24px',
                        borderRadius: '16px',
                        border: taken ? 'none' : '4px solid currentColor',
                        height: 'auto'
                      } as React.CSSProperties}
                    >
                      <div className="flex-row items-center gap-3 py-2">
                        {taken ? (
                          <>
                            <md-icon>check_circle</md-icon>
                            <span className="text-title-large font-black">TAKEN</span>
                          </>
                        ) : (
                          <>
                            <md-icon>radio_button_unchecked</md-icon>
                            <span className="text-title-large font-black">MARK AS TAKEN</span>
                          </>
                        )}
                      </div>
                    </md-filled-button>
                  </div>
                </md-outlined-card>
              );
            })}
          </div>
        </md-elevated-card>
      )}

      {/* Hydration Tracker Card */}
      <md-elevated-card style={{ padding: '24px', backgroundColor: isCycloDay ? 'var(--md-sys-color-primary-container)' : undefined, color: isCycloDay ? 'var(--md-sys-color-on-primary-container)' : undefined }}>
        <div className="flex-row items-center justify-between gap-4 pb-4" style={{ borderBottom: '1px solid var(--md-sys-color-outline)' }}>
          <div>
            <div className="flex-row items-center gap-2">
              <md-icon style={{ fontSize: '32px', color: isCycloDay ? 'inherit' : 'var(--md-sys-color-primary)' }}>water_drop</md-icon>
              <h3 className="text-headline" style={{ margin: 0, fontWeight: 900 }}>
                Daily Hydration Tracker
              </h3>
            </div>
            <p className="text-body-large mt-1 font-bold">
              Target: 8 to 12 cups (2 to 3 Liters) of fluids daily.
            </p>
          </div>

          <div style={{ border: '2px solid currentColor', borderRadius: '12px', padding: '8px 20px', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <span style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 900 }}>Total Drank Today</span>
            <div className="text-display" style={{ fontWeight: 900 }}>
              {currentHydration} / 12 <span className="text-title-medium">cups</span>
            </div>
          </div>
        </div>

        {/* Cyclophosphamide Special Hydration Callout */}
        {isCycloDay && (
          <div className="mt-4 flex-row items-start gap-3" style={{ border: '2px solid var(--md-sys-color-error)', borderRadius: '12px', padding: '16px', backgroundColor: 'var(--md-sys-color-error-container)', color: 'var(--md-sys-color-on-error-container)' }}>
            <md-icon style={{ marginTop: '2px' }}>error</md-icon>
            <div>
              <h4 className="text-title-large font-black" style={{ margin: 0 }}>Cyclophosphamide Hydration Alert!</h4>
              <p className="text-body-medium font-bold" style={{ margin: 0, marginTop: '4px' }}>
                {regimenConfig.specialInstructions[0] || 'Drink extra fluids today to protect your bladder function.'}
              </p>
            </div>
          </div>
        )}

        {/* Interactive Water Cup Grid */}
        <div className="mt-6 flex-col gap-4">
          <div className="grid grid-cols-6 sm-grid-cols-12 gap-2">
            {Array.from({ length: 12 }).map((_, idx) => {
              const isFilled = idx < currentHydration;
              return (
                <button
                  key={idx}
                  onClick={() => setHydrationCount(dateKey, idx + 1 === currentHydration ? idx : idx + 1)}
                  style={{
                    height: '56px',
                    borderRadius: '12px',
                    border: '2px solid',
                    borderColor: isFilled ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline)',
                    backgroundColor: isFilled ? 'var(--md-sys-color-primary-container)' : 'transparent',
                    color: isFilled ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface-variant)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  title={`Cup ${idx + 1}`}
                  aria-label={`Water cup ${idx + 1} ${isFilled ? 'filled' : 'empty'}`}
                >
                  <md-icon style={{ color: isFilled ? 'var(--md-sys-color-primary)' : 'inherit' }}>
                    water_drop
                  </md-icon>
                </button>
              );
            })}
          </div>

          <div className="flex-row items-center justify-between gap-3 mt-2">
            <md-filled-button onClick={() => incrementHydration(dateKey)}>
              <md-icon slot="icon">water_drop</md-icon>
              + Add 1 Cup of Water
            </md-filled-button>

            {currentHydration > 0 && (
              <md-text-button onClick={() => setHydrationCount(dateKey, 0)}>
                Reset Hydration Count
              </md-text-button>
            )}
          </div>
        </div>
      </md-elevated-card>

      {/* Special Regimen Instructions Card */}
      {regimenConfig.specialInstructions.length > 0 && (
        <md-outlined-card style={{ padding: '20px' }}>
          <h4 className="text-title-large flex-row items-center gap-2" style={{ margin: 0, fontWeight: 900 }}>
            <md-icon style={{ color: 'var(--md-sys-color-primary)' }}>info</md-icon>
            <span>Special Regimen Instructions</span>
          </h4>
          <ul className="text-body-large font-bold" style={{ paddingLeft: '24px', marginTop: '12px', marginBottom: 0 }}>
            {regimenConfig.specialInstructions.map((instruction, idx) => (
              <li key={idx} style={{ marginBottom: '4px' }}>
                {instruction}
              </li>
            ))}
          </ul>
        </md-outlined-card>
      )}

    </div>
  );
};
