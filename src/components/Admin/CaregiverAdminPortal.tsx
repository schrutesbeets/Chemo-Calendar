import React, { useState, useEffect } from 'react';
import {
  Tabs,
  TabList,
  Tab,
  TabPanel
} from 'react-aria-components';
import {
  Save,
  Download,
  Upload,
  RotateCcw,
  Plus,
  Trash2,
  Copy,
  Check,
  AlertCircle,
  FileCode,
  Calendar,
  Pill,
  ClipboardList
} from 'lucide-react';
import clsx from 'clsx';
import { useRegimen } from '../../context/RegimenContext';
import { useSettings } from '../../context/SettingsContext';
import {
  Button,
  Card,
  Heading,
  Text,
  Caption,
  Stack,
  Grid,
  Callout,
  TextField,
  DialogModal
} from '../common';
import {
  getDateForCycleAndDay,
  formatShortDate,
  formatLongDate,
  parseISODate
} from '../../utils/dateUtils';
import type { RegimenConfig, Medication } from '../../types/regimen';

export const CaregiverAdminPortal: React.FC = () => {
  const {
    regimen,
    adherence,
    updateRegimen,
    resetToDefaultRegimen,
    clearAdherenceHistory,
    exportJSON,
    importJSON
  } = useRegimen();

  const { isAdminOpen, setIsAdminOpen } = useSettings();

  // Local draft state for editing form
  const [draftConfig, setDraftConfig] = useState<RegimenConfig>(regimen);
  const [jsonText, setJsonText] = useState(exportJSON());
  const [jsonErrors, setJsonErrors] = useState<string[]>([]);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [saveSuccessNotification, setSaveSuccessNotification] = useState(false);
  const [selectedMedIndex, setSelectedMedIndex] = useState<number>(0);

  // Sync draft whenever regimen updates
  useEffect(() => {
    setDraftConfig(regimen);
    setJsonText(JSON.stringify(regimen, null, 2));
  }, [regimen, isAdminOpen]);

  // Handle general fields change
  const handleConfigFieldChange = <K extends keyof RegimenConfig>(
    field: K,
    value: RegimenConfig[K]
  ) => {
    setDraftConfig((prev) => {
      const updated = { ...prev, [field]: value };
      setJsonText(JSON.stringify(updated, null, 2));
      return updated;
    });
  };

  // Handle medication update
  const handleMedChange = (index: number, updatedMed: Medication) => {
    setDraftConfig((prev) => {
      const nextMeds = [...prev.medications];
      nextMeds[index] = updatedMed;
      const updated = { ...prev, medications: nextMeds };
      setJsonText(JSON.stringify(updated, null, 2));
      return updated;
    });
  };

  // Toggle day in medication schedule
  const handleToggleMedDay = (medIndex: number, dayNumber: number) => {
    const med = draftConfig.medications[medIndex];
    if (!med) return;

    const currentDays = med.days || [];
    const exists = currentDays.includes(dayNumber);
    const newDays = exists
      ? currentDays.filter((d) => d !== dayNumber).sort((a, b) => a - b)
      : [...currentDays, dayNumber].sort((a, b) => a - b);

    handleMedChange(medIndex, { ...med, days: newDays });
  };

  // Add new medication
  const handleAddMedication = () => {
    const newMed: Medication = {
      id: `med_${Date.now()}`,
      patientFriendlyName: 'New Medication',
      route: 'Take by mouth',
      days: [1],
      instructions: 'Take daily as directed.',
      badgeColor: 'primary',
      guide: {
        purpose: 'Treat condition.',
        howToTake: 'Take with water.',
        keyPrecautions: 'Report any side effects.'
      }
    };
    setDraftConfig((prev) => {
      const updated = { ...prev, medications: [...prev.medications, newMed] };
      setJsonText(JSON.stringify(updated, null, 2));
      return updated;
    });
    setSelectedMedIndex(draftConfig.medications.length);
  };

  // Delete medication
  const handleDeleteMedication = (index: number) => {
    if (draftConfig.medications.length <= 1) {
      alert('Regimen must have at least one medication.');
      return;
    }
    setDraftConfig((prev) => {
      const nextMeds = prev.medications.filter((_, i) => i !== index);
      const updated = { ...prev, medications: nextMeds };
      setJsonText(JSON.stringify(updated, null, 2));
      return updated;
    });
    setSelectedMedIndex(0);
  };

  // Save changes
  const handleSaveDraft = () => {
    const validation = updateRegimen(draftConfig);
    if (validation.isValid) {
      setSaveSuccessNotification(true);
      setJsonErrors([]);
      setTimeout(() => setSaveSuccessNotification(false), 3000);
    } else {
      setJsonErrors(validation.errors);
    }
  };

  // Apply Raw JSON
  const handleApplyJsonText = () => {
    const res = importJSON(jsonText);
    if (res.isValid) {
      setSaveSuccessNotification(true);
      setJsonErrors([]);
      setTimeout(() => setSaveSuccessNotification(false), 3000);
    } else {
      setJsonErrors(res.errors);
    }
  };

  // Copy JSON to clipboard
  const handleCopyJSON = () => {
    navigator.clipboard.writeText(jsonText);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  // Download JSON file
  const handleDownloadJSON = () => {
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chemo_regimen_${draftConfig.regimenName.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // File Upload Ingest
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        setJsonText(content);
        const res = importJSON(content);
        if (res.isValid) {
          setSaveSuccessNotification(true);
          setJsonErrors([]);
        } else {
          setJsonErrors(res.errors);
        }
      }
    };
    reader.readAsText(file);
  };

  const currentMed = draftConfig.medications[selectedMedIndex] || draftConfig.medications[0];

  return (
    <DialogModal
      isOpen={isAdminOpen}
      onOpenChange={setIsAdminOpen}
      title="Caregiver Admin Portal"
      subtitle="Full control over regimen configuration, start dates, medication schedules, and raw JSON schema."
      size="wide"
      footer={
        <Stack direction="row" justify="between" align="center" fullWidth wrap gap="3">
          <Button
            variant="danger"
            size="md"
            onPress={() => {
              if (confirm('Reset regimen to default MUM46 Multiple Myeloma regimen?')) {
                resetToDefaultRegimen();
              }
            }}
            leftIcon={<RotateCcw size={16} />}
          >
            Reset to MUM46 Default
          </Button>

          <Stack direction="row" gap="3" align="center">
            <Button variant="outlined" size="md" onPress={() => setIsAdminOpen(false)}>
              Close
            </Button>
            <Button variant="filled" size="md" onPress={handleSaveDraft} leftIcon={<Save size={18} />}>
              Save & Apply Regimen
            </Button>
          </Stack>
        </Stack>
      }
    >
      <Stack direction="column" gap="4" fullWidth>
        {/* Success / Error Banners */}
        {saveSuccessNotification && (
          <Callout variant="success" icon={<Check size={20} />}>
            <Text size="sm" weight="bold">
              Regimen configuration successfully saved and applied!
            </Text>
          </Callout>
        )}

        {jsonErrors.length > 0 && (
          <Callout variant="error" icon={<AlertCircle size={20} />} title="Schema Validation Errors:">
            <ul className="admin-error-list">
              {jsonErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </Callout>
        )}

        {/* Tabbed Admin Controls */}
        <Tabs defaultSelectedKey="medications" className="react-aria-Tabs">
          <TabList className="react-aria-TabList" aria-label="Admin Portal Tabs">
            <Tab id="medications" className="react-aria-Tab">
              <Pill size={18} />
              <span>Medication Schedules</span>
            </Tab>
            <Tab id="general" className="react-aria-Tab">
              <Calendar size={18} />
              <span>Cycle & Regimen Info</span>
            </Tab>
            <Tab id="json" className="react-aria-Tab">
              <FileCode size={18} />
              <span>Raw JSON Ingest & Export</span>
            </Tab>
            <Tab id="adherence" className="react-aria-Tab">
              <ClipboardList size={18} />
              <span>Adherence Logs</span>
            </Tab>
          </TabList>

          {/* ================================================================
              TAB 1: Medication Schedules Editor
             ================================================================ */}
          <TabPanel id="medications" className="react-aria-TabPanel">
            <Grid columns="240px 1fr" gap="4" className="admin-med-grid">
              {/* Left sidebar: list of meds */}
              <Stack direction="column" gap="2">
                <Stack direction="row" justify="between" align="center">
                  <Text size="sm" weight="bold">
                    Medications ({draftConfig.medications.length})
                  </Text>
                  <Button
                    variant="filled-tonal"
                    size="sm"
                    onPress={handleAddMedication}
                    aria-label="Add new medication"
                    leftIcon={<Plus size={16} />}
                  >
                    Add
                  </Button>
                </Stack>

                <Stack direction="column" gap="1_5">
                  {draftConfig.medications.map((med, idx) => (
                    <Button
                      key={med.id}
                      variant={selectedMedIndex === idx ? 'filled' : 'outlined'}
                      size="md"
                      onPress={() => setSelectedMedIndex(idx)}
                      className={clsx('admin-med-nav-btn', {
                        'admin-med-nav-btn-selected': selectedMedIndex === idx
                      })}
                      aria-label={`Select ${med.patientFriendlyName || 'Untitled Med'}`}
                    >
                      <Text size="sm" weight="bold">
                        {med.patientFriendlyName || 'Untitled Med'}
                      </Text>
                      <Caption>
                        Days: [{med.days.join(', ')}]
                      </Caption>
                    </Button>
                  ))}
                </Stack>
              </Stack>

              {/* Right panel: Medication detail form */}
              {currentMed ? (
                <Card variant="flat" padding="md">
                  <Stack direction="column" gap="4">
                    <Stack direction="row" justify="between" align="center" wrap gap="2">
                      <Heading level={3} variant="h3">
                        Edit: {currentMed.patientFriendlyName}
                      </Heading>
                      <Button
                        variant="text"
                        size="sm"
                        onPress={() => handleDeleteMedication(selectedMedIndex)}
                        leftIcon={<Trash2 size={16} color="var(--md-sys-color-error)" />}
                      >
                        <Text size="sm" color="error" weight="bold">
                          Delete Medication
                        </Text>
                      </Button>
                    </Stack>

                    <Grid columns="repeat(auto-fit, minmax(200px, 1fr))" gap="3">
                      <TextField
                        label="Patient Friendly Name"
                        value={currentMed.patientFriendlyName}
                        onChange={(val) =>
                          handleMedChange(selectedMedIndex, {
                            ...currentMed,
                            patientFriendlyName: val
                          })
                        }
                        isRequired
                      />

                      <TextField
                        label="Route / Delivery"
                        value={currentMed.route}
                        onChange={(val) =>
                          handleMedChange(selectedMedIndex, {
                            ...currentMed,
                            route: val
                          })
                        }
                        isRequired
                      />

                      <TextField
                        label="Dose Amount"
                        placeholder="e.g. 1.3 mg/m²"
                        value={currentMed.dose || ''}
                        onChange={(val) =>
                          handleMedChange(selectedMedIndex, {
                            ...currentMed,
                            dose: val
                          })
                        }
                      />
                    </Grid>

                    <TextField
                      label="Instructions"
                      value={currentMed.instructions}
                      onChange={(val) =>
                        handleMedChange(selectedMedIndex, {
                          ...currentMed,
                          instructions: val
                        })
                      }
                    />

                    {/* Time of Day Selector */}
                    <Stack direction="column" gap="1_5">
                      <Text size="sm" weight="bold">
                        Administration Timing (Time of Day):
                      </Text>
                      <Stack direction="row" gap="2" wrap align="center">
                        {(
                          [
                            { value: 'morning', label: 'Morning (AM)' },
                            { value: 'evening', label: 'Evening (PM)' },
                            { value: 'split', label: 'Split (AM & PM)' },
                            { value: 'anytime', label: 'Anytime' }
                          ] as const
                        ).map((timing) => {
                          const isSelected = (currentMed.timeOfDay || 'morning') === timing.value;
                          return (
                            <Button
                              key={timing.value}
                              variant={isSelected ? 'filled' : 'outlined'}
                              size="sm"
                              onPress={() =>
                                handleMedChange(selectedMedIndex, {
                                  ...currentMed,
                                  timeOfDay: timing.value
                                })
                              }
                              aria-label={`Set timing to ${timing.label} for ${currentMed.patientFriendlyName}`}
                            >
                              {timing.label}
                            </Button>
                          );
                        })}
                      </Stack>
                    </Stack>

                    {/* Interactive Day Selector Matrix (Days 1..28) */}
                    <Stack direction="column" gap="1_5">
                      <Text size="sm" weight="bold">
                        Schedule Dates & Days (Click to toggle active treatment dates in the {draftConfig.cycleDurationDays}-day cycle):
                      </Text>
                      <Grid columns={7} gap="1_5">
                        {Array.from({ length: draftConfig.cycleDurationDays }, (_, i) => i + 1).map((dNum) => {
                          const isDayActive = currentMed.days.includes(dNum);
                          const dDate = getDateForCycleAndDay(
                            draftConfig.cycleStartDate,
                            draftConfig.cycleDurationDays,
                            1,
                            dNum
                          );
                          const dShort = formatShortDate(dDate);
                          const dWeekday = dDate.toLocaleDateString('en-US', { weekday: 'short' });

                          return (
                            <Button
                              key={dNum}
                              variant={isDayActive ? 'filled' : 'outlined'}
                              size="sm"
                              onPress={() => handleToggleMedDay(selectedMedIndex, dNum)}
                              aria-label={`Toggle ${dShort} (${dWeekday}, Day ${dNum}) for ${currentMed.patientFriendlyName}`}
                            >
                              <Stack direction="column" align="center" gap="0">
                                <Text size="xs" weight="bold" color="inherit">
                                  {dShort}
                                </Text>
                                <Caption>
                                  D{dNum}
                                </Caption>
                              </Stack>
                            </Button>
                          );
                        })}
                      </Grid>
                    </Stack>

                    {/* Guide Fields */}
                    <Stack direction="column" gap="3">
                      <TextField
                        label="Purpose (Patient Language)"
                        value={currentMed.guide.purpose}
                        onChange={(val) =>
                          handleMedChange(selectedMedIndex, {
                            ...currentMed,
                            guide: { ...currentMed.guide, purpose: val }
                          })
                        }
                      />

                      <TextField
                        label="How to Take"
                        value={currentMed.guide.howToTake}
                        onChange={(val) =>
                          handleMedChange(selectedMedIndex, {
                            ...currentMed,
                            guide: { ...currentMed.guide, howToTake: val }
                          })
                        }
                      />

                      <TextField
                        label="Key Precautions / Warnings"
                        value={currentMed.guide.keyPrecautions}
                        onChange={(val) =>
                          handleMedChange(selectedMedIndex, {
                            ...currentMed,
                            guide: { ...currentMed.guide, keyPrecautions: val }
                          })
                        }
                      />
                    </Stack>
                  </Stack>
                </Card>
              ) : null}
            </Grid>
          </TabPanel>

          {/* ================================================================
              TAB 2: General Regimen & Cycle Info
             ================================================================ */}
          <TabPanel id="general" className="react-aria-TabPanel">
            <Card variant="flat" padding="md">
              <Stack direction="column" gap="4">
                <Grid columns="repeat(auto-fit, minmax(220px, 1fr))" gap="3">
                  <TextField
                    label="Regimen Name"
                    value={draftConfig.regimenName}
                    onChange={(val) => handleConfigFieldChange('regimenName', val)}
                    isRequired
                  />

                  <TextField
                    label="Cycle 1 Start Date (YYYY-MM-DD)"
                    type="date"
                    value={draftConfig.cycleStartDate}
                    onChange={(val) => handleConfigFieldChange('cycleStartDate', val)}
                    isRequired
                  />

                  <TextField
                    label="Cycle Duration (Days)"
                    type="number"
                    value={String(draftConfig.cycleDurationDays)}
                    onChange={(val) => handleConfigFieldChange('cycleDurationDays', parseInt(val, 10) || 28)}
                    isRequired
                  />

                  <TextField
                    label="Total Cycles"
                    type="number"
                    value={String(draftConfig.totalCycles)}
                    onChange={(val) => handleConfigFieldChange('totalCycles', parseInt(val, 10) || 4)}
                    isRequired
                  />
                </Grid>

                <Grid columns="repeat(auto-fit, minmax(220px, 1fr))" gap="3">
                  <TextField
                    label="Patient Name"
                    value={draftConfig.patientName || ''}
                    onChange={(val) => handleConfigFieldChange('patientName', val)}
                  />

                  <TextField
                    label="Physician / Oncologist"
                    value={draftConfig.physicianName || ''}
                    onChange={(val) => handleConfigFieldChange('physicianName', val)}
                  />

                  <TextField
                    label="Clinic Phone Number"
                    value={draftConfig.clinicPhone || ''}
                    onChange={(val) => handleConfigFieldChange('clinicPhone', val)}
                  />

                  <TextField
                    label="Urgent / Emergency Phone"
                    value={draftConfig.emergencyPhone || ''}
                    onChange={(val) => handleConfigFieldChange('emergencyPhone', val)}
                  />
                </Grid>
              </Stack>
            </Card>
          </TabPanel>

          {/* ================================================================
              TAB 3: Raw JSON Schema Ingest & Export
             ================================================================ */}
          <TabPanel id="json" className="react-aria-TabPanel">
            <Stack direction="column" gap="3">
              <Stack direction="row" justify="between" align="center" wrap gap="2">
                <Text size="sm" weight="semibold">
                  Directly edit, ingest, or export the JSON configuration schema:
                </Text>
                <Stack direction="row" gap="2" align="center" wrap>
                  <label className="ds-btn ds-btn-outlined ds-btn-sm admin-upload-label">
                    <Upload size={14} />
                    <span>Upload .json</span>
                    <input type="file" accept=".json" onChange={handleFileUpload} className="admin-hidden-input" aria-label="Upload JSON file" />
                  </label>
                  <Button
                    variant="outlined"
                    size="sm"
                    onPress={handleCopyJSON}
                    leftIcon={copiedNotification ? <Check size={14} /> : <Copy size={14} />}
                  >
                    {copiedNotification ? 'Copied!' : 'Copy JSON'}
                  </Button>
                  <Button
                    variant="filled-tonal"
                    size="sm"
                    onPress={handleDownloadJSON}
                    leftIcon={<Download size={14} />}
                  >
                    Download .json
                  </Button>
                </Stack>
              </Stack>

              <TextField
                multiline
                rows={16}
                value={jsonText}
                onChange={(val) => setJsonText(val)}
                inputClassName="admin-json-textarea"
                aria-label="Raw JSON configuration schema editor"
              />

              <Stack direction="row" justify="end" fullWidth>
                <Button variant="filled" size="md" onPress={handleApplyJsonText} leftIcon={<Save size={16} />}>
                  Parse, Validate & Apply JSON
                </Button>
              </Stack>
            </Stack>
          </TabPanel>

          {/* ================================================================
              TAB 4: Adherence History & Data Reset
             ================================================================ */}
          <TabPanel id="adherence" className="react-aria-TabPanel">
            <Card variant="flat" padding="md">
              <Stack direction="column" gap="4">
                <Heading level={3} variant="h3">
                  Adherence Audit Logs
                </Heading>
                <Text size="sm">
                  Total tracked adherence dates: <strong>{Object.keys(adherence).length}</strong>
                </Text>

                <div className="admin-adherence-log-box">
                  {Object.keys(adherence).length === 0 ? (
                    <Text size="sm" color="muted">
                      No medication doses recorded yet.
                    </Text>
                  ) : (
                    <ul className="admin-adherence-list">
                      {Object.entries(adherence).map(([date, record]) => (
                        <li key={date}>
                          <strong>{formatLongDate(parseISODate(date))}:</strong> Meds taken: [{record.completedMedIds.join(', ') || 'None'}], Fluids: {record.hydrationCups} cups
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <Button
                    variant="danger"
                    size="md"
                    onPress={() => {
                      if (confirm('Clear all patient adherence logs and hydration history?')) {
                        clearAdherenceHistory();
                      }
                    }}
                    leftIcon={<Trash2 size={16} />}
                  >
                    Clear Adherence History
                  </Button>
                </div>
              </Stack>
            </Card>
          </TabPanel>
        </Tabs>
      </Stack>
    </DialogModal>
  );
};
