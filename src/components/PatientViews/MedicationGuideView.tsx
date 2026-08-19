import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  ShieldAlert,
  Sparkles,
  Check,
  AlertTriangle,
  Plus,
  AlertCircle
} from 'lucide-react';
import { useRegimen } from '../../context/RegimenContext';
import type { Medication, TimeOfDay, BadgeColor } from '../../types/regimen';
import {
  Button,
  Card,
  Heading,
  Text,
  Caption,
  Stack,
  Grid,
  Badge,
  Callout,
  DialogModal,
  TextField,
  StickyHeader
} from '../common';
import {
  getDateForCycleAndDay,
  formatShortDate
} from '../../utils/dateUtils';

const TIMING_OPTIONS: { value: TimeOfDay; label: string }[] = [
  { value: 'morning', label: 'Morning (AM)' },
  { value: 'evening', label: 'Evening (PM)' },
  { value: 'split', label: 'Split (AM & PM)' },
  { value: 'anytime', label: 'Anytime' }
];

const COLOR_OPTIONS: { value: BadgeColor; label: string }[] = [
  { value: 'primary', label: 'Primary (Blue)' },
  { value: 'tertiary', label: 'Tertiary (Purple)' },
  { value: 'warning', label: 'Warning (Amber)' },
  { value: 'secondary', label: 'Secondary (Slate)' },
  { value: 'success', label: 'Success (Green)' },
  { value: 'error', label: 'Error (Red)' }
];

export const MedicationGuideView: React.FC = () => {
  const { regimen, addMedication } = useRegimen();
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Add Medication Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [route, setRoute] = useState('Take by mouth');
  const [dose, setDose] = useState('');
  const [instructions, setInstructions] = useState('');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const [days, setDays] = useState<number[]>([1]);
  const [badgeColor, setBadgeColor] = useState<BadgeColor>('primary');
  const [purpose, setPurpose] = useState('');
  const [howToTake, setHowToTake] = useState('');
  const [keyPrecautions, setKeyPrecautions] = useState('');
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const handleOpenAddModal = () => {
    setName('');
    setRoute('Take by mouth');
    setDose('');
    setInstructions('');
    setTimeOfDay('morning');
    setDays([1]);
    setBadgeColor('primary');
    setPurpose('');
    setHowToTake('');
    setKeyPrecautions('');
    setFormErrors([]);
    setIsAddModalOpen(true);
  };

  const handleToggleDay = (dayNum: number) => {
    setDays((prev) =>
      prev.includes(dayNum)
        ? prev.filter((d) => d !== dayNum).sort((a, b) => a - b)
        : [...prev, dayNum].sort((a, b) => a - b)
    );
  };

  const handleSaveMedication = () => {
    const errors: string[] = [];
    if (!name.trim()) errors.push('Medication name is required.');
    if (!route.trim()) errors.push('Route / delivery method is required.');
    if (days.length === 0) errors.push('Please select at least one schedule day in the cycle.');
    if (!purpose.trim()) errors.push('Purpose description is required.');
    if (!howToTake.trim()) errors.push('How-to-take instructions are required.');
    if (!keyPrecautions.trim()) errors.push('Key precautions are required.');

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    const newMed: Medication = {
      id: `med_${Date.now()}`,
      patientFriendlyName: name.trim(),
      route: route.trim(),
      dose: dose.trim() || undefined,
      instructions: instructions.trim() || 'Take as directed.',
      badgeColor,
      timeOfDay,
      days,
      guide: {
        purpose: purpose.trim(),
        howToTake: howToTake.trim(),
        keyPrecautions: keyPrecautions.trim()
      }
    };

    const res = addMedication(newMed);
    if (res.isValid) {
      setIsAddModalOpen(false);
    } else {
      setFormErrors(res.errors);
    }
  };

  const handleReadAloud = (medId: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Read-aloud is not supported in this browser.');
      return;
    }

    if (speakingId === medId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for senior accessibility
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(medId);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <Stack direction="column" gap="4" fullWidth>
      {/* Sticky Header Banner */}
      <StickyHeader top="0" zIndex="10" fullWidth>
        <Card variant="elevated" padding="md">
          <Stack direction="row" justify="between" align="center" wrap gap="3">
            <Stack direction="column" gap="1">
              <Heading level={2} variant="h2">
                Medication Guide & Safety Rules
              </Heading>
              <Text size="sm" color="muted">
                Plain-language instructions for your medications in the {regimen.regimenName}.
              </Text>
            </Stack>
            <Button
              variant="filled"
              size="md"
              onPress={handleOpenAddModal}
              aria-label="Add new medication to guide"
              leftIcon={<Plus size={18} />}
            >
              Add Medication
            </Button>
          </Stack>
        </Card>
      </StickyHeader>

      {/* Medication Cards List */}
      <Stack direction="column" gap="4" fullWidth>
        {regimen.medications.map((med) => {
          const speechText = `${med.patientFriendlyName}. Route: ${med.route}. Purpose: ${med.guide.purpose}. How to take: ${med.guide.howToTake}. Important precautions: ${med.guide.keyPrecautions}. Scheduled on cycle days: ${med.days.join(', ')}.`;
          const isSpeaking = speakingId === med.id;

          return (
            <Card
              key={med.id}
              variant="elevated"
              padding="lg"
              accentBorder={med.badgeColor}
            >
              <Stack direction="column" gap="4">
                <Stack direction="row" justify="between" align="start" wrap gap="3">
                  <Stack direction="column" gap="1">
                    <Stack direction="row" align="center" gap="2" wrap>
                      <Heading level={2} variant="h2">
                        {med.patientFriendlyName}
                      </Heading>
                      <Badge label={med.route} color={med.badgeColor} />
                    </Stack>
                    <Text size="sm" color="muted" weight="semibold">
                      Scheduled on Cycle Days: <strong>{med.days.join(', ')}</strong> (of {regimen.cycleDurationDays} days)
                    </Text>
                  </Stack>

                  <Button
                    variant={isSpeaking ? 'filled' : 'outlined'}
                    size="md"
                    onPress={() => handleReadAloud(med.id, speechText)}
                    aria-label={isSpeaking ? `Stop reading ${med.patientFriendlyName}` : `Read aloud ${med.patientFriendlyName} guide`}
                    leftIcon={isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  >
                    {isSpeaking ? 'Stop Reading' : 'Read Aloud'}
                  </Button>
                </Stack>

                {/* Guide details grid */}
                <Grid columns="repeat(auto-fit, minmax(260px, 1fr))" gap="4">
                  {/* Purpose Box */}
                  <Callout
                    variant="surface"
                    icon={<Sparkles size={20} color="var(--md-sys-color-primary)" />}
                    title="What it Does / Purpose"
                  >
                    <Text size="sm">
                      {med.guide.purpose}
                    </Text>
                  </Callout>

                  {/* How to Take Box */}
                  <Callout
                    variant="surface"
                    icon={<Check size={20} color="var(--md-sys-color-success)" />}
                    title="How to Take"
                  >
                    <Stack direction="column" gap="1">
                      <Text size="sm">
                        {med.guide.howToTake}
                      </Text>
                      {med.instructions && (
                        <Text size="xs" color="muted" weight="semibold">
                          Instructions: {med.instructions}
                        </Text>
                      )}
                    </Stack>
                  </Callout>

                  {/* Safety / Precautions Box */}
                  <Callout
                    variant="warning"
                    icon={<ShieldAlert size={20} />}
                    title="Key Precautions & Warnings"
                  >
                    <Text size="sm">
                      {med.guide.keyPrecautions}
                    </Text>
                  </Callout>
                </Grid>
              </Stack>
            </Card>
          );
        })}
      </Stack>

      {/* General Chemotherapy Safety Rules */}
      <Callout
        variant="warning"
        icon={<AlertTriangle size={24} />}
        title="General Chemotherapy Safety & Emergency Contacts"
      >
        <Stack direction="column" gap="2">
          <Text size="sm">
            • <strong>Temperature / Infection Alert:</strong> Call clinic immediately if your temperature reaches 100.4°F (38°C) or higher.
          </Text>
          <Text size="sm">
            • <strong>Hydration:</strong> Maintain fluid intake of at least 8 to 10 glasses of water/broth daily, especially on treatment days.
          </Text>
          <Text size="sm">
            • <strong>Missed Doses:</strong> Never double up on pills. Contact your oncology care team for specific guidance on missed doses.
          </Text>
        </Stack>
      </Callout>

      {/* Add Medication Accessible Dialog Modal */}
      <DialogModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        title="Add Medication to Regimen"
        subtitle="Configure medication delivery, administration schedule, and patient guide instructions."
        size="wide"
        footer={
          <Stack direction="row" justify="end" align="center" gap="3" fullWidth>
            <Button
              variant="outlined"
              size="md"
              onPress={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="filled"
              size="md"
              onPress={handleSaveMedication}
              leftIcon={<Plus size={18} />}
            >
              Add Medication
            </Button>
          </Stack>
        }
      >
        <Stack direction="column" gap="4" fullWidth>
          {formErrors.length > 0 && (
            <Callout variant="error" icon={<AlertCircle size={20} />} title="Please check the form:">
              <Stack direction="column" gap="1">
                {formErrors.map((err, i) => (
                  <Text key={i} size="sm" color="error">
                    • {err}
                  </Text>
                ))}
              </Stack>
            </Callout>
          )}

          <Grid columns="repeat(auto-fit, minmax(220px, 1fr))" gap="3">
            <TextField
              label="Medication Name"
              placeholder="e.g. Bortezomib (Injection)"
              value={name}
              onChange={setName}
              isRequired
            />
            <TextField
              label="Route / Delivery Method"
              placeholder="e.g. Take by mouth, Subcutaneous shot"
              value={route}
              onChange={setRoute}
              isRequired
            />
            <TextField
              label="Dose Amount"
              placeholder="e.g. 20 mg, 1.3 mg/m²"
              value={dose}
              onChange={setDose}
            />
          </Grid>

          <TextField
            label="General Instructions"
            placeholder="e.g. Take in the morning with food."
            value={instructions}
            onChange={setInstructions}
          />

          {/* Time of Day Selection */}
          <Stack direction="column" gap="1_5">
            <Text size="sm" weight="bold">
              Administration Timing (Time of Day):
            </Text>
            <Stack direction="row" gap="2" wrap align="center">
              {TIMING_OPTIONS.map((timing) => {
                const isSelected = timeOfDay === timing.value;
                return (
                  <Button
                    key={timing.value}
                    variant={isSelected ? 'filled' : 'outlined'}
                    size="sm"
                    onPress={() => setTimeOfDay(timing.value)}
                    aria-label={`Set timing to ${timing.label}`}
                  >
                    {timing.label}
                  </Button>
                );
              })}
            </Stack>
          </Stack>

          {/* Badge Color Selection */}
          <Stack direction="column" gap="1_5">
            <Text size="sm" weight="bold">
              Card Accent Badge Color:
            </Text>
            <Stack direction="row" gap="2" wrap align="center">
              {COLOR_OPTIONS.map((c) => {
                const isSelected = badgeColor === c.value;
                return (
                  <Button
                    key={c.value}
                    variant={isSelected ? 'filled' : 'outlined'}
                    size="sm"
                    onPress={() => setBadgeColor(c.value)}
                    aria-label={`Select ${c.label} color`}
                  >
                    {c.label}
                  </Button>
                );
              })}
            </Stack>
          </Stack>

          {/* Interactive Day Matrix Selector (Days 1..28) */}
          <Stack direction="column" gap="1_5">
            <Text size="sm" weight="bold">
              Schedule Days in Cycle (Click to toggle active treatment days):
            </Text>
            <Grid columns={7} gap="1_5">
              {Array.from({ length: regimen.cycleDurationDays }, (_, i) => i + 1).map((dNum) => {
                const isDayActive = days.includes(dNum);
                const dDate = getDateForCycleAndDay(
                  regimen.cycleStartDate,
                  regimen.cycleDurationDays,
                  1,
                  dNum
                );
                const dShort = formatShortDate(dDate);

                return (
                  <Button
                    key={dNum}
                    variant={isDayActive ? 'filled' : 'outlined'}
                    size="sm"
                    onPress={() => handleToggleDay(dNum)}
                    aria-label={`Toggle Day ${dNum} (${dShort})`}
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

          {/* Plain-Language Guide Fields */}
          <Stack direction="column" gap="3">
            <TextField
              label="Purpose / What it Does (Plain-Language)"
              placeholder="e.g. Chemotherapy pill to slow myeloma cell growth."
              value={purpose}
              onChange={setPurpose}
              multiline
              rows={2}
              isRequired
            />
            <TextField
              label="How to Take Instructions"
              placeholder="e.g. Swallow whole with plenty of fluids, in the morning with breakfast."
              value={howToTake}
              onChange={setHowToTake}
              multiline
              rows={2}
              isRequired
            />
            <TextField
              label="Key Precautions & Warnings"
              placeholder="e.g. Drink 8-12 cups of water throughout the day. Report tingling in fingers."
              value={keyPrecautions}
              onChange={setKeyPrecautions}
              multiline
              rows={2}
              isRequired
            />
          </Stack>
        </Stack>
      </DialogModal>
    </Stack>
  );
};
