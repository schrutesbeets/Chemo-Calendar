import React from 'react';
import {
  TextField as AriaTextField,
  Label as AriaLabel,
  Input as AriaInput,
  TextArea as AriaTextArea,
  FieldError as AriaFieldError,
  Text as AriaText
} from 'react-aria-components';
import type { TextFieldProps as AriaTextFieldProps } from 'react-aria-components';
import type { ButtonSize } from '../../styles/tokens';
import clsx from 'clsx';

export interface TextFieldProps extends Omit<AriaTextFieldProps, 'className' | 'onChange'> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputSize?: ButtonSize;
  multiline?: boolean;
  rows?: number;
  className?: string;
  inputClassName?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  helperText,
  errorMessage,
  placeholder,
  leftIcon,
  rightIcon,
  inputSize = 'md',
  multiline = false,
  rows = 3,
  className,
  inputClassName,
  value,
  defaultValue,
  onChange,
  isInvalid,
  isRequired,
  ...props
}) => {
  return (
    <AriaTextField
      {...props}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      isInvalid={isInvalid || !!errorMessage}
      isRequired={isRequired}
      className={clsx('ds-field-root', className)}
    >
      {label && (
        <AriaLabel className="ds-field-label">
          {label}
          {isRequired && <span className="ds-field-required">*</span>}
        </AriaLabel>
      )}

      <div className="ds-field-input-wrapper">
        {leftIcon && <span className="ds-field-icon-left" aria-hidden="true">{leftIcon}</span>}

        {multiline ? (
          <AriaTextArea
            placeholder={placeholder}
            rows={rows}
            className={clsx(
              'ds-textarea',
              {
                'ds-input-has-left-icon': !!leftIcon,
                'ds-input-has-right-icon': !!rightIcon,
                'ds-textarea-invalid': isInvalid || !!errorMessage
              },
              inputClassName
            )}
          />
        ) : (
          <AriaInput
            placeholder={placeholder}
            className={clsx(
              'ds-input',
              `ds-input-${inputSize}`,
              {
                'ds-input-has-left-icon': !!leftIcon,
                'ds-input-has-right-icon': !!rightIcon,
                'ds-input-invalid': isInvalid || !!errorMessage
              },
              inputClassName
            )}
          />
        )}

        {rightIcon && <span className="ds-field-icon-right" aria-hidden="true">{rightIcon}</span>}
      </div>

      {helperText && !errorMessage && (
        <AriaText slot="description" className="ds-field-helper">
          {helperText}
        </AriaText>
      )}

      {errorMessage && (
        <AriaFieldError className="ds-field-error">
          {errorMessage}
        </AriaFieldError>
      )}
    </AriaTextField>
  );
};
