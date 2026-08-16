import React from 'react';
import { Printer, Check } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useRegimen } from '../../context/RegimenContext';
import {
  Button,
  Card,
  Heading,
  Text,
  Caption,
  Stack,
  Grid,
  Callout,
  DialogModal
} from '../common';
import { getDateForCycleAndDay, formatShortDate } from '../../utils/dateUtils';
import type { PrintLayoutMode } from '../../types/settings';

export const PrintModal: React.FC = () => {
  const {
    settings,
    setPrintLayout,
    isPrintModalOpen,
    setIsPrintModalOpen,
    triggerDirectPrint,
    setActiveCycle
  } = useSettings();

  const { regimen } = useRegimen();

  const handlePrint = () => {
    setIsPrintModalOpen(false);
    setTimeout(() => {
      triggerDirectPrint();
    }, 200);
  };

  const layoutOptions: { id: PrintLayoutMode; label: string; description: string }[] = [
    {
      id: 'letter-portrait',
      label: 'Letter (Portrait)',
      description: 'Standard 8.5" x 11" vertical sheet — ideal for clipboards and single-door refrigerators.'
    },
    {
      id: 'letter-landscape',
      label: 'Letter (Landscape)',
      description: 'Wide 11" x 8.5" format — optimal for wide monthly calendar view.'
    },
    {
      id: 'tabloid-landscape',
      label: 'Tabloid (Landscape)',
      description: 'Large 11" x 17" poster format — maximum legibility for clinical bulletin boards.'
    }
  ];

  return (
    <DialogModal
      isOpen={isPrintModalOpen}
      onOpenChange={setIsPrintModalOpen}
      title="Print Refrigerator Schedule"
      subtitle="Generate high-contrast physical copy with bold outlines and pen check circles."
      footer={
        <Stack direction="row" justify="end" align="center" gap="3" fullWidth>
          <Button
            variant="outlined"
            size="md"
            onPress={() => setIsPrintModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="filled"
            size="lg"
            onPress={handlePrint}
            leftIcon={<Printer size={20} />}
          >
            Print Schedule Now
          </Button>
        </Stack>
      }
    >
      <Stack direction="column" gap="4" fullWidth>
        {/* Paper Layout Selector */}
        <Stack direction="column" gap="2">
          <Text size="sm" weight="bold">
            Select Paper Format & Orientation:
          </Text>
          <Grid
            role="radiogroup"
            aria-label="Print Layout Options"
            columns="repeat(auto-fit, minmax(200px, 1fr))"
            gap="2_5"
          >
            {layoutOptions.map((opt) => {
              const isSelected = settings.printLayout === opt.id;
              return (
                <Card
                  key={opt.id}
                  variant="interactive"
                  selected={isSelected}
                  padding="md"
                  onClick={() => setPrintLayout(opt.id)}
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`Select ${opt.label} layout`}
                >
                  <Stack direction="column" gap="1">
                    <Heading level={4} variant="h4">
                      {opt.label}
                    </Heading>
                    <Text size="xs" color="muted">
                      {opt.description}
                    </Text>
                  </Stack>
                  {isSelected && (
                    <div className="ds-card-selection-indicator" aria-hidden="true">
                      <Check size={18} strokeWidth={3} />
                    </div>
                  )}
                </Card>
              );
            })}
          </Grid>
        </Stack>

        {/* Cycle Selector to Print */}
        <Stack direction="column" gap="2">
          <Text size="sm" weight="bold">
            Select Schedule Period to Print:
          </Text>
          <Stack direction="row" gap="2" wrap>
            {Array.from({ length: regimen.totalCycles }, (_, i) => i + 1).map((cNum) => {
              const startDate = getDateForCycleAndDay(
                regimen.cycleStartDate,
                regimen.cycleDurationDays,
                cNum,
                1
              );
              const endDate = getDateForCycleAndDay(
                regimen.cycleStartDate,
                regimen.cycleDurationDays,
                cNum,
                regimen.cycleDurationDays
              );
              const dateRangeStr = `${formatShortDate(startDate)} – ${formatShortDate(endDate)}`;
              const isSelected = settings.activeCycle === cNum;

              return (
                <Button
                  key={cNum}
                  variant={isSelected ? 'filled' : 'outlined'}
                  size="md"
                  onPress={() => setActiveCycle(cNum)}
                  aria-label={`${dateRangeStr} (Cycle ${cNum})`}
                  className="cycle-pill-btn"
                >
                  <Stack direction="column" align="center" gap="0">
                    <Text size="sm" weight="bold" color="inherit">
                      {dateRangeStr}
                    </Text>
                    <Caption>
                      Cycle {cNum}
                    </Caption>
                  </Stack>
                </Button>
              );
            })}
          </Stack>
        </Stack>

        {/* Print Features Highlights */}
        <Callout
          variant="surface"
          title="🖨️ Formatted specifically for home printouts:"
        >
          <ul className="print-features-list">
            <li>Strips away all interactive buttons, web chrome, and menus.</li>
            <li>Enforces solid black ink outlines and clean white surfaces to conserve printer ink.</li>
            <li>Adds physical check circles (◯) beside every medication for physical ballpoint pen ticking.</li>
            <li>Includes plain-language medication legend and hydration warning header.</li>
          </ul>
        </Callout>
      </Stack>
    </DialogModal>
  );
};
