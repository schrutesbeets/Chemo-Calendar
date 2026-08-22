import React from 'react';
import type { ButtonSize } from '../../styles/tokens';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  options: SelectOption[];
  selectSize?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  helperText?: string;
  errorMessage?: string;
  containerClassName?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  selectSize = 'md',
  fullWidth = true,
  leftIcon,
  helperText,
  errorMessage,
  className,
  containerClassName,
  disabled,
  id,
  ...props
}) => {
  const generatedId = React.useId();
  const selectId = id || generatedId;

  return (
    <div
      className={clsx(
        'ds-select-wrapper',
        {
          'ds-select-full': fullWidth
        },
        containerClassName
      )}
    >
      {label && (
        <label htmlFor={selectId} className="ds-select-label">
          {label}
        </label>
      )}

      <div className="ds-select-container">
        {leftIcon && (
          <span className="ds-select-icon-left" aria-hidden="true">
            {leftIcon}
          </span>
        )}

        <select
          id={selectId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={clsx(
            'ds-select',
            `ds-select-${selectSize}`,
            {
              'ds-select-has-left-icon': !!leftIcon,
              'ds-select-invalid': !!errorMessage
            },
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label} {opt.sublabel ? `(${opt.sublabel})` : ''}
            </option>
          ))}
        </select>

        <span className="ds-select-chevron" aria-hidden="true">
          <ChevronDown size={18} />
        </span>
      </div>

      {errorMessage && (
        <span className="ds-field-error" role="alert">
          {errorMessage}
        </span>
      )}
      {!errorMessage && helperText && (
        <span className="ds-field-helper">
          {helperText}
        </span>
      )}
    </div>
  );
};
