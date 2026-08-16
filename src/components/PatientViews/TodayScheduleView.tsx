import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Droplets,
  Syringe,
  Info,
  HeartHandshake,
  CalendarCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useRegimen } from '../../context/RegimenContext';
import { useSettings } from '../../context/SettingsContext';
import {
  Button,
  Card,
  Heading,
  Text,
  Stack,
  Grid,
  Box,
  Badge,
  Callout,
  AccessibleCheckbox
} from '../common';
import {
  formatLongDate,
  formatISODate
} from '../../utils/dateUtils';

export const TodayScheduleView: React.FC = () => {
  const {
    regimen,
    adherence,
    todayDateStr,
    toggleMedicationCompleted,
    setHydrationCups,
    getDayInfoForDateStr
  } = useRegimen();

  const { settings, setSelectedDateStr } = useSettings();

  // Selected date for viewing / checklist
  const activeDateStr = settings.selectedDateStr || todayDateStr;
  const dayInfo = getDayInfoForDateStr(activeDateStr);

  const [expandedMedId, setExpandedMedId] = useState<string | null>(null);

  if (!dayInfo) {
    return (
      <Card variant="elevated" padding="lg">
        <Stack direction="column" align="center" gap="3" fullWidth>
          <Heading level={2} variant="h2">
            Selected date is outside regimen schedule
          </Heading>
          <Text size="base" color="muted">
            Please select a date between Cycle 1 Day 1 and Cycle {regimen.totalCycles} Day {regimen.cycleDurationDays}.
          </Text>
          <Button
            variant="filled"
            size="md"
            onPress={() => setSelectedDateStr(todayDateStr)}
          >
            Go to Today's Schedule
          </Button>
        </Stack>
      </Card>
    );
  }

  const currentDateRecord = adherence[activeDateStr] || { completedMedIds: [], hydrationCups: 0 };
  const allMedsCompleted =
    dayInfo.medications.length > 0 &&
    dayInfo.medications.every((m) => currentDateRecord.completedMedIds.includes(m.id));

  // Navigation handlers
  const handlePrevDay = () => {
    const prevDate = new Date(dayInfo.date);
    prevDate.setDate(prevDate.getDate() - 1);
    setSelectedDateStr(formatISODate(prevDate));
  };

  const handleNextDay = () => {
    const nextDate = new Date(dayInfo.date);
    nextDate.setDate(nextDate.getDate() + 1);
    setSelectedDateStr(formatISODate(nextDate));
  };

  const handleJumpToToday = () => {
    setSelectedDateStr(todayDateStr);
  };

  const handleMedToggle = (medId: string) => {
    toggleMedicationCompleted(activeDateStr, medId);

    // If this toggle completes all meds, fire celebratory confetti
    const willBeCompleted = !currentDateRecord.completedMedIds.includes(medId);
    if (willBeCompleted) {
      const remaining = dayInfo.medications.filter(
        (m) => m.id !== medId && !currentDateRecord.completedMedIds.includes(m.id)
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

  const getMedIconType = (medId: string) => {
    if (medId.includes('bortezomib')) return 'injection';
    if (medId.includes('dexa')) return 'steroid';
    return 'pill';
  };

  return (
    <Stack direction="column" gap="4" fullWidth>
      {/* Day Navigation & Date Header Card */}
      <Card
        variant={dayInfo.isToday ? 'elevated' : 'outlined'}
        padding="md"
        accentBorder={dayInfo.isToday ? 'primary' : 'none'}
      >
        <Stack direction="row" justify="between" align="center" wrap gap="3">
          {/* Previous Day Button */}
          <Button
            variant="outlined"
            size="md"
            onPress={handlePrevDay}
            aria-label="Previous day"
            leftIcon={<ChevronLeft size={20} />}
          >
            Prev Day
          </Button>

          {/* Current Day Central Indicator */}
          <Stack direction="column" align="center" gap="1">
            <Stack direction="row" align="center" gap="2" wrap justify="center">
              <Badge
                label={`Cycle ${dayInfo.cycleNumber} • Day ${dayInfo.cycleDay} of ${regimen.cycleDurationDays}`}
                color="primary"
              />
              {dayInfo.isToday && (
                <Badge
                  label="Today"
                  color="success"
                  iconType="pill"
                />
              )}
            </Stack>
            <Heading level={2} variant="h2">
              {formatLongDate(dayInfo.date)}
            </Heading>
          </Stack>

          {/* Next Day Button */}
          <Stack direction="row" gap="2" align="center">
            {!dayInfo.isToday && (
              <Button
                variant="filled-tonal"
                size="md"
                onPress={handleJumpToToday}
                aria-label="Jump to today's schedule"
                leftIcon={<CalendarCheck size={18} />}
              >
                Today
              </Button>
            )}
            <Button
              variant="outlined"
              size="md"
              onPress={handleNextDay}
              aria-label="Next day"
              rightIcon={<ChevronRight size={20} />}
            >
              Next Day
            </Button>
          </Stack>
        </Stack>
      </Card>

      {/* Special Clinic Visit Notice Banner (Bortezomib injection days) */}
      {dayInfo.hasClinicVisit && (
        <Callout
          variant="primary"
          icon={<Syringe size={28} />}
          title="🏥 Clinic Appointment Required Today"
        >
          <Text size="sm">
            <strong>Bortezomib (Injection)</strong> is administered under the skin by the nurse at the oncology clinic. Please report any hand/foot tingling or numbness before receiving the shot.
          </Text>
        </Callout>
      )}

      {/* Hydration Tracker Alert Banner (Cyclophosphamide days) */}
      {dayInfo.requiresHydrationAlert && (
        <Callout
          variant="warning"
          icon={<Droplets size={28} />}
          title="💧 High Hydration Day (Cyclophosphamide)"
          action={
            <Box padding="2" backgroundColor="surfaceBright" borderRadius="m">
              <Stack direction="row" align="center" gap="2">
                <Button
                  variant="outlined"
                  size="sm"
                  onPress={() => setHydrationCups(activeDateStr, currentDateRecord.hydrationCups - 1)}
                  aria-label="Decrease cups of water"
                  isDisabled={currentDateRecord.hydrationCups <= 0}
                >
                  -
                </Button>
                <Stack direction="column" align="center" gap="0">
                  <Text size="lg" weight="extrabold" color="primary">
                    {currentDateRecord.hydrationCups} / 10
                  </Text>
                  <Text size="xs" weight="bold">Cups Logged</Text>
                </Stack>
                <Button
                  variant="filled"
                  size="sm"
                  onPress={() => setHydrationCups(activeDateStr, currentDateRecord.hydrationCups + 1)}
                  aria-label="Increase cups of water"
                >
                  +
                </Button>
              </Stack>
            </Box>
          }
        >
          <Text size="sm">
            Drink <strong>8 to 12 cups (2-3 Liters)</strong> of water or fluids throughout the day to protect your bladder and kidneys.
          </Text>
        </Callout>
      )}

      {/* Primary Medication Checklist Card */}
      <Card variant="elevated" padding="md">
        <Stack direction="column" gap="4">
          <Stack direction="row" justify="between" align="center" wrap gap="2">
            <Stack direction="column" gap="0_5">
              <Heading level={2} variant="h3">
                Medications Due Today
              </Heading>
              <Text size="sm" color="muted">
                Check off each medication after taking or receiving it.
              </Text>
            </Stack>

            {allMedsCompleted && (
              <Badge
                label="All Done For Today!"
                color="success"
              />
            )}
          </Stack>

          {/* Rest Day Message if No Medications */}
          {dayInfo.isRestDay ? (
            <Callout
              variant="rest"
              icon={<HeartHandshake size={32} color="var(--md-sys-color-primary)" />}
              title="🎉 Rest & Recovery Day"
            >
              <Text size="sm" color="muted">
                No chemotherapy medications or injections are scheduled for today. Rest, eat nutritious meals, and stay comfortably hydrated.
              </Text>
            </Callout>
          ) : (
            <Stack direction="column" gap="3">
              {dayInfo.medications.map((med) => {
                const isChecked = currentDateRecord.completedMedIds.includes(med.id);
                const isExpanded = expandedMedId === med.id;

                return (
                  <Card
                    key={med.id}
                    variant={isChecked ? 'flat' : 'outlined'}
                    padding="md"
                    accentBorder={isChecked ? 'success' : med.badgeColor}
                  >
                    <Stack direction="column" gap="3">
                      <Stack direction="row" justify="between" align="start" wrap gap="3">
                        <Stack direction="column" gap="0" fullWidth>
                          <AccessibleCheckbox
                            isSelected={isChecked}
                            onChange={() => handleMedToggle(med.id)}
                            label={med.patientFriendlyName}
                            subLabel={`${med.route} • ${med.instructions}`}
                            aria-label={`Mark ${med.patientFriendlyName} as ${isChecked ? 'not taken' : 'taken'}`}
                          />
                        </Stack>

                        <Stack direction="row" align="center" gap="2">
                          <Badge
                            label={med.route}
                            color={med.badgeColor}
                            iconType={getMedIconType(med.id)}
                          />

                          <Button
                            variant="outlined"
                            size="sm"
                            onPress={() => setExpandedMedId(isExpanded ? null : med.id)}
                            aria-label={`Show more details about ${med.patientFriendlyName}`}
                            leftIcon={<Info size={16} />}
                          >
                            {isExpanded ? 'Hide Info' : 'Why Take This?'}
                          </Button>
                        </Stack>
                      </Stack>

                      {/* Expanded Plain-Language Guide Accordion */}
                      {isExpanded && (
                        <Box padding="3" backgroundColor="surfaceContainerLow" borderRadius="m">
                          <Grid columns="repeat(auto-fit, minmax(220px, 1fr))" gap="3">
                            <Stack direction="column" gap="0_5">
                              <Text size="sm" weight="bold">🎯 Purpose:</Text>
                              <Text size="sm">{med.guide.purpose}</Text>
                            </Stack>
                            <Stack direction="column" gap="0_5">
                              <Text size="sm" weight="bold">📋 How to Take:</Text>
                              <Text size="sm">{med.guide.howToTake}</Text>
                            </Stack>
                            <Stack direction="column" gap="0_5">
                              <Text size="sm" weight="bold" color="error">⚠️ Important Precautions:</Text>
                              <Text size="sm" color="error">{med.guide.keyPrecautions}</Text>
                            </Stack>
                          </Grid>
                        </Box>
                      )}
                    </Stack>
                  </Card>
                );
              })}
            </Stack>
          )}
        </Stack>
      </Card>

      {/* Special Regimen Instructions Card */}
      {regimen.specialInstructions && regimen.specialInstructions.length > 0 && (
        <Card variant="flat" padding="md">
          <Stack direction="column" gap="2">
            <Heading level={3} variant="h4">
              📌 Regimen Care Instructions
            </Heading>
            <Stack direction="column" gap="1">
              {regimen.specialInstructions.map((inst, index) => (
                <Text key={index} size="sm" weight="medium">
                  • {inst}
                </Text>
              ))}
            </Stack>
          </Stack>
        </Card>
      )}
    </Stack>
  );
};
