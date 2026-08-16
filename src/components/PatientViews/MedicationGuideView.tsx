import React, { useState } from 'react';
import { Volume2, VolumeX, ShieldAlert, Sparkles, Check, AlertTriangle } from 'lucide-react';
import { useRegimen } from '../../context/RegimenContext';
import {
  Button,
  Card,
  Heading,
  Text,
  Stack,
  Grid,
  Badge,
  Callout
} from '../common';

export const MedicationGuideView: React.FC = () => {
  const { regimen } = useRegimen();
  const [speakingId, setSpeakingId] = useState<string | null>(null);

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
      <Card variant="elevated" padding="md">
        <Stack direction="column" gap="1">
          <Heading level={2} variant="h2">
            Medication Guide & Safety Rules
          </Heading>
          <Text size="sm" color="muted">
            Plain-language instructions for your medications in the {regimen.regimenName}.
          </Text>
        </Stack>
      </Card>

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
    </Stack>
  );
};
