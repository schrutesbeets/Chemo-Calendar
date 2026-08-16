import React from 'react';
import { Button as AriaButton } from 'react-aria-components';
import type { ButtonProps as AriaButtonProps } from 'react-aria-components';
import type { ButtonVariant, ButtonSize } from '../../styles/tokens';
import clsx from 'clsx';

export interface ButtonProps extends Omit<AriaButtonProps, 'className'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'filled',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  children,
  ...props
}) => {
  return (
    <AriaButton
      {...props}
      className={clsx(
        'react-aria-Button',
        'ds-btn',
        `ds-btn-${variant}`,
        `ds-btn-${size}`,
        {
          'ds-btn-full': fullWidth
        },
        className
      )}
    >
      {leftIcon && <span className="ds-btn-icon-left" aria-hidden="true">{leftIcon}</span>}
      {children && <span>{children}</span>}
      {rightIcon && <span className="ds-btn-icon-right" aria-hidden="true">{rightIcon}</span>}
    </AriaButton>
  );
};
