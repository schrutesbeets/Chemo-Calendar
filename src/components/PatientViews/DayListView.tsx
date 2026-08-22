import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Building2,
  Syringe,
  Pill,
  Sparkles,
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
  Typography,
  Stack,
  Box,
  Badge,
  DialogModal,
  Callout,
  StickyHeader
} from '../common';
import {
  getDateForCycleAndDay,
  formatWeekdayAndDate,
  formatShortDate,
  formatISODate,
  formatLongDate,
  isMedicationScheduled,
  getRegimenMonths
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

const getMedicationIcon = (med: Medication, size: number = 16) => {
  const lowerId = med.id.toLowerCase();
  const lowerRoute = (med.route || '').toLowerCase();

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

export const DayListView: React.FC = () => {
  const { regimen, todayDateStr, getDayInfoForDateStr } = useRegimen();
  const { settings, setActiveCycle } = useSettings();
  const [inspectedDay, setInspectedDay] = useState<CalendarDayInfo | null>(null);
  const [isTableStuck, setIsTableStuck] = useState(false);
  const tableSentinelRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const sentinel = tableSentinelRef.current;
    if (!sentinel) return;

    const checkTableStuck = () => {
      const rect = sentinel.getBoundingClientRect();
      const mainHeaderEl = document.querySelector('.ds-sticky-header');
      const mainHeaderHeight = mainHeaderEl ? mainHeaderEl.getBoundingClientRect().height : 88;
      setIsTableStuck(rect.top <= mainHeaderHeight + 2);
    };

    const observer = new IntersectionObserver(
      () => checkTableStuck(),
      { threshold: [0, 1] }
    );

    observer.observe(sentinel);
    window.addEventListener('scroll', checkTableStuck, { passive: true });
    window.addEventListener('resize', checkTableStuck, { passive: true });
    checkTableStuck();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', checkTableStuck);
      window.removeEventListener('resize', checkTableStuck);
    };
  }, []);

  // Synchronize active cycle and scroll targets when activeMonth changes
  useEffect(() => {
    if (!settings.activeMonth) return;

    const regimenMonths = getRegimenMonths(
      regimen.cycleStartDate,
      regimen.cycleDurationDays,
      regimen.totalCycles
    );
    const targetMonthInfo = regimenMonths.find((m) => m.monthKey === settings.activeMonth);

    if (targetMonthInfo && !targetMonthInfo.activeCycles.includes(activeCycle)) {
      setActiveCycle(targetMonthInfo.primaryCycle);
    }

    const timer = setTimeout(() => {
      const targetRow = document.querySelector(`[data-month="${settings.activeMonth}"]`);
      if (targetRow) {
        targetRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [
    settings.activeMonth,
    regimen.cycleStartDate,
    regimen.cycleDurationDays,
    regimen.totalCycles,
    activeCycle,
    setActiveCycle
  ]);

  const handleCycleChange = (delta: number) => {
    const nextCycle = activeCycle + delta;
    if (nextCycle >= 1 && nextCycle <= regimen.totalCycles) {
      setActiveCycle(nextCycle);
    }
  };

  const handleInspectDay = (dateStr: string) => {
    const dayInfo = getDayInfoForDateStr(dateStr);
    if (dayInfo) {
      setInspectedDay(dayInfo);
    }
  };

  return (
    <Stack direction="column" gap="5" fullWidth>
      {/* Top Header Card with Cycle Controls */}
      <StickyHeader top="0" zIndex="10" fullWidth>
        <Card variant="elevated" padding="md">
          <Stack direction="row" justify="between" align="center" wrap gap="3">
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

            <Stack direction="column" gap="0_5" align="center">
              <Heading level={2} variant="h2">
                {cycleDateRange}
              </Heading>
              <Text size="sm" color="muted">
                Cycle {activeCycle} of {regimen.totalCycles} • Daily Clinic vs. Home Medication &amp; Dosage Schedule
              </Text>
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

      {/* Table Sentinel for Sticky Position Detection */}
      <div ref={tableSentinelRef} className="ds-sticky-sentinel" aria-hidden="true" />

      {/* Spreadsheet List Container */}
      <div
        className={clsx('day-list-table-container', {
          'is-stuck': isTableStuck
        })}
        data-stuck={isTableStuck ? 'true' : undefined}
      >
        <table className="day-list-table" aria-label="Daily Regimen Medication Spreadsheet">
          <thead>
            <tr>
              <th scope="col" className={clsx('day-list-th day-list-th-day', { 'is-stuck': isTableStuck })}>
                Date &amp; Day
              </th>
              <th scope="col" className={clsx('day-list-th day-list-th-meds', { 'is-stuck': isTableStuck })}>
                Medication &amp; Dosage Schedule (Clinic vs. Home)
              </th>
            </tr>
          </thead>
          <tbody>
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
              const scheduledMeds = regimen.medications.filter((m) =>
                isMedicationScheduled(m, { date, cycleDay: dayNum, cycleNumber: activeCycle })
              );
              const isRestDay = scheduledMeds.length === 0;

              const clinicMeds = scheduledMeds.filter(isClinicMedication);
              const homeMeds = scheduledMeds.filter((m) => !isClinicMedication(m));

              const homeMorningMeds = homeMeds.filter(
                (m) => !m.timeOfDay || m.timeOfDay === 'morning' || m.timeOfDay === 'split' || m.timeOfDay === 'anytime'
              );
              const homeEveningMeds = homeMeds.filter(
                (m) => m.timeOfDay === 'evening' || m.timeOfDay === 'split'
              );

              return (
                <tr
                  key={dayNum}
                  id={`day-list-row-${dateStr}`}
                  data-month={dateStr.slice(0, 7)}
                  className={clsx('day-list-row', {
                    'day-list-row-today': isToday,
                    'day-list-row-rest': isRestDay
                  })}
                >
                  {/* Column 1: Date First IA Hierarchy with Sticky Stack */}
                  <td className="day-list-td day-list-td-day">
                    <Stack direction="column" gap="1" className="day-list-day-sticky-stack">
                      <Stack direction="row" align="center" gap="1_5" wrap>
                        <Heading level={4} variant="h4">
                          {formattedDateStr}
                        </Heading>
                        {isToday && (
                          <Badge label="TODAY" color="primary" size="sm" iconType="none" />
                        )}
                      </Stack>
                      <Caption>
                        Day {dayNum} • Cycle {activeCycle}
                      </Caption>
                      <Button
                        variant="filled-tonal"
                        size="sm"
                        onPress={() => handleInspectDay(dateStr)}
                        aria-label={`View details for ${formattedDateStr}`}
                      >
                        Day Details
                      </Button>
                    </Stack>
                  </td>

                  {/* Column 2: Vertically Segmented Medication List using Standard Primitives */}
                  <td className="day-list-td day-list-td-meds">
                    {isRestDay ? (
                      <Stack direction="row" align="center" gap="1_5">
                        <HeartHandshake size={18} aria-hidden="true" />
                        <Text size="md" color="muted" italic>
                          Rest &amp; Recovery Day (No medications scheduled)
                        </Text>
                      </Stack>
                    ) : (
                      <Stack direction="column" gap="3" fullWidth>
                        {/* 1. Given at Clinic Segment */}
                        {clinicMeds.length > 0 && (
                          <Stack direction="column" gap="2" fullWidth>
                            <Stack direction="row" align="center" gap="1_5">
                              <Building2 size={16} aria-hidden="true" />
                              <Typography variant="label" weight="bold" color="secondary">
                                Given at Clinic
                              </Typography>
                            </Stack>
                            <Stack direction="column" gap="1_5" fullWidth>
                              {clinicMeds.map((med) => (
                                <Card
                                  key={`${med.id}-clinic`}
                                  variant="outlined"
                                  padding="sm"
                                  accentBorder={med.badgeColor}
                                >
                                  <Stack direction="row" justify="between" align="center" gap="3" wrap fullWidth>
                                    <Stack direction="row" align="center" gap="2_5">
                                      <Box aria-hidden="true">
                                        {getMedicationIcon(med, 18)}
                                      </Box>
                                      <Stack direction="column" gap="0_5">
                                        <Text size="base" weight="bold">
                                          {med.patientFriendlyName}
                                        </Text>
                                        {med.route && (
                                          <Text size="sm" color="muted">
                                            {med.route}
                                          </Text>
                                        )}
                                      </Stack>
                                    </Stack>

                                    {med.dose && (
                                      <Badge
                                        label={med.dose}
                                        color={med.badgeColor}
                                        variant="tonal"
                                        size="sm"
                                        iconType="none"
                                      />
                                    )}
                                  </Stack>
                                </Card>
                              ))}
                            </Stack>
                          </Stack>
                        )}

                        {/* Divider between Clinic and Home if both exist */}
                        {clinicMeds.length > 0 && homeMeds.length > 0 && (
                          <div className="day-list-divider" role="separator" aria-hidden="true" />
                        )}

                        {/* 2. Taken at Home — Morning (AM) Segment */}
                        {homeMorningMeds.length > 0 && (
                          <Stack direction="column" gap="2" fullWidth>
                            <Stack direction="row" align="center" gap="1_5">
                              <Sun size={16} aria-hidden="true" />
                              <Typography variant="label" weight="bold" color="secondary">
                                Taken at Home — Morning / AM
                              </Typography>
                            </Stack>
                            <Stack direction="column" gap="1_5" fullWidth>
                              {homeMorningMeds.map((med) => (
                                <Card
                                  key={`${med.id}-am`}
                                  variant="outlined"
                                  padding="sm"
                                  accentBorder={med.badgeColor}
                                >
                                  <Stack direction="row" justify="between" align="center" gap="3" wrap fullWidth>
                                    <Stack direction="row" align="center" gap="2_5">
                                      <Box aria-hidden="true">
                                        {getMedicationIcon(med, 18)}
                                      </Box>
                                      <Stack direction="column" gap="0_5">
                                        <Text size="base" weight="bold">
                                          {med.patientFriendlyName}
                                        </Text>
                                        {med.route && (
                                          <Text size="sm" color="muted">
                                            {med.route}
                                          </Text>
                                        )}
                                      </Stack>
                                    </Stack>

                                    {med.dose && (
                                      <Badge
                                        label={med.dose}
                                        color={med.badgeColor}
                                        variant="tonal"
                                        size="sm"
                                        iconType="none"
                                      />
                                    )}
                                  </Stack>
                                </Card>
                              ))}
                            </Stack>
                          </Stack>
                        )}

                        {/* Divider between Home Morning and Home Evening if both exist */}
                        {homeMorningMeds.length > 0 && homeEveningMeds.length > 0 && (
                          <div className="day-list-divider" role="separator" aria-hidden="true" />
                        )}

                        {/* 3. Taken at Home — Evening (PM) Segment */}
                        {homeEveningMeds.length > 0 && (
                          <Stack direction="column" gap="2" fullWidth>
                            <Stack direction="row" align="center" gap="1_5">
                              <Moon size={16} aria-hidden="true" />
                              <Typography variant="label" weight="bold" color="secondary">
                                Taken at Home — Evening / PM
                              </Typography>
                            </Stack>
                            <Stack direction="column" gap="1_5" fullWidth>
                              {homeEveningMeds.map((med) => (
                                <Card
                                  key={`${med.id}-pm`}
                                  variant="outlined"
                                  padding="sm"
                                  accentBorder={med.badgeColor}
                                >
                                  <Stack direction="row" justify="between" align="center" gap="3" wrap fullWidth>
                                    <Stack direction="row" align="center" gap="2_5">
                                      <Box aria-hidden="true">
                                        {getMedicationIcon(med, 18)}
                                      </Box>
                                      <Stack direction="column" gap="0_5">
                                        <Text size="base" weight="bold">
                                          {med.patientFriendlyName}
                                        </Text>
                                        {med.route && (
                                          <Text size="sm" color="muted">
                                            {med.route}
                                          </Text>
                                        )}
                                      </Stack>
                                    </Stack>

                                    {med.dose && (
                                      <Badge
                                        label={med.dose}
                                        color={med.badgeColor}
                                        variant="tonal"
                                        size="sm"
                                        iconType="none"
                                      />
                                    )}
                                  </Stack>
                                </Card>
                              ))}
                            </Stack>
                          </Stack>
                        )}
                      </Stack>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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
                icon={<HeartHandshake size={24} aria-hidden="true" />}
                title="Rest and Recovery Day"
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
                  const modalClinicMeds = inspectedDay.medications.filter(isClinicMedication);
                  const modalHomeMeds = inspectedDay.medications.filter((m) => !isClinicMedication(m));
                  const modalHomeMorningMeds = modalHomeMeds.filter(
                    (m) => !m.timeOfDay || m.timeOfDay === 'morning' || m.timeOfDay === 'split' || m.timeOfDay === 'anytime'
                  );
                  const modalHomeEveningMeds = modalHomeMeds.filter(
                    (m) => m.timeOfDay === 'evening' || m.timeOfDay === 'split'
                  );

                  return (
                    <Stack direction="column" gap="3">
                      {/* Clinic Meds in Modal */}
                      {modalClinicMeds.length > 0 && (
                        <Stack direction="column" gap="2">
                          <Stack direction="row" align="center" gap="1_5">
                            <Building2 size={16} aria-hidden="true" />
                            <Typography variant="label" weight="bold" color="secondary">
                              Given at Clinic
                            </Typography>
                          </Stack>
                          {modalClinicMeds.map((med: Medication) => (
                            <Card
                              key={med.id}
                              variant="outlined"
                              padding="sm"
                              accentBorder={med.badgeColor}
                            >
                              <Stack direction="column" gap="1">
                                <Stack direction="row" justify="between" align="center" gap="2" wrap>
                                  <Text size="base" weight="bold">
                                    {med.patientFriendlyName}
                                  </Text>
                                  {med.dose && (
                                    <Badge
                                      color={med.badgeColor}
                                      variant="tonal"
                                      size="sm"
                                      label={med.dose}
                                      iconType="none"
                                    />
                                  )}
                                </Stack>
                                <Text size="sm" color="muted">
                                  {med.route} — {med.instructions}
                                </Text>
                              </Stack>
                            </Card>
                          ))}
                        </Stack>
                      )}

                      {/* Home Morning Meds in Modal */}
                      {modalHomeMorningMeds.length > 0 && (
                        <Stack direction="column" gap="2">
                          <Stack direction="row" align="center" gap="1_5">
                            <Sun size={16} aria-hidden="true" />
                            <Typography variant="label" weight="bold" color="secondary">
                              Taken at Home — Morning / AM
                            </Typography>
                          </Stack>
                          {modalHomeMorningMeds.map((med: Medication) => (
                            <Card
                              key={`${med.id}-am`}
                              variant="outlined"
                              padding="sm"
                              accentBorder={med.badgeColor}
                            >
                              <Stack direction="column" gap="1">
                                <Stack direction="row" justify="between" align="center" gap="2" wrap>
                                  <Text size="base" weight="bold">
                                    {med.patientFriendlyName}
                                  </Text>
                                  {med.dose && (
                                    <Badge
                                      color={med.badgeColor}
                                      variant="tonal"
                                      size="sm"
                                      label={med.dose}
                                      iconType="none"
                                    />
                                  )}
                                </Stack>
                                <Text size="sm" color="muted">
                                  {med.route} — {med.instructions}
                                </Text>
                              </Stack>
                            </Card>
                          ))}
                        </Stack>
                      )}

                      {/* Home Evening Meds in Modal */}
                      {modalHomeEveningMeds.length > 0 && (
                        <Stack direction="column" gap="2">
                          <Stack direction="row" align="center" gap="1_5">
                            <Moon size={16} aria-hidden="true" />
                            <Typography variant="label" weight="bold" color="secondary">
                              Taken at Home — Evening / PM
                            </Typography>
                          </Stack>
                          {modalHomeEveningMeds.map((med: Medication) => (
                            <Card
                              key={`${med.id}-pm`}
                              variant="outlined"
                              padding="sm"
                              accentBorder={med.badgeColor}
                            >
                              <Stack direction="column" gap="1">
                                <Stack direction="row" justify="between" align="center" gap="2" wrap>
                                  <Text size="base" weight="bold">
                                    {med.patientFriendlyName}
                                  </Text>
                                  {med.dose && (
                                    <Badge
                                      color={med.badgeColor}
                                      variant="tonal"
                                      size="sm"
                                      label={med.dose}
                                      iconType="none"
                                    />
                                  )}
                                </Stack>
                                <Text size="sm" color="muted">
                                  {med.route} — {med.instructions}
                                </Text>
                              </Stack>
                            </Card>
                          ))}
                        </Stack>
                      )}
                    </Stack>
                  );
                })()}
              </Stack>
            )}
          </Stack>
        </DialogModal>
      )}
    </Stack>
  );
};
