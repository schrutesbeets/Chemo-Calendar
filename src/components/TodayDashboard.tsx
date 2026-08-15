import React, { useState } from 'react';
import { useRegimen } from '../context/RegimenContext';
import { 
  getCycleAndDayForDate, 
  formatDateKey, 
  formatFriendlyDate, 
  getMedicationsForCycleDay, 
  isClinicVisitDay, 
  isRestDay,
  getBadgeColorClasses
} from '../utils/cycleUtils';
import { 
  CheckCircle2, 
  Circle, 
  Droplets, 
  Syringe, 
  Pill, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight,
  Info,
  Clock,
  Sparkles
} from 'lucide-react';

export const TodayDashboard: React.FC = () => {
  const { 
    regimenConfig, 
    doseLogs, 
    hydrationLogs, 
    toggleDose, 
    setHydrationCount, 
    incrementHydration, 
    highContrast
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
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      
      {/* Date & Cycle Header Bar - Material Design 3 Surface Container */}
      <div className="bg-white border-4 border-slate-300 rounded-2xl p-4 sm:p-6 shadow-md transition-all md-surface-container">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-slate-200 pb-4">
          
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-black tracking-wider px-3 py-1 rounded-full md-tertiary-container border border-amber-400">
                {isToday ? "Today's Schedule" : "Selected Date"}
              </span>
              {!isToday && (
                <button
                  onClick={handleResetToToday}
                  className="text-xs font-bold text-sky-700 underline hover:text-sky-900"
                >
                  Return to Today
                </button>
              )}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-1">
              {formatFriendlyDate(selectedDate)}
            </h2>
          </div>

          {/* Date Picker & Nav Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevDay}
              className="px-3 py-3 bg-slate-100 hover:bg-slate-200 border-2 border-slate-400 rounded-xl text-slate-800 font-extrabold flex items-center gap-1 senior-touch-target"
              aria-label="Previous Day"
            >
              <ChevronLeft className="w-6 h-6" />
              <span className="hidden sm:inline">Prev Day</span>
            </button>

            <button
              onClick={handleResetToToday}
              className={`px-4 py-3 border-2 rounded-xl text-base font-extrabold senior-touch-target ${
                isToday
                  ? 'md-primary-container border-sky-500 font-black'
                  : 'bg-white text-slate-800 border-slate-400 hover:bg-slate-100'
              }`}
            >
              Today
            </button>

            <button
              onClick={handleNextDay}
              className="px-3 py-3 bg-slate-100 hover:bg-slate-200 border-2 border-slate-400 rounded-xl text-slate-800 font-extrabold flex items-center gap-1 senior-touch-target"
              aria-label="Next Day"
            >
              <span className="hidden sm:inline">Next Day</span>
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

        </div>

        {/* Cycle Progress Tracker - Material Primary Container */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg border-2 md-primary-container border-sky-400">
              C{cycleNumber}
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-slate-500">Regimen Progress</div>
              <div className="text-xl font-black text-slate-900">
                Cycle {cycleNumber} of {regimenConfig.totalCycles} &bull; <span className="text-sky-700">Day {cycleDay}</span> of {regimenConfig.cycleDurationDays}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Day Status Banner */}
      {rest ? (
        <div className="border-4 rounded-2xl p-6 flex items-start gap-4 shadow-sm md-success-container border-emerald-400">
          <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shrink-0">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-black">
              Rest Day — No Chemotherapy Meds Due Today
            </h3>
            <p className="text-base font-bold mt-1">
              Give your body time to rest and rebuild. Stay well hydrated, take gentle walks if comfortable, and follow your general care guidelines.
            </p>
          </div>
        </div>
      ) : clinicDay ? (
        <div className="border-4 rounded-2xl p-6 flex items-start gap-4 shadow-sm md-primary-container border-sky-400">
          <div className="w-14 h-14 bg-sky-600 text-white rounded-2xl flex items-center justify-center shrink-0">
            <Syringe className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="inline-block px-3 py-1 rounded-md text-xs font-black uppercase mb-1 md-primary-container border border-sky-500">
              Clinic Appointment Scheduled
            </div>
            <h3 className="text-2xl font-black">
              Clinic Visit Day (Bortezomib Injection)
            </h3>
            <p className="text-base font-bold mt-1">
              You have a scheduled injection at the oncology clinic today. Allow rest time after your shot.
            </p>
          </div>
        </div>
      ) : (
        <div className="border-4 rounded-2xl p-6 flex items-start gap-4 shadow-sm md-secondary-container border-purple-400">
          <div className="w-14 h-14 bg-purple-700 text-white rounded-2xl flex items-center justify-center shrink-0">
            <Pill className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-black">
              Home Medication Day
            </h3>
            <p className="text-base font-bold mt-1">
              Take your oral medications by mouth as directed below with food and water.
            </p>
          </div>
        </div>
      )}

      {/* Medications Due Today Checklist Section */}
      {!rest && (
        <div className="bg-white border-4 border-slate-300 rounded-2xl p-6 shadow-md space-y-4 md-surface-container">
          <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Pill className="w-7 h-7 text-sky-700" />
              <span>Today's Medications ({medsToday.length})</span>
            </h3>
            {allMedsTaken && (
              <span className="md-success-container border border-emerald-500 px-3 py-1 rounded-full text-sm font-extrabold flex items-center gap-1">
                <CheckCircle2 className="w-5 h-5" />
                All Doses Completed!
              </span>
            )}
          </div>

          <div className="space-y-4">
            {medsToday.map(med => {
              const doseRecord = currentDoseLogs[med.id] || { taken: false };
              const taken = doseRecord.taken;
              const colorStyle = getBadgeColorClasses(med.badgeColor, highContrast);

              return (
                <div
                  key={med.id}
                  className={`border-4 rounded-2xl p-5 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    taken 
                      ? 'md-success-container border-emerald-500 shadow-inner' 
                      : `${colorStyle.bg} ${colorStyle.border} shadow-sm`
                  }`}
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-3 py-1 rounded-lg text-xs uppercase tracking-wider font-extrabold ${colorStyle.badge}`}>
                        {med.route}
                      </span>
                      {taken && (
                        <span className="md-success-container border border-emerald-600 px-3 py-1 rounded-lg text-xs font-black uppercase flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Taken
                        </span>
                      )}
                    </div>

                    <h4 className="text-2xl sm:text-3xl font-black">
                      {med.patientFriendlyName}
                    </h4>
                    
                    <div className="text-sm font-bold">
                      <span>Clinical Name:</span> {med.clinicalName}
                    </div>

                    {/* Instruction Box with Material Primary Container Pair */}
                    <div className="border-2 rounded-xl p-3 text-base font-bold flex items-start gap-2 md-primary-container border-sky-400">
                      <Info className="w-5 h-5 shrink-0 mt-0.5" />
                      <span>{med.instructions}</span>
                    </div>

                    {taken && doseRecord.timestamp && (
                      <div className="text-xs font-extrabold flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Confirmed on {new Date(doseRecord.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    )}
                  </div>

                  {/* Big Tactile Checkbox Button for Seniors */}
                  <button
                    onClick={() => toggleDose(dateKey, med.id)}
                    className={`w-full sm:w-auto px-6 py-4 rounded-2xl font-black text-lg sm:text-xl border-4 transition-all flex items-center justify-center gap-3 senior-touch-target shadow-md ${
                      taken
                        ? 'md-success-container border-emerald-600'
                        : 'bg-white hover:bg-slate-100 text-slate-900 border-slate-700'
                    }`}
                    aria-label={`Mark ${med.patientFriendlyName} as ${taken ? 'Not Taken' : 'Taken'}`}
                  >
                    {taken ? (
                      <>
                        <CheckCircle2 className="w-8 h-8" />
                        <span>TAKEN</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-8 h-8 text-slate-400" />
                        <span>MARK AS TAKEN</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Hydration Tracker Card */}
      <div className={`border-4 rounded-2xl p-6 shadow-md transition-all ${
        isCycloDay ? 'md-primary-container border-sky-500' : 'md-surface-container border-slate-300'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Droplets className="w-8 h-8 text-sky-600" />
              <h3 className="text-2xl font-black">
                Daily Hydration Tracker
              </h3>
            </div>
            <p className="text-base font-bold mt-1">
              Target: 8 to 12 cups (2 to 3 Liters) of fluids daily.
            </p>
          </div>

          <div className="md-primary-container border-2 border-sky-400 rounded-xl px-5 py-2 text-center">
            <span className="text-xs uppercase font-extrabold">Total Drank Today</span>
            <div className="text-3xl font-black">
              {currentHydration} / 12 <span className="text-lg">cups</span>
            </div>
          </div>
        </div>

        {/* Cyclophosphamide Special Hydration Callout */}
        {isCycloDay && (
          <div className="mt-4 md-tertiary-container border-3 border-amber-500 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-7 h-7 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-extrabold text-lg">Cyclophosphamide Hydration Alert!</h4>
              <p className="font-bold text-sm">
                {regimenConfig.specialInstructions[0] || 'Drink extra fluids today to protect your bladder function.'}
              </p>
            </div>
          </div>
        )}

        {/* Interactive Water Cup Grid */}
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
            {Array.from({ length: 12 }).map((_, idx) => {
              const isFilled = idx < currentHydration;
              return (
                <button
                  key={idx}
                  onClick={() => setHydrationCount(dateKey, idx + 1 === currentHydration ? idx : idx + 1)}
                  className={`h-14 rounded-xl border-2 font-black flex items-center justify-center transition-all ${
                    isFilled
                      ? 'md-primary-container border-sky-600 shadow-sm'
                      : 'bg-slate-100 text-slate-400 border-slate-300 hover:bg-slate-200'
                  }`}
                  title={`Cup ${idx + 1}`}
                  aria-label={`Water cup ${idx + 1} ${isFilled ? 'filled' : 'empty'}`}
                >
                  <Droplets className={`w-6 h-6 ${isFilled ? 'fill-current' : ''}`} />
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => incrementHydration(dateKey)}
              className="px-6 py-3 md-primary-container border-2 border-sky-600 font-extrabold rounded-xl flex items-center gap-2 senior-touch-target shadow-md"
            >
              <Droplets className="w-6 h-6" />
              <span>+ Add 1 Cup of Water</span>
            </button>

            {currentHydration > 0 && (
              <button
                onClick={() => setHydrationCount(dateKey, 0)}
                className="text-sm font-bold underline hover:text-slate-900"
              >
                Reset Hydration Count
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Special Regimen Instructions Card - Material Surface Container */}
      {regimenConfig.specialInstructions.length > 0 && (
        <div className="border-3 rounded-2xl p-5 shadow-sm space-y-2 md-surface-container border-slate-400">
          <h4 className="text-lg font-black flex items-center gap-2">
            <Info className="w-6 h-6 text-sky-700" />
            <span>Special Regimen Instructions</span>
          </h4>
          <ul className="list-disc list-inside space-y-1 text-base font-bold">
            {regimenConfig.specialInstructions.map((instruction, idx) => (
              <li key={idx}>
                {instruction}
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
};
