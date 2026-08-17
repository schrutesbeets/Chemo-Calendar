import React from 'react';
import {
  SunMoon,
  Printer,
  RotateCcw,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import {
  Button,
  IconButton,
  Card,
  Heading,
  Text,
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
    triggerDirectPrint
  } = useSettings();

  const handleOpenPrint = () => {
    setIsSettingsOpen(false);
    setIsPrintModalOpen(true);
  };

  return (
    <DialogModal
      isOpen={isSettingsOpen}
      onOpenChange={setIsSettingsOpen}
      title="Settings & Accessibility"
      subtitle="Customize readability and generate printable fridge schedules."
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
            <Stack direction="column" gap="2">
              <AccessibleSlider
                label="Text Size / Magnification"
                value={settings.fontScale}
                onChange={setFontScale}
                minValue={1.0}
                maxValue={1.5}
                step={0.05}
                helperText="Minimum 18px body and 24px headings. Scales all buttons, calendars, and text fluidly."
              />
              <Stack direction="row" justify="between" align="center" fullWidth wrap>
                <div className="app-zoom-controls">
                  <IconButton
                    icon={<ZoomOut size={18} />}
                    aria-label="Decrease text size"
                    variant="text"
                    size="sm"
                    onPress={() => setFontScale(Math.max(1.0, Math.round((settings.fontScale - 0.05) * 100) / 100))}
                    isDisabled={settings.fontScale <= 1.0}
                  />
                  <span className="app-zoom-value">
                    {Math.round(settings.fontScale * 100)}%
                  </span>
                  <IconButton
                    icon={<ZoomIn size={18} />}
                    aria-label="Increase text size"
                    variant="text"
                    size="sm"
                    onPress={() => setFontScale(Math.min(1.5, Math.round((settings.fontScale + 0.05) * 100) / 100))}
                    isDisabled={settings.fontScale >= 1.5}
                  />
                </div>

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
      </Stack>
    </DialogModal>
  );
};
