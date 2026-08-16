import React from 'react';
import { Button as AriaButton } from 'react-aria-components';
import type { ButtonProps as AriaButtonProps } from 'react-aria-components';
import type { ButtonVariant, ButtonSize } from '../../styles/tokens';
import clsx from 'clsx';

export interface IconButtonProps extends Omit<AriaButtonProps, 'className' | 'children'> {
  icon: React.ReactNode;
  'aria-label': string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isRound?: boolean;
  className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  'aria-label': ariaLabel,
  variant = 'text',
  size = 'md',
  isRound = true,
  className,
  ...props
}) => {
  return (
    <AriaButton
      {...props}
      aria-label={ariaLabel}
      className={clsx(
        'react-aria-Button',
        'ds-btn',
        'ds-icon-btn',
        `ds-btn-${variant}`,
        `ds-icon-btn-${size}`,
        {
          'ds-icon-btn-round': isRound
        },
        className
      )}
    >
      {icon}
    </AriaButton>
  );
};
