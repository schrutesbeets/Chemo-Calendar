import React from 'react';
import { Syringe, Pill, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import type { BadgeColor } from '../../types/regimen';
import clsx from 'clsx';

interface BadgeProps {
  label: string;
  color?: BadgeColor;
  iconType?: 'injection' | 'pill' | 'steroid' | 'alert' | 'check' | 'none';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  color = 'primary',
  iconType = 'pill',
  className
}) => {
  const getIcon = () => {
    switch (iconType) {
      case 'injection':
        return <Syringe size={16} strokeWidth={2.5} aria-hidden="true" />;
      case 'steroid':
        return <Sparkles size={16} strokeWidth={2.5} aria-hidden="true" />;
      case 'alert':
        return <AlertCircle size={16} strokeWidth={2.5} aria-hidden="true" />;
      case 'check':
        return <CheckCircle size={16} strokeWidth={2.5} aria-hidden="true" />;
      case 'none':
        return null;
      case 'pill':
      default:
        return <Pill size={16} strokeWidth={2.5} aria-hidden="true" />;
    }
  };

  return (
    <span className={clsx('m3-badge', `badge-${color}`, className)}>
      {getIcon()}
      <span>{label}</span>
    </span>
  );
};
