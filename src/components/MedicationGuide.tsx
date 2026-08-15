import React from 'react';
import { useRegimen } from '../context/RegimenContext';
import { getBadgeColorClasses } from '../utils/cycleUtils';
import { BookOpen, Syringe, Pill, Volume2, Info, AlertTriangle, ShieldCheck } from 'lucide-react';

export const MedicationGuide: React.FC = () => {
  const { regimenConfig, speakText, highContrast } = useRegimen();

  const handleReadDrugInfo = (medName: string, text: string) => {
    speakText(`Medication details for ${medName}. ${text}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border-4 border-slate-300 rounded-2xl p-6 shadow-md flex items-center gap-4">
        <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shrink-0">
          <BookOpen className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Medication Reference Guide
          </h2>
          <p className="text-base font-bold text-slate-600 mt-1">
            Understanding your chemotherapy drugs, administration routes, and safety tips.
          </p>
        </div>
      </div>

      {/* Drug Cards */}
      <div className="space-y-6">
        {regimenConfig.medications.map(med => {
          const colors = getBadgeColorClasses(med.badgeColor, highContrast);
          const isInjection = med.route.toLowerCase().includes('injection') || med.route.toLowerCase().includes('shot');

          const readText = `Clinical name: ${med.clinicalName}. Route: ${med.route}. Days of cycle: ${med.days.join(', ')}. Instructions: ${med.instructions}.`;

          return (
            <div
              key={med.id}
              className={`bg-white border-4 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 ${colors.border}`}
            >
              {/* Top Title & Route */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors.badge}`}>
                    {isInjection ? <Syringe className="w-7 h-7" /> : <Pill className="w-7 h-7" />}
                  </div>
                  <div>
                    <span className={`px-3 py-0.5 rounded-md text-xs font-black uppercase ${colors.badge}`}>
                      {med.route}
                    </span>
                    <h3 className="text-2xl sm:text-4xl font-black text-slate-900 mt-1">
                      {med.patientFriendlyName}
                    </h3>
                    <p className="text-sm font-bold text-slate-600">
                      Clinical Name: {med.clinicalName}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleReadDrugInfo(med.patientFriendlyName, readText)}
                  className="px-4 py-3 bg-sky-600 hover:bg-sky-700 text-white font-extrabold rounded-xl border-2 border-sky-800 flex items-center gap-2 senior-touch-target self-start sm:self-center shadow-sm"
                  aria-label={`Listen to ${med.patientFriendlyName} info aloud`}
                >
                  <Volume2 className="w-5 h-5" />
                  <span>Read Info Aloud</span>
                </button>
              </div>

              {/* Schedule Days & Administration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Active Cycle Days */}
                <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-5 space-y-3">
                  <h4 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-sky-700" />
                    <span>Scheduled Cycle Days ({med.days.length} doses/cycle)</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {med.days.map(d => (
                      <span
                        key={d}
                        className="w-10 h-10 rounded-xl bg-slate-800 text-white font-black flex items-center justify-center text-sm shadow-sm"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs font-bold text-slate-500 pt-1">
                    Days correspond to each 28-day chemotherapy cycle.
                  </p>
                </div>

                {/* Instructions */}
                <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-5 space-y-3">
                  <h4 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                    <Info className="w-6 h-6 text-sky-700" />
                    <span>Administration Instructions</span>
                  </h4>
                  <p className="text-base font-bold text-slate-800">
                    {med.instructions}
                  </p>
                </div>

              </div>

              {/* Side Effects & Precautions */}
              {med.sideEffects && med.sideEffects.length > 0 && (
                <div className="bg-amber-50 border-3 border-amber-300 rounded-2xl p-5 space-y-3">
                  <h4 className="font-extrabold text-amber-950 text-lg flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6 text-amber-700" />
                    <span>Side Effect Precautions & Tips</span>
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {med.sideEffects.map((effect, idx) => (
                      <li
                        key={idx}
                        className="bg-white border-2 border-amber-300 rounded-xl p-3 text-sm font-bold text-slate-800 shadow-sm"
                      >
                        &bull; {effect}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
