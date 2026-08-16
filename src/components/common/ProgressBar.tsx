import React from 'react';
import {
  ProgressBar as AriaProgressBar,
  Label as AriaLabel
} from 'react-aria-components';
import type { ProgressBarProps as AriaProgressBarProps } from 'react-aria-components';
import type { ProgressBarColor, ProgressBarSize } from '../../styles/tokens';
import clsx from 'clsx';

export interface ProgressBarProps extends Omit<AriaProgressBarProps, 'className' | 'children'> {
  value: number;
  minValue?: number;
  maxValue?: number;
  label?: string;
  showValueLabel?: boolean;
  valueLabel?: string;
  color?: ProgressBarColor;
  size?: ProgressBarSize;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  minValue = 0,
  maxValue = 100,
  label,
  showValueLabel = true,
  valueLabel,
  color = 'primary',
  size = 'md',
  className,
  ...props
}) => {
  const percentage =
    maxValue > minValue
      ? Math.min(100, Math.max(0, ((value - minValue) / (maxValue - minValue)) * 100))
      : 0;

  const displayLabel = valueLabel || `${Math.round(percentage)}%`;

  return (
    <AriaProgressBar
      {...props}
      value={value}
      minValue={minValue}
      maxValue={maxValue}
      aria-label={label || 'Progress'}
      className={clsx('ds-progress-root', className)}
    >
      {(label || showValueLabel) && (
        <div className="ds-progress-header">
          {label && <AriaLabel>{label}</AriaLabel>}
          {showValueLabel && <span>{displayLabel}</span>}
        </div>
      )}
      <div className={clsx('ds-progress-track', `ds-progress-track-${size}`)}>
        <div
          className={clsx('ds-progress-fill', `ds-progress-fill-${color}`)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </AriaProgressBar>
  );
};
