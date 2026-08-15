import React, { useState, useEffect } from 'react';
import { useRegimen } from '../context/RegimenContext';
import type { RegimenConfig, Medication } from '../types/regimen';
import { 
  X, 
  ShieldAlert, 
  Code, 
  Sliders, 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  FileJson
} from 'lucide-react';

export const AdminModal: React.FC = () => {
  const { 
    regimenConfig, 
    updateRegimenConfig, 
    resetToDefaultRegimen, 
    exportRegimenJSON, 
    importRegimenJSON, 
    isAdminOpen, 
    setIsAdminOpen 
  } = useRegimen();

  const [activeAdminTab, setActiveAdminTab] = useState<'form' | 'json'>('form');
  
  // Local state for Visual Form Editor
  const [formConfig, setFormConfig] = useState<RegimenConfig>(regimenConfig);

  // Local state for Raw JSON Editor
  const [jsonText, setJsonText] = useState<string>('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sync state whenever modal opens or regimenConfig changes
  useEffect(() => {
    if (isAdminOpen) {
      setFormConfig(JSON.parse(JSON.stringify(regimenConfig)));
      setJsonText(JSON.stringify(regimenConfig, null, 2));
      setJsonError(null);
      setStatusMessage(null);
    }
  }, [isAdminOpen, regimenConfig]);

  if (!isAdminOpen) return null;

  // Handle JSON Text Area change with live syntax check
  const handleJsonChange = (text: string) => {
    setJsonText(text);
    try {
      JSON.parse(text);
      setJsonError(null);
    } catch (e: any) {
      setJsonError(e.message);
    }
  };

  // Prettify JSON string
  const handlePrettifyJSON = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
      setJsonError(null);
    } catch (e: any) {
      setJsonError(e.message);
    }
  };

  // Save changes from Form Editor
  const handleSaveForm = () => {
    const success = updateRegimenConfig(formConfig);
    if (success) {
      setStatusMessage({ type: 'success', text: 'Regimen configuration updated successfully!' });
      setTimeout(() => setStatusMessage(null), 3000);
    } else {
      setStatusMessage({ type: 'error', text: 'Failed to save configuration.' });
    }
  };

  // Save changes from Raw JSON Editor
  const handleSaveJSON = () => {
    const res = importRegimenJSON(jsonText);
    if (res.success) {
      setStatusMessage({ type: 'success', text: 'JSON schema applied and saved successfully!' });
      setTimeout(() => setStatusMessage(null), 3000);
    } else {
      setStatusMessage({ type: 'error', text: res.message });
    }
  };

  // Handle File Upload for JSON import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const res = importRegimenJSON(content);
        if (res.success) {
          setStatusMessage({ type: 'success', text: 'Regimen JSON file imported successfully!' });
        } else {
          setStatusMessage({ type: 'error', text: res.message });
        }
      }
    };
    reader.readAsText(file);
  };

  // Form Field Updaters
  const updateFormField = <K extends keyof RegimenConfig>(field: K, value: RegimenConfig[K]) => {
    setFormConfig(prev => ({ ...prev, [field]: value }));
  };

  // Medication form updater
  const updateMedication = (index: number, updatedMed: Medication) => {
    setFormConfig(prev => {
      const newMeds = [...prev.medications];
      newMeds[index] = updatedMed;
      return { ...prev, medications: newMeds };
    });
  };

  const addMedication = () => {
    const newMed: Medication = {
      id: `med_${Date.now()}`,
      clinicalName: 'New Clinical Medication 100 mg',
      patientFriendlyName: 'New Pill',
      route: 'Take by mouth',
      days: [1, 8, 15],
      instructions: 'Take as directed by oncologist.',
      badgeColor: 'primary'
    };
    setFormConfig(prev => ({ ...prev, medications: [...prev.medications, newMed] }));
  };

  const deleteMedication = (index: number) => {
    setFormConfig(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const addInstruction = () => {
    setFormConfig(prev => ({
      ...prev,
      specialInstructions: [...prev.specialInstructions, 'Drink plenty of fluids throughout the day.']
    }));
  };

  const updateInstruction = (index: number, text: string) => {
    setFormConfig(prev => {
      const newInstructions = [...prev.specialInstructions];
      newInstructions[index] = text;
      return { ...prev, specialInstructions: newInstructions };
    });
  };

  const removeInstruction = (index: number) => {
    setFormConfig(prev => ({
      ...prev,
      specialInstructions: prev.specialInstructions.filter((_, i) => i !== index)
    }));
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-portal-title"
    >
      <div className="bg-white border-4 border-slate-400 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b-2 border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-600 text-white rounded-2xl flex items-center justify-center shrink-0">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h2 id="admin-portal-title" className="text-2xl sm:text-3xl font-black text-slate-900">
                Caregiver Admin Portal
              </h2>
              <p className="text-sm font-bold text-slate-600">
                Configure NCCN Chemotherapy Regimen JSON Schema & Parameters
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsAdminOpen(false);
              if (window.location.hash === '#admin') {
                window.history.pushState('', document.title, window.location.pathname + window.location.search);
              }
            }}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full border-2 border-slate-400 senior-touch-target"
            aria-label="Close Admin Modal"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* Status Alert Banner */}
        {statusMessage && (
          <div className={`p-4 rounded-2xl font-bold flex items-center gap-3 ${
            statusMessage.type === 'success' ? 'bg-emerald-100 border-2 border-emerald-500 text-emerald-950' : 'bg-rose-100 border-2 border-rose-500 text-rose-950'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-6 h-6 text-emerald-700" /> : <AlertCircle className="w-6 h-6 text-rose-700" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Mode Switcher Tabs */}
        <div className="flex items-center justify-between bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-300">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveAdminTab('form')}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-sm sm:text-base flex items-center gap-2 transition-all senior-touch-target ${
                activeAdminTab === 'form'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Sliders className="w-5 h-5" />
              <span>Visual Form Editor</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('json')}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-sm sm:text-base flex items-center gap-2 transition-all senior-touch-target ${
                activeAdminTab === 'json'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Code className="w-5 h-5" />
              <span>Raw JSON Editor</span>
            </button>
          </div>

          {/* Quick Import/Export/Reset Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={exportRegimenJSON}
              className="px-3 py-2 bg-white border-2 border-slate-300 hover:bg-slate-50 text-slate-800 font-extrabold text-xs rounded-xl flex items-center gap-1"
              title="Export JSON file"
            >
              <Download className="w-4 h-4 text-sky-700" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <label className="px-3 py-2 bg-white border-2 border-slate-300 hover:bg-slate-50 text-slate-800 font-extrabold text-xs rounded-xl flex items-center gap-1 cursor-pointer">
              <Upload className="w-4 h-4 text-emerald-700" />
              <span className="hidden sm:inline">Import</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>

            <button
              onClick={() => {
                if (window.confirm('Reset regimen to default initial NCCN MUM46 state?')) {
                  resetToDefaultRegimen();
                  setStatusMessage({ type: 'success', text: 'Regimen reset to NCCN MUM46 default.' });
                }
              }}
              className="px-3 py-2 bg-white border-2 border-slate-300 hover:bg-slate-50 text-rose-700 font-extrabold text-xs rounded-xl flex items-center gap-1"
              title="Reset to default NCCN regimen"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Visual Form Editor */}
        {activeAdminTab === 'form' ? (
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            
            {/* Regimen Basic Settings */}
            <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-5 space-y-4">
              <h3 className="font-extrabold text-lg text-slate-900">General Regimen Settings</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-extrabold text-slate-600 mb-1">Regimen Name</label>
                  <input
                    type="text"
                    value={formConfig.regimenName}
                    onChange={(e) => updateFormField('regimenName', e.target.value)}
                    className="w-full p-3 border-2 border-slate-400 rounded-xl font-bold bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-extrabold text-slate-600 mb-1">Cycle Start Date (YYYY-MM-DD)</label>
                  <input
                    type="date"
                    value={formConfig.cycleStartDate}
                    onChange={(e) => updateFormField('cycleStartDate', e.target.value)}
                    className="w-full p-3 border-2 border-slate-400 rounded-xl font-bold bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-extrabold text-slate-600 mb-1">Cycle Duration (Days)</label>
                  <input
                    type="number"
                    value={formConfig.cycleDurationDays}
                    onChange={(e) => updateFormField('cycleDurationDays', Number(e.target.value))}
                    className="w-full p-3 border-2 border-slate-400 rounded-xl font-bold bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-extrabold text-slate-600 mb-1">Total Cycles</label>
                  <input
                    type="number"
                    value={formConfig.totalCycles}
                    onChange={(e) => updateFormField('totalCycles', Number(e.target.value))}
                    className="w-full p-3 border-2 border-slate-400 rounded-xl font-bold bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Special Instructions List Manager */}
            <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-lg text-slate-900">Special Instructions</h3>
                <button
                  onClick={addInstruction}
                  className="px-3 py-1.5 bg-sky-700 text-white rounded-xl font-bold text-xs flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Instruction
                </button>
              </div>

              {formConfig.specialInstructions.map((inst, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inst}
                    onChange={(e) => updateInstruction(idx, e.target.value)}
                    className="flex-1 p-2.5 border-2 border-slate-400 rounded-xl font-semibold bg-white"
                  />
                  <button
                    onClick={() => removeInstruction(idx)}
                    className="p-2.5 text-rose-700 bg-white border-2 border-slate-300 hover:bg-rose-50 rounded-xl"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Medications Manager */}
            <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-lg text-slate-900">Regimen Medications ({formConfig.medications.length})</h3>
                <button
                  onClick={addMedication}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-xl font-black text-sm flex items-center gap-1 shadow-sm"
                >
                  <Plus className="w-5 h-5" /> Add Medication
                </button>
              </div>

              <div className="space-y-6">
                {formConfig.medications.map((med, idx) => (
                  <div key={med.id || idx} className="bg-white border-3 border-slate-300 rounded-2xl p-5 space-y-4 shadow-sm relative">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="text-xs uppercase font-extrabold bg-slate-800 text-white px-2.5 py-0.5 rounded">
                        Medication #{idx + 1}
                      </span>
                      <button
                        onClick={() => deleteMedication(idx)}
                        className="text-rose-700 hover:text-rose-900 font-extrabold text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Delete Drug
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase font-extrabold text-slate-600 mb-1">Clinical Name</label>
                        <input
                          type="text"
                          value={med.clinicalName}
                          onChange={(e) => updateMedication(idx, { ...med, clinicalName: e.target.value })}
                          className="w-full p-2.5 border-2 border-slate-400 rounded-xl font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase font-extrabold text-slate-600 mb-1">Patient Friendly Name</label>
                        <input
                          type="text"
                          value={med.patientFriendlyName}
                          onChange={(e) => updateMedication(idx, { ...med, patientFriendlyName: e.target.value })}
                          className="w-full p-2.5 border-2 border-slate-400 rounded-xl font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase font-extrabold text-slate-600 mb-1">Administration Route</label>
                        <input
                          type="text"
                          value={med.route}
                          onChange={(e) => updateMedication(idx, { ...med, route: e.target.value })}
                          className="w-full p-2.5 border-2 border-slate-400 rounded-xl font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase font-extrabold text-slate-600 mb-1">Badge Color Theme</label>
                        <select
                          value={med.badgeColor}
                          onChange={(e) => updateMedication(idx, { ...med, badgeColor: e.target.value as any })}
                          className="w-full p-2.5 border-2 border-slate-400 rounded-xl font-bold bg-white"
                        >
                          <option value="primary">Primary (Blue - Shot/Injection)</option>
                          <option value="secondary">Secondary (Purple - Oral Pill)</option>
                          <option value="tertiary">Tertiary (Amber - Steroid)</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs uppercase font-extrabold text-slate-600 mb-1">
                          Cycle Days (Comma separated numbers, e.g. 1, 4, 8, 11)
                        </label>
                        <input
                          type="text"
                          value={med.days.join(', ')}
                          onChange={(e) => {
                            const parsedDays = e.target.value
                              .split(',')
                              .map(s => Number(s.trim()))
                              .filter(n => !isNaN(n) && n >= 1 && n <= 31);
                            updateMedication(idx, { ...med, days: parsedDays });
                          }}
                          className="w-full p-2.5 border-2 border-slate-400 rounded-xl font-bold"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs uppercase font-extrabold text-slate-600 mb-1">Patient Instructions</label>
                        <textarea
                          rows={2}
                          value={med.instructions}
                          onChange={(e) => updateMedication(idx, { ...med, instructions: e.target.value })}
                          className="w-full p-2.5 border-2 border-slate-400 rounded-xl font-bold"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Form Button */}
            <div className="pt-2">
              <button
                onClick={handleSaveForm}
                className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-slate-950 font-black text-xl rounded-2xl border-3 border-amber-800 shadow-md flex items-center justify-center gap-2 senior-touch-target"
              >
                <Save className="w-7 h-7" />
                <span>Save & Apply Visual Form Changes</span>
              </button>
            </div>

          </div>
        ) : (
          /* Tab 2: Raw JSON Editor */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-extrabold text-slate-700 flex items-center gap-1">
                <FileJson className="w-5 h-5 text-sky-700" /> Live Regimen JSON Schema
              </span>
              <button
                onClick={handlePrettifyJSON}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold rounded-lg text-xs"
              >
                Prettify JSON
              </button>
            </div>

            {jsonError && (
              <div className="bg-rose-100 border-2 border-rose-500 text-rose-900 p-3 rounded-xl text-xs font-mono font-bold">
                Syntax Error: {jsonError}
              </div>
            )}

            <textarea
              rows={16}
              value={jsonText}
              onChange={(e) => handleJsonChange(e.target.value)}
              className="w-full p-4 font-mono text-sm border-3 border-slate-400 rounded-2xl bg-slate-900 text-emerald-400 focus:outline-none focus:ring-4 focus:ring-amber-400"
              spellCheck={false}
            />

            <button
              onClick={handleSaveJSON}
              disabled={!!jsonError}
              className={`w-full py-4 font-black text-xl rounded-2xl border-3 shadow-md flex items-center justify-center gap-2 senior-touch-target ${
                jsonError 
                  ? 'bg-slate-300 text-slate-500 border-slate-400 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-700 text-slate-950 border-amber-800'
              }`}
            >
              <Save className="w-7 h-7" />
              <span>Apply & Save JSON Schema</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
