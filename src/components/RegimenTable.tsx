import React from 'react';
import { useRegimen } from '../context/RegimenContext';
import { 
  getDateForCycleAndDay, 
  formatDateKey, 
  isRestDay
} from '../utils/cycleUtils';
import { DayDetailModal } from './DayDetailModal';

interface RowGroup {
  startDay: number;
  endDay: number;
  isRestGroup: boolean;
}

export const RegimenTable: React.FC = () => {
  const { 
    regimenConfig, 
    doseLogs, 
    toggleDose, 
    currentSelectedCycle, 
    setCurrentSelectedCycle, 
    selectedDayModal, 
    setSelectedDayModal
  } = useRegimen();

  const cycleDaysCount = regimenConfig.cycleDurationDays; // 28
  const medications = regimenConfig.medications;

  // Build row groups for days 1..28 (grouping consecutive rest days by default)
  const rowGroups: RowGroup[] = [];
  let currentGroup: RowGroup | null = null;

  for (let d = 1; d <= cycleDaysCount; d++) {
    const isRest = isRestDay(d, medications);

    if (isRest) {
      if (currentGroup && currentGroup.isRestGroup) {
        currentGroup.endDay = d;
      } else {
        if (currentGroup) rowGroups.push(currentGroup);
        currentGroup = { startDay: d, endDay: d, isRestGroup: true };
      }
    } else {
      if (currentGroup) rowGroups.push(currentGroup);
      currentGroup = { startDay: d, endDay: d, isRestGroup: false };
    }
  }
  if (currentGroup) rowGroups.push(currentGroup);

  // Helper to extract clean dosage text from clinicalName or dosage description
  const getDosageLabel = (med: typeof medications[0]) => {
    if (med.id === 'bortezomib') return 'Dose (1.3 mg/m²)';
    if (med.id === 'cyclophosphamide') return 'Dose (300 mg/m²)';
    if (med.id === 'dexamethasone') return 'Dose (40 mg)';
    
    // Extract dose amount from clinicalName if available
    const match = med.clinicalName.match(/\d+[.\d]*\s*(mg\/m²|mg|mcg|mL|g)/i);
    if (match) return `Dose (${match[0]})`;
    return 'Dose Given';
  };

  const handlePrintTable = () => {
    window.print();
  };

  return (
    <div className="layout-container py-6 flex-col gap-6" style={{ maxWidth: '1200px' }}>
      
      {/* Header & Controls Bar */}
      <md-elevated-card style={{ padding: '24px' }}>
        <div className="flex-row items-center justify-between gap-6 no-print">
          <div className="flex-row items-center gap-4">
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--md-sys-color-primary)', color: 'var(--md-sys-color-on-primary)' }}>
              <md-icon style={{ fontSize: '32px' }}>table_chart</md-icon>
            </div>
            <div>
              <h2 className="text-headline" style={{ margin: 0, fontWeight: 900 }}>
                Day-Focused Schedule Table
              </h2>
              <p className="text-body-large" style={{ margin: 0, marginTop: '4px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                Side-by-side medication breakdown across all {cycleDaysCount} cycle days
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex-row items-center gap-4">
            
            {/* Cycle Switcher - Standard accessible select using Material tokens */}
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
              aria-label="Select Cycle"
            >
              {Array.from({ length: regimenConfig.totalCycles }).map((_, idx) => (
                <option key={idx + 1} value={idx + 1}>
                  Cycle {idx + 1} of {regimenConfig.totalCycles}
                </option>
              ))}
            </select>

            {/* Print Table */}
            <md-filled-button onClick={handlePrintTable}>
              <md-icon slot="icon">print</md-icon>
              Print Table
            </md-filled-button>

          </div>
        </div>
      </md-elevated-card>

      {/* Main Table Container */}
      <md-elevated-card style={{ padding: 0, overflow: 'hidden' }}>
        
        {/* Table Title Bar */}
        <div className="flex-row justify-between items-center" style={{ padding: '24px', backgroundColor: 'var(--md-sys-color-surface-container-highest)', color: 'var(--md-sys-color-on-surface-variant)' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', backgroundColor: 'var(--md-sys-color-primary)', color: 'var(--md-sys-color-on-primary)', padding: '4px 12px', borderRadius: '12px' }}>
              NCCN Regimen MUM46
            </span>
            <h3 className="text-title-large" style={{ margin: 0, marginTop: '8px', fontWeight: 900, color: 'var(--md-sys-color-on-surface)' }}>
              Medication Schedule Matrix &bull; Cycle {currentSelectedCycle}
            </h3>
          </div>
          <div className="text-body-medium font-bold">
            Click any active dose to toggle confirmation
          </div>
        </div>

        {/* Scrollable Table Matrix */}
        <div style={{ 
          overflowX: 'auto',
          margin: '0 24px 24px 24px',
          border: '1px solid var(--md-sys-color-outline)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', minWidth: '750px', borderCollapse: 'collapse', textAlign: 'left', tableLayout: 'fixed' }}>
            
            {/* Table Header */}
            <thead>
              <tr style={{ backgroundColor: 'var(--md-sys-color-surface-container)', borderBottom: '2px solid var(--md-sys-color-outline)' }}>
                <th style={{ padding: '16px', fontWeight: 900, fontSize: '18px', borderRight: '1px solid var(--md-sys-color-outline)', width: '160px', verticalAlign: 'top', color: 'var(--md-sys-color-on-surface)' }}>
                  Day
                </th>
                {medications.map((med, medIdx) => {
                  const isLast = medIdx === medications.length - 1;
                  const medColor = med.badgeColor || 'primary';
                  return (
                    <th 
                      key={med.id} 
                      style={{ padding: '16px', borderRight: isLast ? 'none' : '1px solid var(--md-sys-color-outline)', verticalAlign: 'top', backgroundColor: `var(--md-sys-color-${medColor}-container)`, color: `var(--md-sys-color-on-${medColor}-container)` }}
                    >
                      <div className="flex-col gap-1">
                        <div className="text-title-medium font-black" style={{ lineHeight: 1.2 }}>
                          {med.patientFriendlyName}
                        </div>
                        <div className="font-bold" style={{ opacity: 0.9, fontSize: '12px', lineHeight: 1.4, marginTop: '2px' }}>
                          {med.route}
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Table Rows */}
            <tbody style={{ fontSize: '16px', fontWeight: 'bold' }}>
              {rowGroups.map((group, idx) => {
                const isGroupedRest = group.isRestGroup && group.startDay !== group.endDay;
                const dayLabel = isGroupedRest 
                  ? `Days ${group.startDay}–${group.endDay}` 
                  : `Day ${group.startDay}`;

                // Calculate date for start day
                const startDateObj = getDateForCycleAndDay(
                  currentSelectedCycle,
                  group.startDay,
                  regimenConfig.cycleStartDate,
                  cycleDaysCount
                );
                
                const endDateObj = getDateForCycleAndDay(
                  currentSelectedCycle,
                  group.endDay,
                  regimenConfig.cycleStartDate,
                  cycleDaysCount
                );

                const dateSubLabel = isGroupedRest
                  ? `${startDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${endDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                  : startDateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

                const isTodayRow = !isGroupedRest && formatDateKey(startDateObj) === formatDateKey(new Date());

                return (
                  <tr 
                    key={idx} 
                    style={{ 
                      backgroundColor: isTodayRow ? 'var(--md-sys-color-tertiary-container)' : group.isRestGroup ? 'var(--md-sys-color-surface-container)' : 'var(--md-sys-color-surface)',
                      borderBottom: idx === rowGroups.length - 1 ? 'none' : '1px solid var(--md-sys-color-outline)'
                    }}
                  >
                    
                    <td style={{ 
                      padding: '16px', 
                      borderRight: '1px solid var(--md-sys-color-outline)', 
                      verticalAlign: 'middle', 
                      color: isTodayRow ? 'var(--md-sys-color-on-tertiary-container)' : 'var(--md-sys-color-on-surface)',
                      boxShadow: isTodayRow ? 'inset 4px 0 0 0 var(--md-sys-color-tertiary)' : 'none'
                    }}>
                      <div className="flex-col gap-1">
                        <div className="text-title-medium font-black flex-row items-center gap-2">
                          <span>{dayLabel}</span>
                          {isTodayRow && (
                            <span style={{ backgroundColor: 'var(--md-sys-color-tertiary)', color: 'var(--md-sys-color-on-tertiary)', fontSize: '10px', padding: '2px 8px', borderRadius: '12px', fontWeight: 900, textTransform: 'uppercase' }}>
                              Today
                            </span>
                          )}
                        </div>
                        <div className="text-body-small font-bold" style={{ opacity: 0.8 }}>
                          {dateSubLabel}
                        </div>
                        {!group.isRestGroup && (
                          <div style={{ paddingTop: '4px' }}>
                            <md-text-button onClick={() => setSelectedDayModal(group.startDay)}>
                              Details
                            </md-text-button>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Medication Columns */}
                    {medications.map((med, medIdx) => {
                      const isLast = medIdx === medications.length - 1;
                      if (group.isRestGroup) {
                        return (
                          <td 
                            key={med.id} 
                            style={{ padding: '16px', borderRight: isLast ? 'none' : '1px solid var(--md-sys-color-outline)', textAlign: 'center', verticalAlign: 'middle' }}
                          >
                            <span style={{ backgroundColor: 'var(--md-sys-color-surface-container-highest)', color: 'var(--md-sys-color-on-surface-variant)', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase' }}>
                              Rest
                            </span>
                          </td>
                        );
                      }

                      const isScheduled = med.days.includes(group.startDay);
                      const dateKey = formatDateKey(startDateObj);
                      const doseRecord = doseLogs[dateKey]?.[med.id] || { taken: false };
                      const taken = doseRecord.taken;
                      const dosageLabel = getDosageLabel(med);
                      const medColor = med.badgeColor || 'primary';

                      if (!isScheduled) {
                        return (
                          <td 
                            key={med.id} 
                            style={{ padding: '16px', borderRight: isLast ? 'none' : '1px solid var(--md-sys-color-outline)', textAlign: 'center', verticalAlign: 'middle', color: 'var(--md-sys-color-outline)', fontWeight: 900, fontSize: '24px' }}
                          >
                            &mdash;
                          </td>
                        );
                      }

                      return (
                        <td key={med.id} style={{ padding: '12px', borderRight: isLast ? 'none' : '1px solid var(--md-sys-color-outline)', verticalAlign: 'middle' }}>
                          <button
                            onClick={() => toggleDose(dateKey, med.id)}
                            style={{
                              width: '100%',
                              padding: '16px',
                              paddingRight: '48px',
                              borderRadius: '16px',
                              border: '2px solid',
                              borderColor: taken ? 'var(--md-sys-color-success)' : `var(--md-sys-color-${medColor})`,
                              backgroundColor: taken ? 'var(--md-sys-color-success-container)' : `var(--md-sys-color-${medColor}-container)`,
                              color: taken ? 'var(--md-sys-color-on-success-container)' : `var(--md-sys-color-on-${medColor}-container)`,
                              textAlign: 'left',
                              position: 'relative',
                              cursor: 'pointer',
                              fontFamily: 'inherit'
                            }}
                            aria-label={`Mark ${med.patientFriendlyName} on ${dayLabel} as ${taken ? 'Not Taken' : 'Taken'}`}
                          >
                            <div className="flex-col gap-1">
                              {/* Medication Name */}
                              <div className="text-body-large font-black" style={{ lineHeight: 1.2 }}>
                                {med.patientFriendlyName}
                              </div>

                              {/* Dosage Amount Label */}
                              <div className="text-title-medium font-black">
                                {dosageLabel}
                              </div>

                              {/* Full Instructions */}
                              <div className="text-body-small font-bold" style={{ opacity: 0.9, lineHeight: 1.4, marginTop: '2px' }}>
                                {taken ? 'Confirmed Taken' : med.instructions}
                              </div>
                            </div>

                            {/* Radio UI anchored to top-right corner of card */}
                            <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                              {taken ? (
                                <md-icon style={{ color: 'var(--md-sys-color-success)' }}>check_circle</md-icon>
                              ) : (
                                <md-icon style={{ color: `var(--md-sys-color-${medColor})` }}>radio_button_unchecked</md-icon>
                              )}
                            </div>
                          </button>
                        </td>
                      );
                    })}

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="flex-row justify-between items-center flex-wrap gap-2" style={{ padding: '16px 24px', backgroundColor: 'var(--md-sys-color-surface-container)', color: 'var(--md-sys-color-on-surface-variant)' }}>
          <div className="flex-row items-center gap-2 text-body-small font-bold">
            <md-icon style={{ fontSize: '16px' }}>info</md-icon>
            <span>Click any active dose button to mark taken or undo. Rest days show grouped intervals for clarity.</span>
          </div>
          <div className="text-body-small font-bold">
            Showing {rowGroups.length} rows &bull; Cycle {currentSelectedCycle} of {regimenConfig.totalCycles}
          </div>
        </div>

      </md-elevated-card>

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
