import React from 'react';
import { Button as AriaButton } from 'react-aria-components';
import clsx from 'clsx';

export interface CalendarDayCellProps {
  dayNumber: number;
  isSelected?: boolean;
  isToday?: boolean;
  isCurrentMonth?: boolean;
  isRestDay?: boolean;
  hasClinicVisit?: boolean;
  isCompleted?: boolean;
  onPress?: () => void;
  ariaLabel?: string;
  className?: string;
  indicators?: React.ReactNode;
  children?: React.ReactNode;
}

export const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  dayNumber,
  isSelected = false,
  isToday = false,
  isCurrentMonth = true,
  isRestDay = false,
  hasClinicVisit = false,
  isCompleted = false,
  onPress,
  ariaLabel,
  className,
  indicators,
  children
}) => {
  return (
    <AriaButton
      onPress={onPress}
      aria-label={ariaLabel}
      aria-pressed={isSelected}
      className={clsx(
        'react-aria-Button',
        'calendar-mobile-cell',
        {
          'calendar-mobile-cell--selected': isSelected,
          'calendar-mobile-cell--today': isToday,
          'calendar-mobile-cell--other-month': !isCurrentMonth,
          'calendar-mobile-cell--rest': isRestDay,
          'calendar-mobile-cell--clinic': hasClinicVisit,
          'calendar-mobile-cell--completed': isCompleted
        },
        className
      )}
    >
      <span className="calendar-mobile-cell-num">{dayNumber}</span>
      {indicators && (
        <span className="calendar-mobile-cell-indicators" aria-hidden="true">
          {indicators}
        </span>
      )}
      {children}
    </AriaButton>
  );
};
