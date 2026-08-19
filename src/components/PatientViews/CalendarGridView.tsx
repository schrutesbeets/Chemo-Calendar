import React, { useState } from 'react';
import {
  CheckCircle2,
  Droplets,
  ChevronLeft,
  ChevronRight,
  HeartHandshake,
  Syringe,
  Pill,
  Sparkles,
  Sun,
  Moon
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
  Typography,
  Stack,
  Grid,
  Box,
  Badge,
  Callout,
  AccessibleCheckbox,
  DialogModal,
  StickyHeader
} from '../common';
import {
  formatShortDate,
  formatLongDate,
  getDateForCycleAndDay
} from '../../utils/dateUtils';
import type { CalendarDayInfo, Medication } from '../../types/regimen';

const isClinicMedication = (med: Medication): boolean => {
  const lowerId = med.id.toLowerCase();
  const lowerRoute = (med.route || '').toLowerCase();
  return (
    lowerId.includes('bortezomib') ||
    lowerRoute.includes('clinic') ||
    lowerRoute.includes('shot') ||
    lowerRoute.includes('injection')
  );
};

const getMedicationIcon = (med: Medication, size: number = 14) => {
  const lowerId = med.id.toLowerCase();
  const lowerRoute = med.route ? med.route.toLowerCase() : '';

  if (
    lowerId.includes('bortezomib') ||
    lowerRoute.includes('injection') ||
    lowerRoute.includes('shot') ||
    lowerRoute.includes('clinic')
  ) {
    return <Syringe size={size} strokeWidth={2.5} aria-hidden="true" />;
  }

  if (
    lowerId.includes('dexa') ||
    lowerId.includes('dexamethasone') ||
    med.badgeColor === 'warning'
  ) {
    return <Sparkles size={size} strokeWidth={2.5} aria-hidden="true" />;
  }

  return <Pill size={size} strokeWidth={2.5} aria-hidden="true" />;
};

export const CalendarGridView: React.FC = () => {
  const {
    regimen,
    adherence,
    getCalendarDaysForCycle,
    toggleMedicationCompleted,
    setHydrationCups
  } = useRegimen();

  const { settings, setActiveCycle } = useSettings();
  const [inspectedDay, setInspectedDay] = useState<CalendarDayInfo | null>(null);

  const activeCycle = settings.activeCycle || 1;
  const days = getCalendarDaysForCycle(activeCycle);

  const cycleStartDate = getDateForCycleAndDay(
    regimen.cycleStartDate,
    regimen.cycleDurationDays,
    activeCycle,
    1
  );
  const cycleEndDate = getDateForCycleAndDay(
    regimen.cycleStartDate,
    regimen.cycleDurationDays,
    activeCycle,
    regimen.cycleDurationDays
  );
  const cycleDateRange = `${formatShortDate(cycleStartDate)} – ${formatShortDate(cycleEndDate)}`;

  const inspectedRecord = inspectedDay
    ? adherence[inspectedDay.dateStr] || { completedMedIds: [], hydrationCups: 0 }
    : { completedMedIds: [], hydrationCups: 0 };

  const handleCellClick = (day: CalendarDayInfo) => {
    setInspectedDay(day);
  };

  const handleCycleChange = (delta: number) => {
    const nextCycle = activeCycle + delta;
    if (nextCycle >= 1 && nextCycle <= regimen.totalCycles) {
      setActiveCycle(nextCycle);
    }
  };

  // Dynamically calculate weekday headers starting from regimen.cycleStartDate
  const weekDayHeaders = Array.from({ length: 7 }, (_, colIdx) => {
    const sampleDate = getDateForCycleAndDay(
      regimen.cycleStartDate,
      regimen.cycleDurationDays,
      1,
      colIdx + 1
    );
    const shortDay = sampleDate.toLocaleDateString('en-US', { weekday: 'short' });
    return `${shortDay} • Day ${colIdx + 1}`;
  });

  return (
    <Stack direction="column" gap="4" fullWidth>
      {/* Sticky Calendar Header */}
      <StickyHeader top="0" zIndex="10" fullWidth>
        <Card variant="elevated" padding="md">
          {/* Calendar Header & Cycle Controls */}
          <Stack direction="row" justify="between" align="center" wrap gap="3">
            <Stack direction="row" align="center" gap="3" wrap>
              <Button
                variant="outlined"
                size="md"
                onPress={() => handleCycleChange(-1)}
                isDisabled={activeCycle <= 1}
                leftIcon={<ChevronLeft size={20} />}
                aria-label="Previous Cycle"
              >
                Prev Cycle
              </Button>

              <Stack direction="column" gap="0_5">
                <Heading level={2} variant="h2">
                  {cycleDateRange}
                </Heading>
                <Text size="sm" color="muted">
                  Cycle {activeCycle} of {regimen.totalCycles} (28-Day Grid) • Click on any day to view details, record medications, or log fluids.
                </Text>
              </Stack>
            </Stack>

            <Button
              variant="outlined"
              size="md"
              onPress={() => handleCycleChange(1)}
              isDisabled={activeCycle >= regimen.totalCycles}
              rightIcon={<ChevronRight size={20} />}
              aria-label="Next Cycle"
            >
              Next Cycle
            </Button>
          </Stack>
        </Card>
      </StickyHeader>

      {/* Calendar Grid Card */}
      <Card variant="elevated" padding="md">
        <div className="calendar-grid-scroll-wrapper">
            <Grid columns="repeat(7, minmax(130px, 1fr))" gap="2_5">
              {/* Day of Week Column Headers */}
              {weekDayHeaders.map((colHeader, idx) => (
                <Box
                  key={idx}
                  paddingY="1_5"
                  paddingX="1"
                  backgroundColor="surfaceContainer"
                  borderRadius="s"
                  className="text-center"
                >
                  <Text size="sm" weight="extrabold" color="muted">
                    {colHeader}
                  </Text>
                </Box>
              ))}

              {/* 28 Day Cells */}
              {days.map((day) => {
                const dayRecord = adherence[day.dateStr] || { completedMedIds: [], hydrationCups: 0 };
                const clinicMeds = day.medications.filter(isClinicMedication);
                const hasClinicMeds = clinicMeds.length > 0;
                const isCompleted =
                  hasClinicMeds &&
                  clinicMeds.every((m) => dayRecord.completedMedIds.includes(m.id));

                return (
                  <Card
                    key={day.cycleDay}
                    variant={day.isToday ? 'elevated' : 'interactive'}
                    padding="sm"
                    accentBorder={day.isToday ? 'primary' : 'none'}
                    onClick={() => handleCellClick(day)}
                    role="button"
                    aria-label={`${formatLongDate(day.date)} (Cycle ${day.cycleNumber}, Day ${day.cycleDay}). ${
                      hasClinicMeds
                        ? `${clinicMeds.length} clinic medication scheduled: ${clinicMeds.map((m) => m.patientFriendlyName || m.name).join(', ')}`
                        : day.isRestDay
                        ? 'Rest day'
                        : 'Home regimen day'
                    }`}
                    className={clsx('calendar-day-card', {
                      'calendar-day-card-today': day.isToday,
                      'calendar-day-card-completed': isCompleted,
                      'calendar-day-card-rest': day.isRestDay
                    })}
                  >
                    <Stack direction="column" gap="1_5" fullWidth>
                      {/* Date and Day Number header */}
                      <Stack direction="row" justify="between" align="center" className="calendar-cell-header">
                        <Heading level={4} variant="h4">
                          {formatShortDate(day.date)}
                        </Heading>
                        <Caption>
                          Day {day.cycleDay}
                        </Caption>
                      </Stack>

                      {/* Day Content: Only Clinic Meds on Clinic Days */}
                      <Stack direction="column" gap="1" fullWidth>
                        {hasClinicMeds ? (
                          clinicMeds.map((med) => {
                            const isMedDone = dayRecord.completedMedIds.includes(med.id);
                            return (
                              <Badge
                                key={`${med.id}-clinic`}
                                size="sm"
                                variant="tonal"
                                color={med.badgeColor}
                                leftIcon={getMedicationIcon(med, 13)}
                                rightIcon={isMedDone ? <CheckCircle2 size={13} aria-hidden="true" /> : undefined}
                                label={med.patientFriendlyName || med.name || 'Medication'}
                                fullWidth
                                className={clsx({
                                  'calendar-med-done': isMedDone
                                })}
                              />
                            );
                          })
                        ) : day.isRestDay ? (
                          <Text size="xs" color="muted" italic>
                            Rest Day
                          </Text>
                        ) : null}
                      </Stack>

                      {/* Day status indicator footer */}
                      {isCompleted && (
                        <Stack direction="row" align="center" gap="1">
                          <CheckCircle2 size={14} color="var(--md-sys-color-success)" />
                          <Text size="xs" weight="extrabold" color="success">
                            Completed
                          </Text>
                        </Stack>
                      )}
                    </Stack>
                  </Card>
                );
              })}
            </Grid>
          </div>
      </Card>

      {/* Inspect Day Modal */}
      {inspectedDay && (
        <DialogModal
          isOpen={!!inspectedDay}
          onOpenChange={(open) => !open && setInspectedDay(null)}
          title={formatLongDate(inspectedDay.date)}
          subtitle={`Cycle ${inspectedDay.cycleNumber} • Day ${inspectedDay.cycleDay}`}
          footer={
            <Stack direction="row" justify="end" fullWidth>
              <Button variant="filled" size="md" onPress={() => setInspectedDay(null)}>
                Done
              </Button>
            </Stack>
          }
        >
          <Stack direction="column" gap="4">
            {inspectedDay.isRestDay ? (
              <Callout
                variant="rest"
                icon={<HeartHandshake size={24} color="var(--md-sys-color-secondary)" />}
                title="Rest & Recovery Day"
              >
                <Text size="sm" color="muted">
                  No medications scheduled for this day. Rest and recover.
                </Text>
              </Callout>
            ) : (
              <Stack direction="column" gap="3">
                <Stack direction="column" gap="0_5">
                  <Heading level={3} variant="h4">
                    Medications for {formatLongDate(inspectedDay.date)}
                  </Heading>
                  <Text size="sm" color="muted">
                    Cycle {inspectedDay.cycleNumber} • Day {inspectedDay.cycleDay}
                  </Text>
                </Stack>
                {(() => {
                  const modalMorningMeds = (inspectedDay.medications || []).filter(
                    (m: Medication) => !m.timeOfDay || m.timeOfDay === 'morning' || m.timeOfDay === 'split' || m.timeOfDay === 'anytime'
                  );
                  const modalEveningMeds = (inspectedDay.medications || []).filter(
                    (m: Medication) => m.timeOfDay === 'evening' || m.timeOfDay === 'split'
                  );

                  return (
                    <Stack direction="column" gap="3">
                      {modalMorningMeds.length > 0 && (
                        <Stack direction="column" gap="2">
                          <Stack direction="row" align="center" gap="1_5">
                            <Sun size={16} color="var(--md-sys-color-secondary)" aria-hidden="true" />
                            <Typography variant="label" weight="bold" color="secondary">
                              Morning / AM
                            </Typography>
                          </Stack>
                          <Stack direction="column" gap="2">
                            {modalMorningMeds.map((med: Medication) => {
                              const isChecked = inspectedRecord.completedMedIds.includes(med.id);
                              return (
                                <Card
                                  key={`${med.id}-am`}
                                  variant="outlined"
                                  padding="sm"
                                  accentBorder={med.badgeColor}
                                >
                                  <AccessibleCheckbox
                                    isSelected={isChecked}
                                    onChange={() => toggleMedicationCompleted(inspectedDay.dateStr, med.id)}
                                    label={med.patientFriendlyName || med.name || 'Medication'}
                                    subLabel={`${med.dose ? `${med.dose} • ` : ''}${med.route} — ${med.instructions}`}
                                  />
                                </Card>
                              );
                            })}
                          </Stack>
                        </Stack>
                      )}

                      {modalEveningMeds.length > 0 && (
                        <Stack direction="column" gap="2">
                          <Stack direction="row" align="center" gap="1_5">
                            <Moon size={16} color="var(--md-sys-color-secondary)" aria-hidden="true" />
                            <Typography variant="label" weight="bold" color="secondary">
                              Evening / PM
                            </Typography>
                          </Stack>
                          <Stack direction="column" gap="2">
                            {modalEveningMeds.map((med: Medication) => {
                              const isChecked = inspectedRecord.completedMedIds.includes(med.id);
                              return (
                                <Card
                                  key={`${med.id}-pm`}
                                  variant="outlined"
                                  padding="sm"
                                  accentBorder={med.badgeColor}
                                >
                                  <AccessibleCheckbox
                                    isSelected={isChecked}
                                    onChange={() => toggleMedicationCompleted(inspectedDay.dateStr, med.id)}
                                    label={med.patientFriendlyName || med.name || 'Medication'}
                                    subLabel={`${med.dose ? `${med.dose} • ` : ''}${med.route} — ${med.instructions}`}
                                  />
                                </Card>
                              );
                            })}
                          </Stack>
                        </Stack>
                      )}
                    </Stack>
                  );
                })()}
              </Stack>
            )}

            {inspectedDay.requiresHydrationAlert && (
              <Callout
                variant="warning"
                icon={<Droplets size={24} />}
                title="Hydration Reminder: Drink 8–12 Cups of Fluids"
              >
                <Stack direction="column" gap="3">
                  <Text size="sm">
                    Stay well hydrated today to protect your kidneys and bladder health.
                  </Text>
                  <Stack direction="row" align="center" gap="3">
                    <Button
                      variant="outlined"
                      size="sm"
                      onPress={() => setHydrationCups(inspectedDay.dateStr, Math.max(0, inspectedRecord.hydrationCups - 1))}
                      aria-label="Decrease fluid cups"
                    >
                      -
                    </Button>
                    <Text size="base" weight="bold">
                      {inspectedRecord.hydrationCups} cups logged
                    </Text>
                    <Button
                      variant="filled"
                      size="sm"
                      onPress={() => setHydrationCups(inspectedDay.dateStr, inspectedRecord.hydrationCups + 1)}
                      aria-label="Increase fluid cups"
                    >
                      +
                    </Button>
                  </Stack>
                </Stack>
              </Callout>
            )}
          </Stack>
        </DialogModal>
      )}
    </Stack>
  );
};
