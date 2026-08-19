import React from 'react';
import {
  Printer,
  Settings,
  Calendar
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useRegimen } from '../../context/RegimenContext';
import {
  Button,
  Heading,
  Text,
  Stack,
  Badge,
  Tag
} from '../common';
import { formatLongDate, parseISODate } from '../../utils/dateUtils';

export const AppHeader: React.FC = () => {
  const {
    setIsSettingsOpen,
    setIsPrintModalOpen
  } = useSettings();

  const { regimen, todayDateStr } = useRegimen();
  const todayDate = parseISODate(todayDateStr);

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

        {/* Quick Actions Bar */}
        <Stack direction="row" align="center" gap="2" wrap>
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
          <Button
            variant="outlined"
            size="md"
            onPress={() => setIsSettingsOpen(true)}
            aria-label="Open Settings & Accessibility"
            leftIcon={<Settings size={18} />}
          >
            Settings
          </Button>
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
          <Stack direction="row" gap="2" align="center" wrap className="app-contact-pills">
            {regimen.clinicPhone && (
              <Tag
                label={`Clinic: ${regimen.clinicPhone}`}
                color="primary"
                size="sm"
                iconType="none"
              />
            )}
            {regimen.emergencyPhone && (
              <Tag
                label={`Urgent: ${regimen.emergencyPhone}`}
                color="error"
                size="sm"
                iconType="alert"
              />
            )}
          </Stack>
        )}
      </div>
    </header>
  );
};
