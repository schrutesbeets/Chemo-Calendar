import React from 'react';
import { Switch as AriaSwitch } from 'react-aria-components';
import type { SwitchProps as AriaSwitchProps } from 'react-aria-components';

interface AccessibleSwitchProps extends Omit<AriaSwitchProps, 'children'> {
  label: string;
  description?: string;
}

export const AccessibleSwitch: React.FC<AccessibleSwitchProps> = ({
  label,
  description,
  ...props
}) => {
  return (
    <AriaSwitch {...props} className="react-aria-Switch">
      {({ isSelected }) => (
        <>
          <div className="switch-track" data-selected={isSelected}>
            <div className="switch-thumb" data-selected={isSelected} />
          </div>
          <div className="switch-label-group">
            <div className="switch-label">{label}</div>
            {description && (
              <div className="switch-description">{description}</div>
            )}
          </div>
        </>
      )}
    </AriaSwitch>
  );
};
