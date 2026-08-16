import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Droplets,
  HeartHandshake
} from 'lucide-react';
import confetti from 'canvas-confetti';
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
  ProgressBar,
  Callout,
  AccessibleCheckbox,
  DialogModal
} from '../common';
import {
  getDateForCycleAndDay,
  formatWeekdayAndDate,
  formatShortDate,
  formatISODate,
  formatLongDate
} from '../../utils/dateUtils';
import type { CalendarDayInfo } from '../../types/regimen';

export const DayTableView: React.FC = () => {
  const {
    regimen,
    adherence,
    todayDateStr,
    toggleMedicationCompleted,
    setHydrationCups,
    getDayInfoForDateStr
  } = useRegimen();

  const { settings, setActiveCycle } = useSettings();
  const [inspectedDay, setInspectedDay] = useState<CalendarDayInfo | null>(null);

  const activeCycle = settings.activeCycle || 1;
  const days = Array.from({ length: regimen.cycleDurationDays }, (_, i) => i + 1);

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

  // Cycle navigation
  const handleCycleChange = (delta: number) => {
    const nextCycle = activeCycle + delta;
    if (nextCycle >= 1 && nextCycle <= regimen.totalCycles) {
      setActiveCycle(nextCycle);
    }
  };

  // Toggle medication completion
  const handleMedToggle = (dateStr: string, medId: string, dayNum: number) => {
    toggleMedicationCompleted(dateStr, medId);

    // Trigger confetti if all meds for this day are completed
    const dayRecord = adherence[dateStr] || { completedMedIds: [], hydrationCups: 0 };
    const willBeCompleted = !dayRecord.completedMedIds.includes(medId);
    if (willBeCompleted) {
      const scheduledMeds = regimen.medications.filter((m) => m.days.includes(dayNum));
      const remaining = scheduledMeds.filter(
        (m) => m.id !== medId && !dayRecord.completedMedIds.includes(m.id)
      );
      if (remaining.length === 0) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore if canvas-confetti is not supported
        }
      }
    }
  };

  // Inspect day details handler
  const handleInspectDay = (dateStr: string) => {
    const dayInfo = getDayInfoForDateStr(dateStr);
    if (dayInfo) {
      setInspectedDay(dayInfo);
    }
  };

  const inspectedRecord = inspectedDay
    ? adherence[inspectedDay.dateStr] || { completedMedIds: [], hydrationCups: 0 }
    : { completedMedIds: [], hydrationCups: 0 };

  // Calculate cycle progress
  let totalScheduledDoses = 0;
  let totalCompletedDoses = 0;
  days.forEach((dayNum) => {
    const date = getDateForCycleAndDay(
      regimen.cycleStartDate,
      regimen.cycleDurationDays,
      activeCycle,
      dayNum
    );
    const dateStr = formatISODate(date);
    const record = adherence[dateStr] || { completedMedIds: [], hydrationCups: 0 };
    regimen.medications.forEach((med) => {
      if (med.days.includes(dayNum)) {
        totalScheduledDoses++;
        if (record.completedMedIds.includes(med.id)) {
          totalCompletedDoses++;
        }
      }
    });
  });

  return (
    <Stack direction="column" gap="5" fullWidth>
      {/* Top Header Card with Cycle Controls and Progress */}
      <Card variant="elevated" padding="md">
        <Stack direction="column" gap="4">
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
                  Cycle {activeCycle} of {regimen.totalCycles} • Daily regimen schedule with medication cards and dose tracking.
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

          {/* Adherence Progress Bar */}
          <Box padding="3" backgroundColor="surfaceContainerLow" borderRadius="m">
            <ProgressBar
              value={totalCompletedDoses}
              maxValue={totalScheduledDoses}
              color="success"
              label="Cycle Adherence Progress"
              valueLabel={`${totalCompletedDoses} of ${totalScheduledDoses} doses taken (${totalScheduledDoses > 0
                ? Math.round((totalCompletedDoses / totalScheduledDoses) * 100)
                : 0
                }%)`}
            />
          </Box>
        </Stack>
      </Card>

      {/* Main Day Cards Stack */}
      <Stack direction="column" gap="4" fullWidth>
        {days.map((dayNum) => {
          const date = getDateForCycleAndDay(
            regimen.cycleStartDate,
            regimen.cycleDurationDays,
            activeCycle,
            dayNum
          );
          const dateStr = formatISODate(date);
          const formattedDateStr = formatWeekdayAndDate(date);
          const isToday = dateStr === todayDateStr;
          const dayRecord = adherence[dateStr] || { completedMedIds: [], hydrationCups: 0 };
          const scheduledMeds = regimen.medications.filter((m) => m.days.includes(dayNum));
          const isRestDay = scheduledMeds.length === 0;

          return (
            <Card
              key={dayNum}
              variant={isToday ? 'elevated' : 'outlined'}
              padding="md"
              accentBorder={isToday ? 'primary' : 'none'}
              className={clsx({
                'day-card-today': isToday,
                'day-card-rest': isRestDay
              })}
            >
              <Stack direction="column" gap="3">
                {/* Day Card Header */}
                <Stack direction="row" justify="between" align="center" wrap gap="2">
                  <Stack direction="row" align="center" gap="2" wrap>
                    <Heading level={3} variant="h3">
                      {formattedDateStr}
                    </Heading>
                    <Text size="sm" color="muted" weight="semibold">
                      • Day {dayNum}
                    </Text>
                    {isToday && <Badge label="TODAY" color="primary" />}
                    {isRestDay && <Badge label="Rest Day" color="secondary" />}
                  </Stack>

                  <Button
                    variant="outlined"
                    size="sm"
                    onPress={() => handleInspectDay(dateStr)}
                    aria-label={`View details for ${formattedDateStr} (Day ${dayNum})`}
                  >
                    Day Details
                  </Button>
                </Stack>

                {/* Day Card Content */}
                {isRestDay ? (
                  <Callout
                    variant="rest"
                    icon={<HeartHandshake size={24} color="var(--md-sys-color-secondary)" />}
                    title="Rest & Recovery Day"
                  >
                    <Text size="sm" color="muted">
                      No chemotherapy or steroid doses scheduled today. Stay well hydrated and allow your body time to rest.
                    </Text>
                  </Callout>
                ) : (
                  <Grid columns="repeat(auto-fit, minmax(260px, 1fr))" gap="3">
                    {scheduledMeds.map((med) => {
                      const isCompleted = dayRecord.completedMedIds.includes(med.id);
                      return (
                        <Card
                          key={med.id}
                          variant="flat"
                          padding="sm"
                          accentBorder={med.badgeColor}
                        >
                          <Stack direction="column" gap="2">
                            <AccessibleCheckbox
                              isSelected={isCompleted}
                              onChange={() => handleMedToggle(dateStr, med.id, dayNum)}
                              label={med.patientFriendlyName}
                              subLabel={`${med.dose ? `${med.dose} • ` : ''}${med.route}`}
                            />
                            {med.instructions && (
                              <Caption>
                                {med.instructions}
                              </Caption>
                            )}
                          </Stack>
                        </Card>
                      );
                    })}
                  </Grid>
                )}
              </Stack>
            </Card>
          );
        })}
      </Stack>

      {/* Day Details Modal */}
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
                          onChange={() =>
                            toggleMedicationCompleted(inspectedDay.dateStr, med.id)
                          }
                          label={`${med.patientFriendlyName}${med.dose ? ` • Dose: ${med.dose}` : ''}`}
                          subLabel={`${med.route} — ${med.instructions}`}
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
                      onPress={() =>
                        setHydrationCups(
                          inspectedDay.dateStr,
                          Math.max(0, inspectedRecord.hydrationCups - 1)
                        )
                      }
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
                      onPress={() =>
                        setHydrationCups(
                          inspectedDay.dateStr,
                          inspectedRecord.hydrationCups + 1
                        )
                      }
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
