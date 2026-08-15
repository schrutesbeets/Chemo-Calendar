import React from 'react';
import { useRegimen } from '../context/RegimenContext';
import { 
  getDateForCycleAndDay, 
  formatDateKey, 
  formatFriendlyDate, 
  getMedicationsForCycleDay, 
  isClinicVisitDay, 
  isRestDay,
  getBadgeColorClasses
} from '../utils/cycleUtils';
import { X, CheckCircle2, Circle, Syringe, Pill, Droplets, Sparkles } from 'lucide-react';

interface DayDetailModalProps {
  dayNumber: number;
  cycleNumber: number;
  onClose: () => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({ dayNumber, cycleNumber, onClose }) => {
  const { regimenConfig, doseLogs, hydrationLogs, toggleDose, setHydrationCount, highContrast } = useRegimen();

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
      className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="day-modal-title"
    >
      <div className="bg-white border-4 border-slate-400 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-150 my-8">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b-2 border-slate-200 pb-4">
          <div>
            <span className="text-xs uppercase font-extrabold bg-sky-700 text-white px-3 py-1 rounded-full">
              Cycle {cycleNumber} &bull; Day {dayNumber}
            </span>
            <h3 id="day-modal-title" className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {formatFriendlyDate(targetDate)}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full border-2 border-slate-400 transition-all senior-touch-target"
            aria-label="Close modal"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* Day Status Summary */}
        {isRest ? (
          <div className="bg-emerald-50 border-3 border-emerald-400 rounded-2xl p-4 flex items-center gap-3 text-emerald-950">
            <Sparkles className="w-7 h-7 text-emerald-600 shrink-0" />
            <div>
              <h4 className="font-extrabold text-lg">Rest Day</h4>
              <p className="font-bold text-sm">No chemotherapy medications are scheduled for today.</p>
            </div>
          </div>
        ) : isClinic ? (
          <div className="bg-sky-50 border-3 border-sky-400 rounded-2xl p-4 flex items-center gap-3 text-sky-950">
            <Syringe className="w-7 h-7 text-sky-700 shrink-0" />
            <div>
              <h4 className="font-extrabold text-lg">Clinic Visit Day</h4>
              <p className="font-bold text-sm">Bortezomib subcutaneous injection administered by clinic nurse.</p>
            </div>
          </div>
        ) : (
          <div className="bg-purple-50 border-3 border-purple-400 rounded-2xl p-4 flex items-center gap-3 text-purple-950">
            <Pill className="w-7 h-7 text-purple-700 shrink-0" />
            <div>
              <h4 className="font-extrabold text-lg">Home Oral Medication Day</h4>
              <p className="font-bold text-sm">Take oral pills by mouth with food and plenty of water.</p>
            </div>
          </div>
        )}

        {/* Medication Doses List */}
        {!isRest && (
          <div className="space-y-4">
            <h4 className="text-xl font-black text-slate-900">Scheduled Medications ({meds.length})</h4>
            <div className="space-y-3">
              {meds.map(med => {
                const doseRecord = currentDoseLogs[med.id] || { taken: false };
                const taken = doseRecord.taken;
                const colors = getBadgeColorClasses(med.badgeColor, highContrast);

                return (
                  <div 
                    key={med.id}
                    className={`border-3 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      taken ? 'bg-emerald-50 border-emerald-500' : `${colors.bg} ${colors.border}`
                    }`}
                  >
                    <div className="space-y-1">
                      <span className={`px-2.5 py-0.5 rounded text-xs font-black uppercase ${colors.badge}`}>
                        {med.route}
                      </span>
                      <h5 className="text-xl font-black text-slate-900">{med.patientFriendlyName}</h5>
                      <p className="text-xs font-bold text-slate-600">{med.instructions}</p>
                    </div>

                    <button
                      onClick={() => toggleDose(dateKey, med.id)}
                      className={`px-5 py-3 rounded-xl font-extrabold text-base border-3 flex items-center gap-2 transition-all senior-touch-target ${
                        taken
                          ? 'bg-emerald-600 text-white border-emerald-800 hover:bg-emerald-700'
                          : 'bg-white text-slate-900 border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {taken ? (
                        <>
                          <CheckCircle2 className="w-6 h-6" />
                          <span>TAKEN</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-6 h-6 text-slate-400" />
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
        <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-sky-600" />
              <span>Hydration Status</span>
            </h4>
            <span className="font-black text-sky-800 bg-sky-100 px-3 py-1 rounded-full text-sm">
              {currentHydration} / 12 cups
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHydrationCount(dateKey, Math.max(0, currentHydration - 1))}
              className="px-4 py-2 bg-white hover:bg-slate-200 border-2 border-slate-400 rounded-xl text-lg font-bold senior-touch-target"
            >
              -
            </button>
            <div className="flex-1 bg-slate-200 h-4 rounded-full overflow-hidden">
              <div 
                className="bg-sky-500 h-full transition-all duration-300"
                style={{ width: `${(Math.min(12, currentHydration) / 12) * 100}%` }}
              />
            </div>
            <button
              onClick={() => setHydrationCount(dateKey, Math.min(12, currentHydration + 1))}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white border-2 border-sky-800 rounded-xl text-lg font-bold senior-touch-target"
            >
              +
            </button>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3 bg-slate-800 hover:bg-slate-900 text-white font-extrabold rounded-2xl text-lg senior-touch-target"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
