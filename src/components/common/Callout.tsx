import React from 'react';
import type { CalloutVariant, CalloutBorderStyle } from '../../styles/tokens';
import clsx from 'clsx';

export interface CalloutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: CalloutVariant;
  borderStyle?: CalloutBorderStyle;
  icon?: React.ReactNode;
  title?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export const Callout: React.FC<CalloutProps> = ({
  variant = 'surface',
  borderStyle = 'solid',
  icon,
  title,
  action,
  className,
  children,
  ...props
}) => {
  return (
    <div
      {...props}
      className={clsx(
        'ds-callout',
        `ds-callout-${variant}`,
        {
          'ds-callout-border-dashed': borderStyle === 'dashed' || variant === 'rest',
          'ds-callout-border-none': borderStyle === 'none'
        },
        className
      )}
    >
      {icon && <div className="ds-callout-icon">{icon}</div>}
      <div className="ds-callout-content">
        {title && (
          <div className="ds-callout-title">
            {typeof title === 'string' ? (
              <strong>{title}</strong>
            ) : (
              title
            )}
          </div>
        )}
        <div className="ds-callout-body">{children}</div>
      </div>
      {action && <div className="ds-callout-action">{action}</div>}
    </div>
  );
};
