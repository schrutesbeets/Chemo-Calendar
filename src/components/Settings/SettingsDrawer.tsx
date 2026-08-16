import React from 'react';
import {
  SunMoon,
  Printer,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import {
  Button,
  Card,
  Heading,
  Text,
  Code,
  Stack,
  DialogModal,
  AccessibleSwitch,
  AccessibleSlider
} from '../common';

export const SettingsDrawer: React.FC = () => {
  const {
    settings,
    setHighContrast,
    setFontScale,
    isSettingsOpen,
    setIsSettingsOpen,
    setIsPrintModalOpen,
    setIsAdminOpen,
    setIsPinAuthModalOpen,
    triggerDirectPrint
  } = useSettings();

  const handleOpenAdmin = () => {
    setIsSettingsOpen(false);
    if (settings.pinEnabled) {
      setIsPinAuthModalOpen(true);
    } else {
      setIsAdminOpen(true);
    }
  };

  const handleOpenPrint = () => {
    setIsSettingsOpen(false);
    setIsPrintModalOpen(true);
  };

  return (
    <DialogModal
      isOpen={isSettingsOpen}
      onOpenChange={setIsSettingsOpen}
      title="Settings & Accessibility"
      subtitle="Customize readability, generate printable fridge schedules, and access caregiver controls."
      footer={
        <Stack direction="row" justify="end" fullWidth>
          <Button
            variant="filled"
            size="md"
            onPress={() => setIsSettingsOpen(false)}
          >
            Done
          </Button>
        </Stack>
      }
    >
      <Stack direction="column" gap="4" fullWidth>
        {/* ====================================================================
            1. High Contrast & Display Accessibility
           ==================================================================== */}
        <Card variant="flat" padding="md">
          <Stack direction="column" gap="4">
            <Stack direction="row" align="center" gap="2">
              <SunMoon size={22} color="var(--md-sys-color-primary)" />
              <Heading level={3} variant="h3">
                1. Accessibility & Visual Display
              </Heading>
            </Stack>

            {/* High Contrast Mode Switch */}
            <AccessibleSwitch
              isSelected={settings.highContrast}
              onChange={setHighContrast}
              label="High Contrast Mode (WCAG AAA)"
              description="Pure black-on-white surfaces, solid 3px borders, removed faded shadows, and maximum stroke icons."
            />

            {/* Font Scaling Slider */}
            <Stack direction="column" gap="1_5">
              <AccessibleSlider
                label="Text Size / Magnification"
                value={settings.fontScale}
                onChange={setFontScale}
                minValue={1.0}
                maxValue={1.5}
                step={0.05}
                helperText="Minimum 18px body and 24px headings. Scales all buttons, calendars, and text fluidly."
              />
              <Stack direction="row" justify="end">
                <Button
                  variant="text"
                  size="sm"
                  onPress={() => setFontScale(1.0)}
                  isDisabled={settings.fontScale === 1.0}
                  leftIcon={<RotateCcw size={14} />}
                >
                  Reset to 100%
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Card>

        {/* ====================================================================
            2. Print Fridge Schedule Action
           ==================================================================== */}
        <Card variant="flat" padding="md">
          <Stack direction="column" gap="3">
            <Stack direction="row" align="center" gap="2">
              <Printer size={22} color="var(--md-sys-color-primary)" />
              <Heading level={3} variant="h3">
                2. Print Fridge Schedule
              </Heading>
            </Stack>

            <Text size="sm" color="muted">
              One-click generator to create high-contrast physical paper schedules for the refrigerator, bathroom mirror, or visiting nurses. Formatted for standard Letter and Tabloid paper sizes.
            </Text>

            <Stack direction="row" gap="3" wrap>
              <Button
                variant="filled"
                size="lg"
                onPress={handleOpenPrint}
                leftIcon={<Printer size={20} />}
              >
                Open Print Preview & Formatter
              </Button>

              <Button
                variant="outlined"
                size="lg"
                onPress={triggerDirectPrint}
              >
                Instant Quick Print
              </Button>
            </Stack>
          </Stack>
        </Card>

        {/* ====================================================================
            3. Caregiver Admin Portal Entry
           ==================================================================== */}
        <Card variant="flat" padding="md">
          <Stack direction="column" gap="3">
            <Stack direction="row" align="center" gap="2">
              <ShieldCheck size={22} color="var(--md-sys-color-primary)" />
              <Heading level={3} variant="h3">
                3. Caregiver Admin Portal
              </Heading>
            </Stack>

            <Text size="sm" color="muted">
              For family caregivers and healthcare coordinators. Ingest, edit, validate, and export chemotherapy regimen schedules without code modifications. Can also be accessed via <Code>#admin</Code> URL route.
            </Text>

            <div>
              <Button
                variant="filled-tonal"
                size="lg"
                onPress={handleOpenAdmin}
                leftIcon={<ShieldCheck size={20} />}
              >
                Enter Caregiver Admin Portal
              </Button>
            </div>
          </Stack>
        </Card>
      </Stack>
    </DialogModal>
  );
};
