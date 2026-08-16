import React, { useState } from 'react';
import { useRegimen } from '../context/RegimenContext';
import { 
  getDateForCycleAndDay, 
  getMedicationsForCycleDay, 
  isClinicVisitDay, 
  isRestDay 
} from '../utils/cycleUtils';

export const PrintableSchedule: React.FC = () => {
  const { regimenConfig, currentSelectedCycle, setCurrentSelectedCycle } = useRegimen();

  const [patientName, setPatientName] = useState('Patient Name');
  const [clinicPhone, setClinicPhone] = useState('Clinic Phone: 555-0199');

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

  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <div className="layout-container py-6 flex-col gap-6" style={{ maxWidth: '1000px' }}>
      
      {/* Top Print Control Bar (Hidden during printing) */}
      <md-elevated-card className="no-print" style={{ padding: '24px' }}>
        <div className="flex-row items-center justify-between gap-4 flex-wrap">
          <div className="flex-row items-center gap-4">
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--md-sys-color-primary)', color: 'var(--md-sys-color-on-primary)' }}>
              <md-icon style={{ fontSize: '32px' }}>print</md-icon>
            </div>
            <div>
              <h2 className="text-headline" style={{ margin: 0, fontWeight: 900 }}>
                Printable Wall Chart (Fridge Schedule)
              </h2>
              <p className="text-body-large" style={{ margin: 0, marginTop: '4px', fontWeight: 'bold', color: 'var(--md-sys-color-on-surface-variant)' }}>
                Print a clean, physical 28-day schedule to attach to your refrigerator or medical binder.
              </p>
            </div>
          </div>

          <div className="flex-row items-center gap-4">
            <select
              value={currentSelectedCycle}
              onChange={(e) => setCurrentSelectedCycle(Number(e.target.value))}
              style={{
                padding: '12px 16px',
                border: '1px solid var(--md-sys-color-outline)',
                borderRadius: '8px',
                backgroundColor: 'var(--md-sys-color-surface)',
                color: 'var(--md-sys-color-on-surface)',
                fontFamily: 'inherit',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
              aria-label="Select Cycle to Print"
            >
              {Array.from({ length: regimenConfig.totalCycles }).map((_, idx) => (
                <option key={idx + 1} value={idx + 1}>
                  Cycle {idx + 1}
                </option>
              ))}
            </select>

            <md-filled-button onClick={handleTriggerPrint} style={{ '--md-filled-button-container-color': 'var(--md-sys-color-primary)', '--md-filled-button-label-text-color': 'var(--md-sys-color-on-primary)' } as React.CSSProperties}>
              <md-icon slot="icon">print</md-icon>
              Print Now
            </md-filled-button>
          </div>
        </div>
      </md-elevated-card>

      {/* Printable Sheet Container */}
      <md-elevated-card style={{ padding: '32px', backgroundColor: '#ffffff', color: '#000000', borderRadius: '24px' }}>
        
        {/* Printable Header */}
        <div className="flex-row justify-between items-start flex-wrap gap-4" style={{ borderBottom: '4px solid #000000', paddingBottom: '16px', marginBottom: '16px' }}>
          <div>
            <h1 className="text-display" style={{ margin: 0, fontWeight: 900, color: '#000000' }}>
              {regimenConfig.regimenName}
            </h1>
            <p className="text-title-large" style={{ margin: 0, marginTop: '4px', fontWeight: 'bold', color: '#333333' }}>
              Chemotherapy Schedule &bull; Cycle {currentSelectedCycle} of {regimenConfig.totalCycles}
            </p>
            <p className="text-body-medium" style={{ margin: 0, marginTop: '2px', fontWeight: 'bold', color: '#555555' }}>
              Cycle Start: {cycleStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} &ndash; End: {cycleEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Editable Patient/Clinic Phone block for physical sheet */}
          <div style={{ border: '2px solid #000000', borderRadius: '12px', padding: '12px', backgroundColor: '#f8f9fa', minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="flex-row items-center gap-2">
              <md-icon style={{ color: '#000000', fontSize: '16px' }}>person</md-icon>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #cccccc', fontSize: '14px', fontWeight: 'bold', color: '#000000', outline: 'none' }}
                placeholder="Patient Name"
              />
            </div>
            <div className="flex-row items-center gap-2">
              <md-icon style={{ color: '#000000', fontSize: '16px' }}>phone</md-icon>
              <input
                type="text"
                value={clinicPhone}
                onChange={(e) => setClinicPhone(e.target.value)}
                style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #cccccc', fontSize: '14px', fontWeight: 'bold', color: '#000000', outline: 'none' }}
                placeholder="Clinic Phone Number"
              />
            </div>
          </div>
        </div>

        {/* 28-Day Grid for Printing */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '8px', border: '2px solid #000000', padding: '8px', borderRadius: '16px', backgroundColor: '#ffffff' }}>
          {Array.from({ length: 28 }).map((_, idx) => {
            const dayNum = idx + 1;
            const dayDate = getDateForCycleAndDay(
              currentSelectedCycle, 
              dayNum, 
              regimenConfig.cycleStartDate, 
              28
            );
            const meds = getMedicationsForCycleDay(dayNum, regimenConfig.medications);
            const clinic = isClinicVisitDay(dayNum, regimenConfig.medications);
            const rest = isRestDay(dayNum, regimenConfig.medications);

            return (
              <div
                key={dayNum}
                style={{
                  border: '2px solid #aaaaaa',
                  borderRadius: '12px',
                  padding: '8px',
                  minHeight: '110px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: '#ffffff',
                  color: '#000000'
                }}
              >
                <div className="flex-row justify-between items-start" style={{ borderBottom: '1px solid #dddddd', paddingBottom: '4px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 900, fontSize: '16px' }}>Day {dayNum}</span>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#555555' }}>
                    {dayDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
                  </span>
                </div>

                <div className="flex-col gap-1 mt-1">
                  {rest ? (
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#777777', fontStyle: 'italic', textAlign: 'center', display: 'block' }}>Rest</span>
                  ) : (
                    meds.map(m => (
                      <div key={m.id} style={{ fontSize: '11px', fontWeight: 900, lineHeight: 1.2, border: '1px solid #000000', padding: '2px 4px', borderRadius: '4px', backgroundColor: '#f1f5f9', color: '#000000' }}>
                        {m.patientFriendlyName}
                      </div>
                    ))
                  )}
                </div>

                <div style={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'right', color: '#555555', marginTop: '4px' }}>
                  {clinic ? 'Nurse Shot' : rest ? '' : 'Oral Pill'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Instructions footer for physical wall chart */}
        <div className="flex-row justify-between items-center mt-4" style={{ borderTop: '2px solid #000000', paddingTop: '12px', fontSize: '12px', fontWeight: 'bold', color: '#222222' }}>
          <div>
            <strong>Hydration Reminder:</strong> Drink 8 to 12 cups of water daily, especially on Cyclophosphamide days!
          </div>
          <div>
            Chemo Calendar &bull; NCCN Regimen MUM46
          </div>
        </div>

      </md-elevated-card>

    </div>
  );
};
