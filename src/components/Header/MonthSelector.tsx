import React from 'react';
import { useRegimen } from '../../context/RegimenContext';
import { useSettings } from '../../context/SettingsContext';
import { getRegimenMonths } from '../../utils/dateUtils';
import { Button, Text, Caption, Stack, Select } from '../common';

export const MonthSelector: React.FC = () => {
  const { regimen } = useRegimen();
  const { settings, setActiveMonth } = useSettings();

  const months = getRegimenMonths(
    regimen.cycleStartDate,
    regimen.cycleDurationDays,
    regimen.totalCycles
  );

  const selectOptions = months.map((m) => ({
    value: m.monthKey,
    label: m.label,
    sublabel: m.cycleRangeLabel
  }));

  return (
    <div className="month-selector-wrapper no-print">
      {/* Mobile Dropdown View (visible <= 640px) */}
      <div className="month-selector-mobile">
        <Select
          label="Select Calendar Month:"
          value={settings.activeMonth || (months[0] ? months[0].monthKey : '')}
          options={selectOptions}
          onChange={(e) => setActiveMonth(e.target.value)}
          aria-label="Select calendar month"
        />
      </div>

      {/* Desktop Horizontal Pills View (visible > 640px) */}
      <div className="month-selector-desktop">
        <Stack
          direction="row"
          align="center"
          gap="2"
          wrap
          role="radiogroup"
          aria-label="Select calendar month"
        >
          <Text size="sm" weight="bold">
            Select Month:
          </Text>
          {months.map((m) => {
            const isSelected = settings.activeMonth === m.monthKey;

            return (
              <Button
                key={m.monthKey}
                onPress={() => setActiveMonth(m.monthKey)}
                aria-label={`${m.label} (${m.cycleRangeLabel})`}
                variant={isSelected ? 'filled' : 'outlined'}
                className="cycle-pill-btn"
              >
                <Stack direction="column" align="center" gap="0">
                  <Text size="sm" weight="bold" color="inherit">
                    {m.label}
                  </Text>
                  <Caption>
                    {m.cycleRangeLabel}
                  </Caption>
                </Stack>
              </Button>
            );
          })}
        </Stack>
      </div>
    </div>
  );
};

