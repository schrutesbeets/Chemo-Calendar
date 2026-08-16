import React from 'react';
import { useRegimen } from '../../context/RegimenContext';
import { useSettings } from '../../context/SettingsContext';
import { getDateForCycleAndDay, formatShortDate } from '../../utils/dateUtils';
import { Button, Text } from '../common';

export const CycleSelector: React.FC = () => {
  const { regimen } = useRegimen();
  const { settings, setActiveCycle } = useSettings();

  const cycles = Array.from({ length: regimen.totalCycles }, (_, i) => i + 1);

  return (
    <div className="cycle-selector-bar no-print">
      <Text size="sm" weight="bold">
        Select Cycle:
      </Text>
      {cycles.map((cycleNum) => {
        const isSelected = settings.activeCycle === cycleNum;
        const startDate = getDateForCycleAndDay(
          regimen.cycleStartDate,
          regimen.cycleDurationDays,
          cycleNum,
          1
        );
        const endDate = getDateForCycleAndDay(
          regimen.cycleStartDate,
          regimen.cycleDurationDays,
          cycleNum,
          regimen.cycleDurationDays
        );

        const dateRangeStr = `${formatShortDate(startDate)} - ${formatShortDate(endDate)}`;

        return (
          <Button
            key={cycleNum}
            onPress={() => setActiveCycle(cycleNum)}
            aria-label={`Cycle ${cycleNum}: ${dateRangeStr}`}
            variant={isSelected ? 'filled' : 'outlined'}
            className="cycle-pill-btn"
          >
            <span>Cycle {cycleNum}</span>
            <span className="cycle-pill-date">
              {dateRangeStr}
            </span>
          </Button>
        );
      })}
    </div>
  );
};
