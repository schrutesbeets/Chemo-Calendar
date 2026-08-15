import React, { useState } from 'react';
import { useRegimen } from '../context/RegimenContext';
import { 
  getDateForCycleAndDay, 
  formatDateKey, 
  isRestDay,
  getBadgeColorClasses
} from '../utils/cycleUtils';
import { DayDetailModal } from './DayDetailModal';
import { 
  Table as TableIcon, 
  Printer, 
  Volume2, 
  CheckCircle2, 
  Circle, 
  Layers,
  Info
} from 'lucide-react';

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
    setSelectedDayModal,
    speakText,
    highContrast
  } = useRegimen();

  // Toggle for grouping consecutive rest days (default true to match spreadsheet design)
  const [groupRestDays, setGroupRestDays] = useState<boolean>(true);

  const cycleDaysCount = regimenConfig.cycleDurationDays; // 28
  const medications = regimenConfig.medications;

  // Build row groups for days 1..28
  const rowGroups: RowGroup[] = [];
  let currentGroup: RowGroup | null = null;

  for (let d = 1; d <= cycleDaysCount; d++) {
    const isRest = isRestDay(d, medications);

    if (groupRestDays && isRest) {
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
    if (med.id === 'dexamethasone') return '40 mg';
    
    // Extract dose amount from clinicalName if available
    const match = med.clinicalName.match(/\d+[\.\d]*\s*(mg\/m²|mg|mcg|mL|g)/i);
    if (match) return `Dose (${match[0]})`;
    return 'Dose Given';
  };

  // Speech Readout for Table View
  const handleReadTableAloud = () => {
    let text = `Day-focused table view for ${regimenConfig.regimenName}, Cycle ${currentSelectedCycle}. `;
    text += `Listing ${rowGroups.length} schedule rows across ${cycleDaysCount} days.`;
    speakText(text);
  };

  const handlePrintTable = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header & Controls Bar */}
      <div className="bg-white border-4 border-slate-300 rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-sky-700 text-white rounded-xl flex items-center justify-center font-black">
              <TableIcon className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Day-Focused Schedule Table
              </h2>
              <p className="text-sm font-bold text-slate-600">
                Side-by-side medication breakdown across all 28 cycle days
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Cycle Switcher */}
          <select
            value={currentSelectedCycle}
            onChange={(e) => setCurrentSelectedCycle(Number(e.target.value))}
            className="px-4 py-3 border-2 border-slate-400 rounded-xl font-extrabold bg-white text-slate-900 senior-touch-target"
            aria-label="Select Cycle"
          >
            {Array.from({ length: regimenConfig.totalCycles }).map((_, idx) => (
              <option key={idx + 1} value={idx + 1}>
                Cycle {idx + 1} of {regimenConfig.totalCycles}
              </option>
            ))}
          </select>

          {/* Group Rest Days Toggle */}
          <button
            onClick={() => setGroupRestDays(!groupRestDays)}
            className={`px-4 py-3 rounded-xl font-extrabold text-sm border-2 flex items-center gap-2 transition-all senior-touch-target ${
              groupRestDays
                ? 'bg-amber-100 text-amber-950 border-amber-400'
                : 'bg-white text-slate-800 border-slate-400 hover:bg-slate-100'
            }`}
            title="Toggle grouping consecutive rest days"
          >
            <Layers className="w-5 h-5 text-amber-700" />
            <span>{groupRestDays ? 'Rest Days Grouped' : 'All 28 Days'}</span>
          </button>

          {/* Speech Readout */}
          <button
            onClick={handleReadTableAloud}
            className="px-4 py-3 bg-sky-600 hover:bg-sky-700 text-white font-extrabold rounded-xl border-2 border-sky-800 flex items-center gap-2 shadow-sm senior-touch-target"
          >
            <Volume2 className="w-5 h-5" />
            <span className="hidden sm:inline">Read Aloud</span>
          </button>

          {/* Print Table */}
          <button
            onClick={handlePrintTable}
            className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl border-2 border-emerald-800 flex items-center gap-2 shadow-sm senior-touch-target"
          >
            <Printer className="w-5 h-5" />
            <span className="hidden sm:inline">Print Table</span>
          </button>

        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border-4 border-slate-300 rounded-3xl shadow-xl overflow-hidden print:border-2 print:border-black print:rounded-none">
        
        {/* Table Title Bar */}
        <div className="bg-slate-900 text-white p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider bg-sky-600 text-white px-3 py-1 rounded-full">
              NCCN Regimen MUM46
            </span>
            <h3 className="text-xl sm:text-2xl font-black mt-1">
              Medication Schedule Matrix &bull; Cycle {currentSelectedCycle}
            </h3>
          </div>
          <div className="text-xs font-bold text-slate-300">
            Click any active dose to toggle confirmation
          </div>
        </div>

        {/* Scrollable Table Matrix */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            
            {/* Table Header */}
            <thead>
              <tr className="bg-slate-100 border-b-4 border-slate-400 text-slate-900">
                <th className="p-4 sm:p-5 font-black text-lg border-r-2 border-slate-300 w-44">
                  Day
                </th>
                {medications.map(med => {
                  const colors = getBadgeColorClasses(med.badgeColor, highContrast);
                  return (
                    <th 
                      key={med.id} 
                      className={`p-4 sm:p-5 border-r-2 border-slate-300 ${colors.bg}`}
                    >
                      <div className="space-y-0.5">
                        <span className={`px-2.5 py-0.5 rounded text-[11px] font-black uppercase ${colors.badge}`}>
                          {med.route}
                        </span>
                        <div className="text-lg font-black text-slate-900 leading-tight">
                          {med.patientFriendlyName}
                        </div>
                        <div className="text-xs font-bold text-slate-600">
                          {med.clinicalName}
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Table Rows */}
            <tbody className="divide-y-2 divide-slate-300 text-base font-bold">
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
                    className={`transition-colors ${
                      isTodayRow 
                        ? 'bg-amber-50/90 font-extrabold border-l-8 border-l-amber-500' 
                        : group.isRestGroup 
                        ? 'bg-slate-50/70 hover:bg-slate-100/80' 
                        : 'bg-white hover:bg-slate-50'
                    }`}
                  >
                    
                    {/* Day Column */}
                    <td className="p-4 sm:p-5 border-r-2 border-slate-300 align-middle">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="text-lg font-black text-slate-900 flex items-center gap-2">
                            <span>{dayLabel}</span>
                            {isTodayRow && (
                              <span className="bg-amber-500 text-black text-[10px] px-2 py-0.5 rounded-full font-black uppercase">
                                Today
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-bold text-slate-500 mt-0.5">
                            {dateSubLabel}
                          </div>
                        </div>

                        {!group.isRestGroup && (
                          <button
                            onClick={() => setSelectedDayModal(group.startDay)}
                            className="text-xs font-extrabold text-sky-700 hover:text-sky-900 underline no-print"
                            title="Inspect details"
                          >
                            Details
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Medication Columns */}
                    {medications.map(med => {
                      if (group.isRestGroup) {
                        return (
                          <td 
                            key={med.id} 
                            className="p-4 sm:p-5 border-r-2 border-slate-300 text-slate-400 italic text-center align-middle font-bold"
                          >
                            <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-black uppercase">
                              Rest
                            </span>
                          </td>
                        );
                      }

                      const isScheduled = med.days.includes(group.startDay);
                      const dateKey = formatDateKey(startDateObj);
                      const doseRecord = doseLogs[dateKey]?.[med.id] || { taken: false };
                      const taken = doseRecord.taken;
                      const colors = getBadgeColorClasses(med.badgeColor, highContrast);
                      const dosageLabel = getDosageLabel(med);

                      if (!isScheduled) {
                        return (
                          <td 
                            key={med.id} 
                            className="p-4 sm:p-5 border-r-2 border-slate-300 text-slate-300 text-center align-middle font-black text-xl"
                          >
                            &mdash;
                          </td>
                        );
                      }

                      return (
                        <td key={med.id} className="p-3 sm:p-4 border-r-2 border-slate-300 align-middle">
                          <button
                            onClick={() => toggleDose(dateKey, med.id)}
                            className={`w-full p-3.5 rounded-2xl border-3 text-left transition-all flex items-center justify-between gap-3 senior-touch-target shadow-sm ${
                              taken
                                ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-black'
                                : `${colors.bg} ${colors.border} hover:scale-[1.02]`
                            }`}
                            aria-label={`Mark ${med.patientFriendlyName} on ${dayLabel} as ${taken ? 'Not Taken' : 'Taken'}`}
                          >
                            <div className="space-y-0.5">
                              <div className="text-base font-black text-slate-900">
                                {dosageLabel}
                              </div>
                              <div className="text-xs font-bold text-slate-700 leading-snug whitespace-normal break-words">
                                {taken ? 'Confirmed Taken' : med.instructions}
                              </div>
                            </div>

                            <div className="shrink-0">
                              {taken ? (
                                <CheckCircle2 className="w-7 h-7 text-emerald-700" />
                              ) : (
                                <Circle className="w-7 h-7 text-slate-400" />
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
        <div className="bg-slate-100 p-4 border-t-2 border-slate-300 text-xs font-bold text-slate-700 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-700" />
            <span>Click any active dose button to mark taken or undo. Rest days show grouped intervals for clarity.</span>
          </div>
          <div>
            Showing {rowGroups.length} rows &bull; Cycle {currentSelectedCycle} of {regimenConfig.totalCycles}
          </div>
        </div>

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
