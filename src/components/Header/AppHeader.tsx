import React from 'react';
import {
  SunMoon,
  Printer,
  Settings,
  Calendar,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useRegimen } from '../../context/RegimenContext';
import {
  Button,
  IconButton,
  Heading,
  Text,
  Stack,
  Badge
} from '../common';
import { formatLongDate, parseISODate } from '../../utils/dateUtils';

export const AppHeader: React.FC = () => {
  const {
    settings,
    toggleHighContrast,
    setFontScale,
    setIsSettingsOpen,
    setIsPrintModalOpen
  } = useSettings();

  const { regimen, todayDateStr } = useRegimen();
  const todayDate = parseISODate(todayDateStr);

  const handleZoomIn = () => {
    setFontScale(Math.min(1.5, settings.fontScale + 0.1));
  };

  const handleZoomOut = () => {
    setFontScale(Math.max(1.0, settings.fontScale - 0.1));
  };

  return (
    <header className="app-header-container no-print">
      {/* Top Banner / Accessibility Ribbon */}
      <div className="app-header-ribbon">
        <Stack direction="row" align="center" gap="2">
          <Calendar size={18} color="var(--md-sys-color-primary)" />
          <Text size="sm" weight="semibold">
            Today: {formatLongDate(todayDate)}
          </Text>
        </Stack>

        {/* Quick Accessibility Bar */}
        <Stack direction="row" align="center" gap="2" wrap>
          {/* Zoom controls */}
          <div className="app-zoom-controls">
            <IconButton
              icon={<ZoomOut size={18} />}
              aria-label="Decrease text size"
              variant="text"
              size="sm"
              onPress={handleZoomOut}
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
              onPress={handleZoomIn}
              isDisabled={settings.fontScale >= 1.5}
            />
          </div>

          {/* High Contrast Mode Quick Toggle */}
          <Button
            variant={settings.highContrast ? 'filled' : 'outlined'}
            size="md"
            onPress={toggleHighContrast}
            aria-label={`Switch to ${settings.highContrast ? 'Standard' : 'High Contrast'} contrast mode`}
            leftIcon={<SunMoon size={18} />}
          >
            {settings.highContrast ? 'High Contrast: ON' : 'High Contrast'}
          </Button>

          {/* Quick Print Button */}
          <Button
            variant="filled-tonal"
            size="md"
            onPress={() => setIsPrintModalOpen(true)}
            aria-label="Print Refrigerator Schedule"
            leftIcon={<Printer size={18} />}
          >
            Print Fridge Schedule
          </Button>

          {/* Main Settings Modal Trigger */}
          <IconButton
            icon={<Settings size={22} />}
            aria-label="Open Settings Panel"
            variant="text"
            size="md"
            onPress={() => setIsSettingsOpen(true)}
          />
        </Stack>
      </div>

      {/* Main Regimen Title Card */}
      <div className="app-header-main">
        <Stack direction="column" gap="1">
          <Badge label="Medical Regimen Tracker" color="primary" />
          <Heading level={1} variant="h1">
            {regimen.regimenName}
          </Heading>
          {regimen.patientName && (
            <Text size="sm" color="muted" weight="semibold">
              Patient: <strong>{regimen.patientName}</strong> • {regimen.totalCycles} Cycles ({regimen.cycleDurationDays} Days each)
            </Text>
          )}
        </Stack>

        {/* Emergency / Doctor contact quick pills */}
        {(regimen.clinicPhone || regimen.emergencyPhone) && (
          <div className="app-contact-pills">
            {regimen.clinicPhone && (
              <Text size="sm">
                🏥 Clinic: <strong>{regimen.clinicPhone}</strong>
              </Text>
            )}
            {regimen.emergencyPhone && (
              <Text size="sm" color="error" weight="bold">
                🚨 Urgent: <strong>{regimen.emergencyPhone}</strong>
              </Text>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
