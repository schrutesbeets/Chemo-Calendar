import React from 'react';
import { Checkbox as AriaCheckbox } from 'react-aria-components';
import type { CheckboxProps as AriaCheckboxProps } from 'react-aria-components';
import { Check } from 'lucide-react';
import clsx from 'clsx';

export interface AccessibleCheckboxProps extends Omit<AriaCheckboxProps, 'children'> {
  label: string;
  subLabel?: string;
}

export const AccessibleCheckbox: React.FC<AccessibleCheckboxProps> = ({
  label,
  subLabel,
  className,
  ...props
}) => {
  return (
    <AriaCheckbox
      {...props}
      className={clsx(
        'react-aria-Checkbox',
        { 'checkbox-has-sublabel': !!subLabel },
        typeof className === 'string' ? className : undefined
      )}
    >
      {({ isSelected }) => (
        <>
          <div className="checkbox-box">
            {isSelected && <Check size={22} strokeWidth={3.5} />}
          </div>
          <div className="checkbox-content">
            <div className="checkbox-label">{label}</div>
            {subLabel && (
              <div className="checkbox-sublabel">
                {subLabel}
              </div>
            )}
          </div>
        </>
      )}
    </AriaCheckbox>
  );
};
