import React from 'react';
import { Syringe, Pill, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import type { BadgeColor } from '../../types/regimen';
import clsx from 'clsx';

export interface BadgeProps {
  label: string;
  color?: BadgeColor;
  variant?: 'filled' | 'tonal' | 'outlined';
  iconType?: 'injection' | 'pill' | 'steroid' | 'alert' | 'check' | 'none';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'sm' | 'md';
  fullWidth?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  color = 'primary',
  variant = 'tonal',
  iconType = 'pill',
  leftIcon,
  rightIcon,
  size = 'md',
  fullWidth = false,
  className
}) => {
  const getIcon = () => {
    if (leftIcon !== undefined) {
      return leftIcon;
    }
    const iconSize = size === 'sm' ? 14 : 16;
    switch (iconType) {
      case 'injection':
        return <Syringe size={iconSize} strokeWidth={2.5} aria-hidden="true" />;
      case 'steroid':
        return <Sparkles size={iconSize} strokeWidth={2.5} aria-hidden="true" />;
      case 'alert':
        return <AlertCircle size={iconSize} strokeWidth={2.5} aria-hidden="true" />;
      case 'check':
        return <CheckCircle size={iconSize} strokeWidth={2.5} aria-hidden="true" />;
      case 'none':
        return null;
      case 'pill':
      default:
        return <Pill size={iconSize} strokeWidth={2.5} aria-hidden="true" />;
    }
  };

  const iconElement = getIcon();

  return (
    <span
      className={clsx(
        'm3-badge',
        'ds-badge',
        `badge-${color}`,
        `badge-${variant}`,
        `badge-${size}`,
        {
          'badge-full': fullWidth
        },
        className
      )}
    >
      {iconElement}
      <span className="badge-label">{label}</span>
      {rightIcon}
    </span>
  );
};

export interface TagProps extends BadgeProps {}

export const Tag: React.FC<TagProps> = ({ iconType = 'none', ...props }) => {
  return <Badge iconType={iconType} {...props} />;
};

