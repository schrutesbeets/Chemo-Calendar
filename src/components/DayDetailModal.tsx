import React from 'react';
import { useRegimen } from '../context/RegimenContext';
import { 
  getDateForCycleAndDay, 
  formatDateKey, 
  formatFriendlyDate, 
  getMedicationsForCycleDay, 
  isClinicVisitDay, 
  isRestDay
} from '../utils/cycleUtils';

interface DayDetailModalProps {
  dayNumber: number;
  cycleNumber: number;
  onClose: () => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({ dayNumber, cycleNumber, onClose }) => {
  const { regimenConfig, doseLogs, hydrationLogs, toggleDose, setHydrationCount } = useRegimen();

  const targetDate = getDateForCycleAndDay(
    cycleNumber,
    dayNumber,
    regimenConfig.cycleStartDate,
    regimenConfig.cycleDurationDays
  );

  const dateKey = formatDateKey(targetDate);
  const meds = getMedicationsForCycleDay(dayNumber, regimenConfig.medications);
  const isClinic = isClinicVisitDay(dayNumber, regimenConfig.medications);
  const isRest = isRestDay(dayNumber, regimenConfig.medications);

  const currentDoseLogs = doseLogs[dateKey] || {};
  const currentHydration = hydrationLogs[dateKey] || 0;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto'
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="day-modal-title"
    >
      <div style={{ 
        padding: '32px', 
        width: '100%', 
        maxWidth: '700px', 
        maxHeight: '90vh', 
        overflowY: 'auto',
        backgroundColor: 'var(--md-sys-color-surface-container)',
        borderRadius: '28px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
      }}>
        
        {/* Modal Header */}
        <div className="flex-row items-start justify-between gap-4 mb-6" style={{ borderBottom: '1px solid var(--md-sys-color-outline-variant)', paddingBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', backgroundColor: 'var(--md-sys-color-primary)', color: 'var(--md-sys-color-on-primary)', padding: '4px 12px', borderRadius: '16px' }}>
              Cycle {cycleNumber} &bull; Day {dayNumber}
            </span>
            <h3 id="day-modal-title" className="text-display" style={{ margin: 0, marginTop: '8px', fontSize: '32px', lineHeight: '40px', fontWeight: 900 }}>
              {formatFriendlyDate(targetDate)}
            </h3>
          </div>

          <md-icon-button onClick={onClose} aria-label="Close modal">
            <md-icon>close</md-icon>
          </md-icon-button>
        </div>

        {/* Day Status Summary */}
        <div className="mb-6">
          {isRest ? (
            <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-highest)', border: '2px solid var(--md-sys-color-outline)', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--md-sys-color-on-surface)' }}>
              <md-icon style={{ fontSize: '32px', color: 'var(--md-sys-color-on-surface-variant)' }}>hotel_class</md-icon>
              <div>
                <h4 className="text-title-large" style={{ margin: 0, fontWeight: 900 }}>Rest Day</h4>
                <p className="text-body-medium" style={{ margin: 0, fontWeight: 'bold' }}>No chemotherapy medications are scheduled for today.</p>
              </div>
            </div>
          ) : isClinic ? (
            <div style={{ backgroundColor: 'var(--md-sys-color-primary-container)', border: '2px solid var(--md-sys-color-primary)', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--md-sys-color-on-primary-container)' }}>
              <md-icon style={{ fontSize: '32px', color: 'var(--md-sys-color-primary)' }}>vaccines</md-icon>
              <div>
                <h4 className="text-title-large" style={{ margin: 0, fontWeight: 900 }}>Clinic Visit Day</h4>
                <p className="text-body-medium" style={{ margin: 0, fontWeight: 'bold' }}>Bortezomib subcutaneous injection administered by clinic nurse.</p>
              </div>
            </div>
          ) : (
            <div style={{ backgroundColor: 'var(--md-sys-color-secondary-container)', border: '2px solid var(--md-sys-color-secondary)', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--md-sys-color-on-secondary-container)' }}>
              <md-icon style={{ fontSize: '32px', color: 'var(--md-sys-color-secondary)' }}>pill</md-icon>
              <div>
                <h4 className="text-title-large" style={{ margin: 0, fontWeight: 900 }}>Home Oral Medication Day</h4>
                <p className="text-body-medium" style={{ margin: 0, fontWeight: 'bold' }}>Take oral pills by mouth with food and plenty of water.</p>
              </div>
            </div>
          )}
        </div>

        {/* Medication Doses List */}
        {!isRest && (
          <div className="flex-col gap-4 mb-6">
            <h4 className="text-title-large" style={{ margin: 0, fontWeight: 900 }}>Scheduled Medications ({meds.length})</h4>
            <div className="flex-col gap-4">
              {meds.map(med => {
                const doseRecord = currentDoseLogs[med.id] || { taken: false };
                const taken = doseRecord.taken;
                const medColor = med.badgeColor || 'primary';

                return (
                  <div 
                    key={med.id}
                    style={{
                      border: '2px solid',
                      borderColor: taken ? 'var(--md-sys-color-success)' : `var(--md-sys-color-${medColor})`,
                      borderRadius: '16px',
                      padding: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '16px',
                      flexWrap: 'wrap',
                      backgroundColor: taken ? 'var(--md-sys-color-success-container)' : `var(--md-sys-color-${medColor}-container)`,
                      color: taken ? 'var(--md-sys-color-on-success-container)' : `var(--md-sys-color-on-${medColor}-container)`
                    }}
                  >
                    <div className="flex-col gap-1 flex-1">
                      <span style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', backgroundColor: taken ? 'var(--md-sys-color-success)' : `var(--md-sys-color-${medColor})`, color: taken ? 'var(--md-sys-color-on-success)' : `var(--md-sys-color-on-${medColor})`, padding: '2px 8px', borderRadius: '4px', alignSelf: 'flex-start' }}>
                        {med.route}
                      </span>
                      <h5 className="text-title-large" style={{ margin: 0, marginTop: '4px', fontWeight: 900 }}>{med.patientFriendlyName}</h5>
                      <p className="text-body-small" style={{ margin: 0, fontWeight: 'bold', opacity: 0.9 }}>{med.instructions}</p>
                    </div>

                    <button
                      onClick={() => toggleDose(dateKey, med.id)}
                      style={{
                        padding: '12px 24px',
                        borderRadius: '12px',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '16px',
                        fontWeight: 900,
                        cursor: 'pointer',
                        backgroundColor: taken ? 'var(--md-sys-color-success)' : 'var(--md-sys-color-surface)',
                        color: taken ? 'var(--md-sys-color-on-success)' : 'var(--md-sys-color-on-surface)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      {taken ? (
                        <>
                          <md-icon>check_circle</md-icon>
                          <span>TAKEN</span>
                        </>
                      ) : (
                        <>
                          <md-icon style={{ color: 'var(--md-sys-color-outline)' }}>radio_button_unchecked</md-icon>
                          <span>MARK TAKEN</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Hydration Tracker */}
        <div style={{ backgroundColor: 'var(--md-sys-color-surface-container)', border: '1px solid var(--md-sys-color-outline)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <div className="flex-row items-center justify-between mb-4">
            <h4 className="text-title-large flex-row items-center gap-2" style={{ margin: 0, fontWeight: 900 }}>
              <md-icon style={{ color: 'var(--md-sys-color-primary)' }}>water_drop</md-icon>
              <span>Hydration Status</span>
            </h4>
            <span style={{ fontSize: '14px', fontWeight: 900, color: 'var(--md-sys-color-primary)', backgroundColor: 'var(--md-sys-color-primary-container)', padding: '4px 12px', borderRadius: '16px' }}>
              {currentHydration} / 12 cups
            </span>
          </div>

          <div className="flex-row items-center gap-4">
            <md-filled-tonal-icon-button onClick={() => setHydrationCount(dateKey, Math.max(0, currentHydration - 1))}>
              <md-icon>remove</md-icon>
            </md-filled-tonal-icon-button>
            <div style={{ flex: 1, height: '16px', backgroundColor: 'var(--md-sys-color-primary-container)', borderRadius: '8px', overflow: 'hidden' }}>
              <div 
                style={{ height: '100%', backgroundColor: 'var(--md-sys-color-primary)', transition: 'width 0.3s', width: `${(Math.min(12, currentHydration) / 12) * 100}%` }}
              />
            </div>
            <md-filled-icon-button onClick={() => setHydrationCount(dateKey, Math.min(12, currentHydration + 1))}>
              <md-icon>add</md-icon>
            </md-filled-icon-button>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex-row justify-end">
          <md-filled-button onClick={onClose} style={{ '--md-filled-button-container-color': 'var(--md-sys-color-on-surface)', '--md-filled-button-label-text-color': 'var(--md-sys-color-surface)' } as any}>
            Done
          </md-filled-button>
        </div>

      </div>
    </div>
  );
};
