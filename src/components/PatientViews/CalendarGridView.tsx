import React, { useState } from 'react';
import {
  CheckCircle2,
  Droplets,
  ChevronLeft,
  ChevronRight,
  HeartHandshake
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
  Box,
  Badge,
  Callout,
  AccessibleCheckbox,
  DialogModal
} from '../common';
import {
  formatShortDate,
  formatLongDate
} from '../../utils/dateUtils';
import type { CalendarDayInfo, Medication } from '../../types/regimen';

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

  const getMedDisplay = (med: Medication) => {
    const id = med.id.toLowerCase();
    if (id.includes('bortezomib') || med.badgeColor === 'primary') {
      return {
        label: '💉 Bortezomib',
        badgeClass: 'calendar-day-med-badge-primary'
      };
    }
    if (id.includes('dexa') || id.includes('dexamethasone') || med.badgeColor === 'warning') {
      return {
        label: '⭐ Dexa',
        badgeClass: 'calendar-day-med-badge-warning'
      };
    }
    return {
      label: '💊 Cyclo',
      badgeClass: 'calendar-day-med-badge-tertiary'
    };
  };

  const weekDayHeaders = [
    'Day 1 / Mon',
    'Day 2 / Tue',
    'Day 3 / Wed',
    'Day 4 / Thu',
    'Day 5 / Fri',
    'Day 6 / Sat',
    'Day 7 / Sun'
  ];

  return (
    <Stack direction="column" gap="5" fullWidth>
      {/* Calendar Header & Cycle Controls */}
      <Card variant="elevated" padding="md">
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
                Cycle {activeCycle} of {regimen.totalCycles} (28-Day Grid)
              </Heading>
              <Text size="sm" color="muted">
                Click on any day to view details, record medications, or log fluids.
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

      {/* Medication Visual Key */}
      <Card variant="flat" padding="sm">
        <Stack direction="row" align="center" justify="between" wrap gap="3">
          <Stack direction="row" align="center" gap="3" wrap>
            <Text size="sm" weight="bold">
              Medication Key:
            </Text>
            <Badge label="Bortezomib (Injection)" color="primary" iconType="injection" />
            <Badge label="Cyclophosphamide (Pill)" color="tertiary" iconType="pill" />
            <Badge label="Dexamethasone (Pill)" color="warning" iconType="pill" />
          </Stack>

          <Stack direction="row" align="center" gap="1_5">
            <CheckCircle2 size={18} color="var(--md-sys-color-success)" />
            <Text size="sm" weight="bold" color="success">
              = Taken
            </Text>
          </Stack>
        </Stack>
      </Card>

      {/* 28-Day Grid Surface */}
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
              const isCompleted =
                day.medications.length > 0 &&
                day.medications.every((m) => dayRecord.completedMedIds.includes(m.id));

              return (
                <Card
                  key={day.cycleDay}
                  variant={day.isToday ? 'elevated' : 'interactive'}
                  padding="sm"
                  accentBorder={day.isToday ? 'primary' : 'none'}
                  onClick={() => handleCellClick(day)}
                  role="button"
                  aria-label={`Cycle ${day.cycleNumber}, Day ${day.cycleDay}, ${formatLongDate(day.date)}. ${
                    day.isRestDay
                      ? 'Rest day'
                      : `${day.medications.length} medications scheduled`
                  }`}
                  className={clsx('calendar-day-card', {
                    'calendar-day-card-today': day.isToday,
                    'calendar-day-card-completed': isCompleted,
                    'calendar-day-card-rest': day.isRestDay
                  })}
                >
                  <Stack direction="column" gap="1_5" fullWidth>
                    {/* Day Number and Date header */}
                    <Stack direction="row" justify="between" align="center" className="calendar-cell-header">
                      <Heading level={4} variant="h4">
                        Day {day.cycleDay}
                      </Heading>
                      <Caption>
                        {formatShortDate(day.date)}
                      </Caption>
                    </Stack>

                    {/* Day Content Badges */}
                    <Stack direction="column" gap="1" fullWidth>
                      {day.isRestDay ? (
                        <Text size="xs" color="muted" italic>
                          Rest Day
                        </Text>
                      ) : (
                        day.medications.map((med) => {
                          const isMedDone = dayRecord.completedMedIds.includes(med.id);
                          const { label, badgeClass } = getMedDisplay(med);

                          return (
                            <div
                              key={med.id}
                              className={clsx('calendar-day-med-badge', badgeClass, {
                                'calendar-med-done': isMedDone
                              })}
                            >
                              <span>{label}</span>
                              {isMedDone && <CheckCircle2 size={13} />}
                            </div>
                          );
                        })
                      )}
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
          title={`Cycle ${inspectedDay.cycleNumber} • Day ${inspectedDay.cycleDay}`}
          subtitle={formatLongDate(inspectedDay.date)}
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
                <Heading level={3} variant="h4">
                  Medications for Day {inspectedDay.cycleDay}
                </Heading>
                <Stack direction="column" gap="2">
                  {inspectedDay.medications.map((med) => {
                    const isChecked = inspectedRecord.completedMedIds.includes(med.id);
                    return (
                      <Card
                        key={med.id}
                        variant="outlined"
                        padding="sm"
                        accentBorder={med.badgeColor}
                      >
                        <AccessibleCheckbox
                          isSelected={isChecked}
                          onChange={() => toggleMedicationCompleted(inspectedDay.dateStr, med.id)}
                          label={med.patientFriendlyName}
                          subLabel={`${med.dose ? `${med.dose} • ` : ''}${med.route} — ${med.instructions}`}
                        />
                      </Card>
                    );
                  })}
                </Stack>
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
