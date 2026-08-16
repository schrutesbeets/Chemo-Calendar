import React, { useState, useEffect } from 'react';
import { useRegimen } from '../context/RegimenContext';
import type { RegimenConfig, Medication } from '../types/regimen';

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
      aria-labelledby="admin-portal-title"
    >
      <div 
        style={{ 
          width: '100%', 
          maxWidth: '900px', 
          maxHeight: '90vh', 
          backgroundColor: 'var(--md-sys-color-surface)', 
          color: 'var(--md-sys-color-on-surface)',
          borderRadius: '28px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        
        {/* Sticky Header Bar */}
        <div className="flex-row items-center justify-between gap-4 flex-wrap" style={{ padding: '24px', borderBottom: '1px solid var(--md-sys-color-outline-variant)', backgroundColor: 'var(--md-sys-color-surface)' }}>
          <div className="flex-row items-center gap-4">
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--md-sys-color-error-container)', color: 'var(--md-sys-color-on-error-container)' }}>
              <md-icon style={{ fontSize: '28px' }}>admin_panel_settings</md-icon>
            </div>
            <div>
              <h2 id="admin-portal-title" className="text-headline" style={{ margin: 0, fontWeight: 900 }}>
                Caregiver Admin Portal
              </h2>
              <p className="text-body-medium" style={{ margin: 0, marginTop: '4px', fontWeight: 'bold', color: 'var(--md-sys-color-on-surface-variant)' }}>
                Configure NCCN Chemotherapy Regimen JSON Schema & Parameters
              </p>
            </div>
          </div>

          <md-icon-button
            onClick={() => {
              setIsAdminOpen(false);
              if (window.location.hash === '#admin') {
                window.history.pushState('', document.title, window.location.pathname + window.location.search);
              }
            }}
            aria-label="Close Admin Modal"
            style={{ backgroundColor: 'var(--md-sys-color-surface-container-highest)', borderRadius: '50%' }}
          >
            <md-icon>close</md-icon>
          </md-icon-button>
        </div>

        {/* Scrolling Content Area */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, backgroundColor: 'var(--md-sys-color-surface-container-low)' }}>

        {/* Status Alert Banner */}
        {statusMessage && (
          <div style={{
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontWeight: 'bold',
            backgroundColor: statusMessage.type === 'success' ? 'var(--md-sys-color-success-container)' : 'var(--md-sys-color-error-container)',
            color: statusMessage.type === 'success' ? 'var(--md-sys-color-on-success-container)' : 'var(--md-sys-color-on-error-container)',
            border: `1px solid ${statusMessage.type === 'success' ? 'var(--md-sys-color-success)' : 'var(--md-sys-color-error)'}`
          }}>
            <md-icon>{statusMessage.type === 'success' ? 'check_circle' : 'error'}</md-icon>
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Mode Switcher Tabs & Actions */}
        <div className="flex-row items-center justify-between gap-4 flex-wrap" style={{ backgroundColor: 'var(--md-sys-color-surface-container)', padding: '8px', borderRadius: '16px', marginBottom: '24px' }}>
          <div className="flex-row items-center gap-2">
            <md-filled-button onClick={() => setActiveAdminTab('form')} className={activeAdminTab !== 'form' ? 'inactive-tab-button' : undefined}>
              <md-icon slot="icon">tune</md-icon>
              Visual Form Editor
            </md-filled-button>

            <md-filled-button onClick={() => setActiveAdminTab('json')} className={activeAdminTab !== 'json' ? 'inactive-tab-button' : undefined}>
              <md-icon slot="icon">data_object</md-icon>
              Raw JSON Editor
            </md-filled-button>
          </div>

          <div className="flex-row items-center gap-2">
            <md-text-button onClick={exportRegimenJSON} title="Export JSON file">
              <md-icon slot="icon">download</md-icon>
              Export
            </md-text-button>

            <md-text-button onClick={() => document.getElementById('json-import-input')?.click()} title="Import JSON file">
              <md-icon slot="icon">upload</md-icon>
              Import
            </md-text-button>
            <input id="json-import-input" type="file" accept=".json" onChange={handleFileUpload} style={{ display: 'none' }} />

            <md-text-button
              onClick={() => {
                if (window.confirm('Reset regimen to default initial NCCN MUM46 state?')) {
                  resetToDefaultRegimen();
                  setStatusMessage({ type: 'success', text: 'Regimen reset to NCCN MUM46 default.' });
                }
              }}
              className="error-text-button"
              title="Reset to default NCCN regimen"
            >
              <md-icon slot="icon">refresh</md-icon>
              Reset
            </md-text-button>
          </div>
        </div>

        {/* Tab 1: Visual Form Editor */}
        {activeAdminTab === 'form' ? (
          <div className="flex-col gap-6">
            
            {/* Regimen Basic Settings */}
            <div style={{ padding: '24px', backgroundColor: 'var(--md-sys-color-surface)', border: '1px solid var(--md-sys-color-outline)', borderRadius: '16px' }}>
              <h3 className="text-title-large" style={{ margin: 0, marginBottom: '16px', fontWeight: 900 }}>General Regimen Settings</h3>
              
              <div className="grid grid-cols-1 sm-grid-cols-2 gap-4">
                <div className="flex-col gap-1">
                  <label className="text-body-small font-bold" style={{ textTransform: 'uppercase', color: 'var(--md-sys-color-on-surface-variant)' }}>Regimen Name</label>
                  <input
                    type="text"
                    value={formConfig.regimenName}
                    onChange={(e) => updateFormField('regimenName', e.target.value)}
                    style={{ padding: '12px', border: '1px solid var(--md-sys-color-outline)', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold' }}
                  />
                </div>

                <div className="flex-col gap-1">
                  <label className="text-body-small font-bold" style={{ textTransform: 'uppercase', color: 'var(--md-sys-color-on-surface-variant)' }}>Cycle Start Date (YYYY-MM-DD)</label>
                  <input
                    type="date"
                    value={formConfig.cycleStartDate}
                    onChange={(e) => updateFormField('cycleStartDate', e.target.value)}
                    style={{ padding: '12px', border: '1px solid var(--md-sys-color-outline)', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold' }}
                  />
                </div>

                <div className="flex-col gap-1">
                  <label className="text-body-small font-bold" style={{ textTransform: 'uppercase', color: 'var(--md-sys-color-on-surface-variant)' }}>Cycle Duration (Days)</label>
                  <input
                    type="number"
                    value={formConfig.cycleDurationDays}
                    onChange={(e) => updateFormField('cycleDurationDays', Number(e.target.value))}
                    style={{ padding: '12px', border: '1px solid var(--md-sys-color-outline)', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold' }}
                  />
                </div>

                <div className="flex-col gap-1">
                  <label className="text-body-small font-bold" style={{ textTransform: 'uppercase', color: 'var(--md-sys-color-on-surface-variant)' }}>Total Cycles</label>
                  <input
                    type="number"
                    value={formConfig.totalCycles}
                    onChange={(e) => updateFormField('totalCycles', Number(e.target.value))}
                    style={{ padding: '12px', border: '1px solid var(--md-sys-color-outline)', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold' }}
                  />
                </div>
              </div>
            </div>

            {/* Special Instructions List Manager */}
            <div style={{ padding: '24px', backgroundColor: 'var(--md-sys-color-surface)', border: '1px solid var(--md-sys-color-outline)', borderRadius: '16px' }}>
              <div className="flex-row items-center justify-between mb-4">
                <h3 className="text-title-large" style={{ margin: 0, fontWeight: 900 }}>Special Instructions</h3>
                <md-text-button onClick={addInstruction}>
                  <md-icon slot="icon">add</md-icon>
                  Add Instruction
                </md-text-button>
              </div>

              <div className="flex-col gap-3">
                {formConfig.specialInstructions.map((inst, idx) => (
                  <div key={idx} className="flex-row items-center gap-2">
                    <input
                      type="text"
                      value={inst}
                      onChange={(e) => updateInstruction(idx, e.target.value)}
                      style={{ flex: 1, padding: '12px', border: '1px solid var(--md-sys-color-outline)', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold' }}
                    />
                    <md-icon-button onClick={() => removeInstruction(idx)} style={{ '--md-icon-button-icon-color': 'var(--md-sys-color-error)' } as any}>
                      <md-icon>delete</md-icon>
                    </md-icon-button>
                  </div>
                ))}
              </div>
            </div>

            {/* Medications Manager */}
            <div style={{ padding: '24px', backgroundColor: 'var(--md-sys-color-surface-container-highest)', border: '1px solid var(--md-sys-color-outline)', borderRadius: '16px' }}>
              <div className="flex-row items-center justify-between mb-4">
                <h3 className="text-title-large" style={{ margin: 0, fontWeight: 900 }}>Regimen Medications ({formConfig.medications.length})</h3>
                <md-filled-tonal-button onClick={addMedication}>
                  <md-icon slot="icon">add</md-icon>
                  Add Medication
                </md-filled-tonal-button>
              </div>

              <div className="flex-col gap-6">
                {formConfig.medications.map((med, idx) => (
                  <div key={med.id || idx} style={{ backgroundColor: 'var(--md-sys-color-surface)', border: '1px solid var(--md-sys-color-outline)', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div className="flex-row items-center justify-between border-b pb-2 mb-4" style={{ borderBottom: '1px solid var(--md-sys-color-outline-variant)' }}>
                      <span style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', backgroundColor: 'var(--md-sys-color-primary)', color: 'var(--md-sys-color-on-primary)', padding: '2px 8px', borderRadius: '4px' }}>
                        Medication #{idx + 1}
                      </span>
                      <md-text-button onClick={() => deleteMedication(idx)} className="error-text-button">
                        <md-icon slot="icon">delete</md-icon>
                        Delete
                      </md-text-button>
                    </div>

                    <div className="grid grid-cols-1 sm-grid-cols-2 gap-4">
                      <div className="flex-col gap-1">
                        <label className="text-body-small font-bold" style={{ textTransform: 'uppercase', color: 'var(--md-sys-color-on-surface-variant)' }}>Clinical Name</label>
                        <input
                          type="text"
                          value={med.clinicalName}
                          onChange={(e) => updateMedication(idx, { ...med, clinicalName: e.target.value })}
                          style={{ padding: '12px', border: '1px solid var(--md-sys-color-outline)', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold' }}
                        />
                      </div>

                      <div className="flex-col gap-1">
                        <label className="text-body-small font-bold" style={{ textTransform: 'uppercase', color: 'var(--md-sys-color-on-surface-variant)' }}>Patient Friendly Name</label>
                        <input
                          type="text"
                          value={med.patientFriendlyName}
                          onChange={(e) => updateMedication(idx, { ...med, patientFriendlyName: e.target.value })}
                          style={{ padding: '12px', border: '1px solid var(--md-sys-color-outline)', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold' }}
                        />
                      </div>

                      <div className="flex-col gap-1">
                        <label className="text-body-small font-bold" style={{ textTransform: 'uppercase', color: 'var(--md-sys-color-on-surface-variant)' }}>Administration Route</label>
                        <input
                          type="text"
                          value={med.route}
                          onChange={(e) => updateMedication(idx, { ...med, route: e.target.value })}
                          style={{ padding: '12px', border: '1px solid var(--md-sys-color-outline)', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold' }}
                        />
                      </div>

                      <div className="flex-col gap-1">
                        <label className="text-body-small font-bold" style={{ textTransform: 'uppercase', color: 'var(--md-sys-color-on-surface-variant)' }}>Badge Color Theme</label>
                        <select
                          value={med.badgeColor}
                          onChange={(e) => updateMedication(idx, { ...med, badgeColor: e.target.value as any })}
                          style={{ padding: '12px', border: '1px solid var(--md-sys-color-outline)', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', backgroundColor: 'var(--md-sys-color-surface)' }}
                        >
                          <option value="primary">Primary (Blue - Shot/Injection)</option>
                          <option value="secondary">Secondary (Purple - Oral Pill)</option>
                          <option value="tertiary">Tertiary (Amber - Steroid)</option>
                        </select>
                      </div>

                      <div className="flex-col gap-1 sm-col-span-2" style={{ gridColumn: '1 / -1' }}>
                        <label className="text-body-small font-bold" style={{ textTransform: 'uppercase', color: 'var(--md-sys-color-on-surface-variant)' }}>
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
                          style={{ padding: '12px', border: '1px solid var(--md-sys-color-outline)', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold' }}
                        />
                      </div>

                      <div className="flex-col gap-1 sm-col-span-2" style={{ gridColumn: '1 / -1' }}>
                        <label className="text-body-small font-bold" style={{ textTransform: 'uppercase', color: 'var(--md-sys-color-on-surface-variant)' }}>Patient Instructions</label>
                        <textarea
                          rows={2}
                          value={med.instructions}
                          onChange={(e) => updateMedication(idx, { ...med, instructions: e.target.value })}
                          style={{ padding: '12px', border: '1px solid var(--md-sys-color-outline)', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', fontFamily: 'inherit' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Form Button */}
            <div className="mt-4">
              <md-filled-button onClick={handleSaveForm} style={{ width: '100%', height: '56px', fontSize: '18px', '--md-filled-button-container-color': 'var(--md-sys-color-primary)' } as any}>
                <md-icon slot="icon">save</md-icon>
                Save & Apply Visual Form Changes
              </md-filled-button>
            </div>

          </div>
        ) : (
          /* Tab 2: Raw JSON Editor */
          <div className="flex-col gap-4">
            <div className="flex-row items-center justify-between">
              <span className="text-body-medium font-bold flex-row items-center gap-2" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                <md-icon style={{ color: 'var(--md-sys-color-primary)', fontSize: '20px' }}>data_object</md-icon> 
                Live Regimen JSON Schema
              </span>
              <md-outlined-button onClick={handlePrettifyJSON}>
                Prettify JSON
              </md-outlined-button>
            </div>

            {jsonError && (
              <div style={{ backgroundColor: 'var(--md-sys-color-error-container)', color: 'var(--md-sys-color-on-error-container)', border: '1px solid var(--md-sys-color-error)', padding: '12px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px', fontWeight: 'bold' }}>
                Syntax Error: {jsonError}
              </div>
            )}

            <textarea
              rows={16}
              value={jsonText}
              onChange={(e) => handleJsonChange(e.target.value)}
              style={{
                width: '100%',
                padding: '16px',
                fontFamily: 'monospace',
                fontSize: '14px',
                border: '2px solid var(--md-sys-color-outline)',
                borderRadius: '16px',
                backgroundColor: '#1e1e1e', // Dark theme for code editor
                color: '#4af626',
                outline: 'none',
                resize: 'vertical'
              }}
              spellCheck={false}
            />

            <md-filled-button 
              onClick={handleSaveJSON} 
              disabled={!!jsonError}
              style={{ width: '100%', height: '56px', fontSize: '18px' }}
            >
              <md-icon slot="icon">save</md-icon>
              Apply & Save JSON Schema
            </md-filled-button>
          </div>
        )}

        </div>
      </div>
    </div>
  );
};
