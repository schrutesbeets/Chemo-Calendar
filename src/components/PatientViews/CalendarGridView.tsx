import React, { useState, useEffect, useMemo } from 'react';
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
  Moon,
  Calendar,
  Building2
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
  StickyHeader,
  CalendarDayCell,
  BottomSheet
} from '../common';
import {
  formatShortDate,
  formatLongDate,
  formatMonthYear,
  getDateForCycleAndDay,
  WEEKDAY_SHORT_NAMES
} from '../../utils/dateUtils';
import type { CalendarDayInfo, Medication } from '../../types/regimen';

const isClinicMedication = (med: Medication): boolean => {
  if (typeof med.isClinicOnly === 'boolean') {
    return med.isClinicOnly;
  }
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
    med.isClinicOnly ||
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
    todayDateStr,
    getCalendarDaysForMonth,
    getDayInfoForDateStr,
    toggleMedicationCompleted,
    setHydrationCups
  } = useRegimen();

  const { settings, setActiveMonth } = useSettings();
  const [inspectedDay, setInspectedDay] = useState<CalendarDayInfo | null>(null);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  // Month navigation state: initialized to active month or active cycle's start date
  const [viewDate, setViewDate] = useState<Date>(() => {
    if (settings.activeMonth) {
      const parts = settings.activeMonth.split('-');
      if (parts.length === 2) {
        return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, 1);
      }
    }
    return getDateForCycleAndDay(
      regimen.cycleStartDate,
      regimen.cycleDurationDays,
      settings.activeCycle || 1,
      1
    );
  });

  // Selected date for mobile matrix + bottom sheet details
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => todayDateStr);

  // Sync viewed month if active month changes in header
  useEffect(() => {
    if (settings.activeMonth) {
      const parts = settings.activeMonth.split('-');
      if (parts.length === 2) {
        const targetYear = parseInt(parts[0], 10);
        const targetMonth = parseInt(parts[1], 10) - 1;
        setViewDate(new Date(targetYear, targetMonth, 1));

        // If current selected date is not in this active month, select the 1st
        if (!selectedDateStr.startsWith(settings.activeMonth)) {
          setSelectedDateStr(`${settings.activeMonth}-01`);
        }
      }
    }
  }, [settings.activeMonth, selectedDateStr]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const days = getCalendarDaysForMonth(year, month);
  const monthTitle = formatMonthYear(viewDate);

  // Derive selected day info for the mobile bottom sheet
  const selectedDayInfo = useMemo(() => {
    return (
      days.find((d) => d.dateStr === selectedDateStr) ||
      getDayInfoForDateStr(selectedDateStr) ||
      days.find((d) => d.isToday) ||
      days[0] ||
      null
    );
  }, [days, selectedDateStr, getDayInfoForDateStr]);

  const selectedRecord = selectedDayInfo
    ? adherence[selectedDayInfo.dateStr] || { completedMedIds: [], hydrationCups: 0 }
    : { completedMedIds: [], hydrationCups: 0 };

  const inspectedRecord = inspectedDay
    ? adherence[inspectedDay.dateStr] || { completedMedIds: [], hydrationCups: 0 }
    : { completedMedIds: [], hydrationCups: 0 };

  const handleDesktopCellClick = (day: CalendarDayInfo) => {
    setSelectedDateStr(day.dateStr);
    setInspectedDay(day);
  };

  const handleMobileCellClick = (day: CalendarDayInfo) => {
    setSelectedDateStr(day.dateStr);
    if (day.isCurrentMonth === false) {
      const y = day.date.getFullYear();
      const m = String(day.date.getMonth() + 1).padStart(2, '0');
      setActiveMonth(`${y}-${m}`);
    }
    setIsMobileSheetOpen(true);
  };

  const handleMonthChange = (delta: number) => {
    const nextDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + delta, 1);
    setViewDate(nextDate);
    const y = nextDate.getFullYear();
    const m = String(nextDate.getMonth() + 1).padStart(2, '0');
    const newMonthKey = `${y}-${m}`;
    setActiveMonth(newMonthKey);
    setSelectedDateStr(`${newMonthKey}-01`);
  };

  const handleJumpToToday = () => {
    const today = new Date();
    setViewDate(today);
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    setActiveMonth(`${y}-${m}`);
    setSelectedDateStr(todayDateStr);

    requestAnimationFrame(() => {
      setTimeout(() => {
        const todayEl =
          document.getElementById('calendar-day-today') ||
          document.querySelector('.calendar-day-card-today');
        if (todayEl) {
          todayEl.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          });
        }
      }, 50);
    });
  };

  return (
    <Stack direction="column" gap="4" fullWidth>
      {/* Sticky Calendar Header */}
      <StickyHeader top="0" zIndex="10" fullWidth>
        <Card variant="elevated" padding="md">
          {/* Calendar Header & Month Controls */}
          <Stack direction="row" justify="between" align="center" wrap gap="3">
            <Stack direction="row" align="center" gap="3" wrap>
              <Button
                variant="outlined"
                size="md"
                onPress={() => handleMonthChange(-1)}
                leftIcon={<ChevronLeft size={20} />}
                aria-label="Previous Month"
              >
                Prev Month
              </Button>

              <Stack direction="column" gap="0_5">
                <Heading level={2} variant="h2">
                  {monthTitle}
                </Heading>
                <Text size="sm" color="muted">
                  Full Month View • Showing clinic visits &amp; injections • Click any day for full medication details or to log doses.
                </Text>
              </Stack>
            </Stack>

            <Stack direction="row" gap="2" align="center">
              <Button
                variant="filled-tonal"
                size="md"
                onPress={handleJumpToToday}
                leftIcon={<Calendar size={18} />}
                aria-label="Jump to Current Date"
              >
                Today
              </Button>
              <Button
                variant="outlined"
                size="md"
                onPress={() => handleMonthChange(1)}
                rightIcon={<ChevronRight size={20} />}
                aria-label="Next Month"
              >
                Next Month
              </Button>
            </Stack>
          </Stack>
        </Card>
      </StickyHeader>

      {/* =========================================================================
         Desktop Calendar Grid View (> 768px)
         ========================================================================= */}
      <div className="calendar-desktop-view">
        <Card variant="elevated" padding="md">
          <div className="calendar-grid-scroll-wrapper">
            <Grid columns="repeat(7, minmax(130px, 1fr))" gap="2_5">
              {/* Day of Week Column Headers: Sun - Sat */}
              {WEEKDAY_SHORT_NAMES.map((shortDay, idx) => (
                <Box
                  key={idx}
                  paddingY="1_5"
                  paddingX="1"
                  backgroundColor="surfaceContainer"
                  borderRadius="s"
                  className="text-center"
                >
                  <Text size="sm" weight="extrabold" color="muted">
                    {shortDay}
                  </Text>
                </Box>
              ))}

              {/* Monthly Calendar Cells */}
              {days.map((day) => {
                const dayRecord = adherence[day.dateStr] || { completedMedIds: [], hydrationCups: 0 };
                const clinicMeds = day.medications.filter(isClinicMedication);
                const hasClinicMeds = clinicMeds.length > 0;
                const isCompleted =
                  hasClinicMeds &&
                  clinicMeds.every((m) => dayRecord.completedMedIds.includes(m.id));

                return (
                  <Card
                    key={day.dateStr}
                    id={day.isToday ? 'calendar-day-today' : undefined}
                    variant={day.isToday ? 'elevated' : 'interactive'}
                    padding="sm"
                    accentBorder={day.isToday ? 'primary' : 'none'}
                    onClick={() => handleDesktopCellClick(day)}
                    role="button"
                    aria-label={`${formatLongDate(day.date)}${
                      day.isWithinRegimen ? ` (Cycle ${day.cycleNumber}, Day ${day.cycleDay})` : ''
                    }. ${
                      hasClinicMeds
                        ? `${clinicMeds.length} clinic medication(s) scheduled: ${clinicMeds.map((m) => m.patientFriendlyName || m.name).join(', ')}`
                        : day.isRestDay
                        ? 'Rest day'
                        : 'Home regimen day'
                    }`}
                    className={clsx('calendar-day-card', {
                      'calendar-day-card-today': day.isToday,
                      'calendar-day-card-completed': isCompleted,
                      'calendar-day-card-rest': day.isRestDay,
                      'calendar-day-card-other-month': day.isCurrentMonth === false
                    })}
                  >
                    <Stack direction="column" gap="1_5" fullWidth>
                      {/* Date and Cycle Day Number header */}
                      <Stack direction="row" justify="between" align="center" className="calendar-cell-header">
                        <Heading level={4} variant="h4">
                          {day.date.getDate() === 1 ? formatShortDate(day.date) : day.date.getDate()}
                        </Heading>
                        {day.isWithinRegimen && (
                          <Caption>
                            Day {day.cycleDay}
                          </Caption>
                        )}
                      </Stack>

                      {/* Day Content: Only Clinic-Delivered Medications */}
                      <Stack direction="column" gap="1" fullWidth>
                        {hasClinicMeds ? (
                          clinicMeds.map((med) => {
                            const isMedDone = dayRecord.completedMedIds.includes(med.id);
                            return (
                              <Badge
                                key={`${med.id}-${day.dateStr}-clinic`}
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
      </div>

      {/* =========================================================================
         Mobile Calendar View (<= 768px): Fit-to-Screen Matrix + Bottom Sheet UI
         ========================================================================= */}
      <div className="calendar-mobile-view">
        {/* 1. Fit-to-Screen Month Matrix Grid */}
        <Card variant="elevated" padding="sm">
          <div className="calendar-mobile-grid">
            {/* Weekday Column Headers (Sun..Sat) */}
            {WEEKDAY_SHORT_NAMES.map((shortDay) => (
              <Box
                key={shortDay}
                backgroundColor="surfaceContainer"
                borderRadius="s"
                className="calendar-mobile-weekday-header"
              >
                <Text size="xs" weight="extrabold" color="muted">
                  {shortDay}
                </Text>
              </Box>
            ))}

            {/* 35–42 Compact Day Cells */}
            {days.map((day) => {
              const isSelected = day.dateStr === (selectedDayInfo ? selectedDayInfo.dateStr : selectedDateStr);
              const clinicMeds = day.medications.filter(isClinicMedication);
              const hasClinicMeds = clinicMeds.length > 0;
              const dayRecord = adherence[day.dateStr] || { completedMedIds: [], hydrationCups: 0 };
              const isCompleted =
                hasClinicMeds &&
                clinicMeds.every((m) => dayRecord.completedMedIds.includes(m.id));

              return (
                <CalendarDayCell
                  key={`mobile-cell-${day.dateStr}`}
                  dayNumber={day.date.getDate()}
                  isSelected={isSelected}
                  isToday={day.isToday}
                  isCurrentMonth={day.isCurrentMonth}
                  isRestDay={day.isRestDay}
                  hasClinicVisit={hasClinicMeds}
                  isCompleted={isCompleted}
                  onPress={() => handleMobileCellClick(day)}
                  ariaLabel={`${formatLongDate(day.date)}${
                    day.isWithinRegimen ? ` (Cycle ${day.cycleNumber}, Day ${day.cycleDay})` : ''
                  }. ${
                    hasClinicMeds
                      ? `${clinicMeds.length} clinic medication(s) scheduled: ${clinicMeds.map((m) => m.patientFriendlyName || m.name).join(', ')}`
                      : day.isRestDay
                      ? 'Rest day'
                      : 'Home regimen day'
                  }`}
                  indicators={
                    <>
                      {hasClinicMeds && (
                        <Syringe
                          size={12}
                          strokeWidth={2.5}
                          color="var(--md-sys-color-primary)"
                          aria-hidden="true"
                        />
                      )}
                      {isCompleted && (
                        <CheckCircle2
                          size={12}
                          strokeWidth={2.5}
                          color="var(--md-sys-color-success)"
                          aria-hidden="true"
                        />
                      )}
                    </>
                  }
                />
              );
            })}
          </div>
        </Card>

        {/* 2. Accessible Bottom Sheet for Selected Day Details */}
        {selectedDayInfo && (
          <BottomSheet
            isOpen={isMobileSheetOpen}
            onClose={() => setIsMobileSheetOpen(false)}
            title={formatLongDate(selectedDayInfo.date)}
            subtitle={
              selectedDayInfo.isWithinRegimen
                ? `Cycle ${selectedDayInfo.cycleNumber} • Day ${selectedDayInfo.cycleDay}`
                : 'Outside Scheduled Regimen Cycle'
            }
            footer={
              <Stack direction="row" justify="end" fullWidth>
                <Button variant="filled" size="md" onPress={() => setIsMobileSheetOpen(false)}>
                  Done
                </Button>
              </Stack>
            }
          >
            <Stack direction="column" gap="4" fullWidth>
              {/* Day Status Badges */}
              <Stack direction="row" gap="1_5" align="center" wrap>
                {selectedDayInfo.isToday && (
                  <Badge label="TODAY" color="primary" size="sm" iconType="none" />
                )}
                {selectedDayInfo.isRestDay && selectedDayInfo.isWithinRegimen && (
                  <Badge label="REST DAY" color="secondary" size="sm" iconType="none" />
                )}
              </Stack>

              {/* Sheet Body: Rest Day vs Scheduled Meds */}
              {selectedDayInfo.isRestDay ? (
                <Callout
                  variant="rest"
                  icon={<HeartHandshake size={24} color="var(--md-sys-color-secondary)" aria-hidden="true" />}
                  title="Rest & Recovery Day"
                >
                  <Text size="sm" color="muted">
                    No medications are scheduled for today. Rest, recover, and stay well hydrated.
                  </Text>
                </Callout>
              ) : (
                <Stack direction="column" gap="3" fullWidth>
                  {(() => {
                    const sheetClinicMeds = (selectedDayInfo.medications || []).filter(isClinicMedication);
                    const sheetHomeMeds = (selectedDayInfo.medications || []).filter((m) => !isClinicMedication(m));
                    const sheetMorningMeds = sheetHomeMeds.filter(
                      (m: Medication) =>
                        !m.timeOfDay ||
                        m.timeOfDay === 'morning' ||
                        m.timeOfDay === 'split' ||
                        m.timeOfDay === 'anytime'
                    );
                    const sheetEveningMeds = sheetHomeMeds.filter(
                      (m: Medication) => m.timeOfDay === 'evening' || m.timeOfDay === 'split'
                    );

                    return (
                      <Stack direction="column" gap="3" fullWidth>
                        {/* Given at Clinic Section */}
                        {sheetClinicMeds.length > 0 && (
                          <Stack direction="column" gap="2" fullWidth>
                            <Stack direction="row" align="center" gap="1_5">
                              <Building2 size={16} color="var(--md-sys-color-secondary)" aria-hidden="true" />
                              <Typography variant="label" weight="bold" color="secondary">
                                Given at Clinic
                              </Typography>
                            </Stack>
                            <Stack direction="column" gap="2" fullWidth>
                              {sheetClinicMeds.map((med: Medication) => {
                                const isChecked = selectedRecord.completedMedIds.includes(med.id);
                                return (
                                  <Card
                                    key={`${med.id}-${selectedDayInfo.dateStr}-clinic`}
                                    variant="outlined"
                                    padding="sm"
                                    accentBorder={med.badgeColor}
                                  >
                                    <AccessibleCheckbox
                                      isSelected={isChecked}
                                      onChange={() => toggleMedicationCompleted(selectedDayInfo.dateStr, med.id)}
                                      label={med.patientFriendlyName || med.name || 'Medication'}
                                      subLabel={`${med.dose ? `${med.dose} • ` : ''}${med.route} — ${med.instructions}`}
                                    />
                                  </Card>
                                );
                              })}
                            </Stack>
                          </Stack>
                        )}

                        {/* Taken at Home — Morning (AM) Section */}
                        {sheetMorningMeds.length > 0 && (
                          <Stack direction="column" gap="2" fullWidth>
                            <Stack direction="row" align="center" gap="1_5">
                              <Sun size={16} color="var(--md-sys-color-secondary)" aria-hidden="true" />
                              <Typography variant="label" weight="bold" color="secondary">
                                Taken at Home — Morning / AM
                              </Typography>
                            </Stack>
                            <Stack direction="column" gap="2" fullWidth>
                              {sheetMorningMeds.map((med: Medication) => {
                                const isChecked = selectedRecord.completedMedIds.includes(med.id);
                                return (
                                  <Card
                                    key={`${med.id}-${selectedDayInfo.dateStr}-am`}
                                    variant="outlined"
                                    padding="sm"
                                    accentBorder={med.badgeColor}
                                  >
                                    <AccessibleCheckbox
                                      isSelected={isChecked}
                                      onChange={() => toggleMedicationCompleted(selectedDayInfo.dateStr, med.id)}
                                      label={med.patientFriendlyName || med.name || 'Medication'}
                                      subLabel={`${med.dose ? `${med.dose} • ` : ''}${med.route} — ${med.instructions}`}
                                    />
                                  </Card>
                                );
                              })}
                            </Stack>
                          </Stack>
                        )}

                        {/* Taken at Home — Evening (PM) Section */}
                        {sheetEveningMeds.length > 0 && (
                          <Stack direction="column" gap="2" fullWidth>
                            <Stack direction="row" align="center" gap="1_5">
                              <Moon size={16} color="var(--md-sys-color-secondary)" aria-hidden="true" />
                              <Typography variant="label" weight="bold" color="secondary">
                                Taken at Home — Evening / PM
                              </Typography>
                            </Stack>
                            <Stack direction="column" gap="2" fullWidth>
                              {sheetEveningMeds.map((med: Medication) => {
                                const isChecked = selectedRecord.completedMedIds.includes(med.id);
                                return (
                                  <Card
                                    key={`${med.id}-${selectedDayInfo.dateStr}-pm`}
                                    variant="outlined"
                                    padding="sm"
                                    accentBorder={med.badgeColor}
                                  >
                                    <AccessibleCheckbox
                                      isSelected={isChecked}
                                      onChange={() => toggleMedicationCompleted(selectedDayInfo.dateStr, med.id)}
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

              {/* Hydration Reminder / Logging */}
              {selectedDayInfo.requiresHydrationAlert && (
                <Callout
                  variant="warning"
                  icon={<Droplets size={24} aria-hidden="true" />}
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
                            selectedDayInfo.dateStr,
                            Math.max(0, selectedRecord.hydrationCups - 1)
                          )
                        }
                        aria-label="Decrease fluid cups"
                      >
                        -
                      </Button>
                      <Text size="base" weight="bold">
                        {selectedRecord.hydrationCups} cups logged
                      </Text>
                      <Button
                        variant="filled"
                        size="sm"
                        onPress={() =>
                          setHydrationCups(selectedDayInfo.dateStr, selectedRecord.hydrationCups + 1)
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
          </BottomSheet>
        )}
      </div>

      {/* =========================================================================
         Inspect Day Modal (Desktop Click Interaction)
         ========================================================================= */}
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
