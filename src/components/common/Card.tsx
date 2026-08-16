import React from 'react';
import type { CardVariant, CardPadding, CardAccent } from '../../styles/tokens';
import clsx from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  accentBorder?: CardAccent;
  selected?: boolean;
  className?: string;
  children: React.ReactNode;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ className, children, ...props }) => (
  <div className={clsx('ds-card-header', className)} {...props}>
    {children}
  </div>
);

export const CardBody: React.FC<CardBodyProps> = ({ className, children, ...props }) => (
  <div className={clsx('ds-card-body', className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<CardFooterProps> = ({ className, children, ...props }) => (
  <div className={clsx('ds-card-footer', className)} {...props}>
    {children}
  </div>
);

interface CardComponent extends React.FC<CardProps> {
  Header: typeof CardHeader;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
}

export const Card: CardComponent = ({
  variant = 'elevated',
  padding = 'md',
  accentBorder = 'none',
  selected = false,
  className,
  children,
  onClick,
  onKeyDown,
  ...props
}) => {
  const isInteractive = variant === 'interactive' || !!onClick;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (onKeyDown) {
      onKeyDown(e);
    } else if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
    }
  };

  return (
    <div
      {...props}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      data-selected={selected ? 'true' : undefined}
      className={clsx(
        'ds-card',
        `ds-card-${variant}`,
        `ds-card-p-${padding}`,
        {
          'ds-card-interactive': isInteractive,
          'ds-card--selected': selected,
          'ds-card-has-accent': accentBorder !== 'none',
          [`ds-card-accent-${accentBorder}`]: accentBorder !== 'none'
        },
        className
      )}
      role={props.role || (isInteractive ? 'button' : undefined)}
      tabIndex={props.tabIndex !== undefined ? props.tabIndex : isInteractive ? 0 : undefined}
    >
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
