import React, { useState } from 'react';
import { useRegimen } from '../context/RegimenContext';
import { 
  getDateForCycleAndDay, 
  getMedicationsForCycleDay, 
  isClinicVisitDay, 
  isRestDay 
} from '../utils/cycleUtils';
import { Printer, Phone, User } from 'lucide-react';

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
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      
      {/* Top Print Control Bar (Hidden during printing) */}
      <div className="bg-white border-4 border-slate-300 rounded-2xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <Printer className="w-8 h-8 text-emerald-600" />
            <span>Printable Wall Chart (Fridge Schedule)</span>
          </h2>
          <p className="text-sm font-bold text-slate-600 mt-1">
            Print a clean, physical 28-day schedule to attach to your refrigerator or medical binder.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={currentSelectedCycle}
            onChange={(e) => setCurrentSelectedCycle(Number(e.target.value))}
            className="px-4 py-3 border-2 border-slate-400 rounded-xl font-bold bg-white text-slate-900 senior-touch-target"
            aria-label="Select Cycle to Print"
          >
            {Array.from({ length: regimenConfig.totalCycles }).map((_, idx) => (
              <option key={idx + 1} value={idx + 1}>
                Cycle {idx + 1}
              </option>
            ))}
          </select>

          <button
            onClick={handleTriggerPrint}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg rounded-xl border-2 border-emerald-800 flex items-center gap-2 shadow-md senior-touch-target"
          >
            <Printer className="w-6 h-6" />
            <span>Print Now</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Container */}
      <div className="bg-white border-4 border-slate-400 rounded-3xl p-8 shadow-xl space-y-6 print:border-none print:p-0 print:shadow-none">
        
        {/* Printable Header */}
        <div className="border-b-4 border-black pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-black tracking-tight">
              {regimenConfig.regimenName}
            </h1>
            <p className="text-lg font-bold text-slate-800">
              Chemotherapy Schedule &bull; Cycle {currentSelectedCycle} of {regimenConfig.totalCycles}
            </p>
            <p className="text-sm font-bold text-slate-600">
              Cycle Start: {cycleStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} &ndash; End: {cycleEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Editable Patient/Clinic Phone block for physical sheet */}
          <div className="border-2 border-black p-3 rounded-xl text-xs font-bold space-y-1 bg-slate-50 min-w-[240px]">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4 text-black" />
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full bg-transparent font-bold border-b border-slate-400 focus:outline-none"
                placeholder="Patient Name"
              />
            </div>
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4 text-black" />
              <input
                type="text"
                value={clinicPhone}
                onChange={(e) => setClinicPhone(e.target.value)}
                className="w-full bg-transparent font-bold border-b border-slate-400 focus:outline-none"
                placeholder="Clinic Phone Number"
              />
            </div>
          </div>
        </div>

        {/* 28-Day Grid for Printing */}
        <div className="grid grid-cols-7 gap-2 border-2 border-black p-2 rounded-2xl bg-white print-grid">
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
                className="border-2 border-slate-400 rounded-xl p-2 min-h-[110px] flex flex-col justify-between print-cell"
              >
                <div className="flex justify-between items-start border-b border-slate-300 pb-1">
                  <span className="font-black text-base text-black">Day {dayNum}</span>
                  <span className="text-xs font-bold text-slate-700">
                    {dayDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
                  </span>
                </div>

                <div className="my-1 space-y-1">
                  {rest ? (
                    <span className="text-xs font-bold text-slate-500 italic block text-center">Rest</span>
                  ) : (
                    meds.map(m => (
                      <div key={m.id} className="text-[11px] font-black leading-tight border border-black px-1 py-0.5 rounded bg-slate-100">
                        {m.patientFriendlyName}
                      </div>
                    ))
                  )}
                </div>

                <div className="text-[10px] font-bold text-right text-slate-500">
                  {clinic ? 'Nurse Shot' : rest ? '' : 'Oral Pill'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Instructions footer for physical wall chart */}
        <div className="border-t-2 border-black pt-3 text-xs font-bold text-slate-800 flex justify-between items-center">
          <div>
            <strong>Hydration Reminder:</strong> Drink 8 to 12 cups of water daily, especially on Cyclophosphamide days!
          </div>
          <div>
            Chemo Calendar &bull; NCCN Regimen MUM46
          </div>
        </div>

      </div>

    </div>
  );
};
