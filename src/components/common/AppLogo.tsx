import React from 'react';
import clsx from 'clsx';

export type AppLogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
export type AppLogoVariant = 'squircle' | 'circle' | 'symbol' | 'badge';

export interface AppLogoProps {
  /** Size preset or custom pixel number */
  size?: AppLogoSize;
  /** Visual display variant */
  variant?: AppLogoVariant;
  /** Optional custom CSS class name */
  className?: string;
  /** Accessible label for screen readers */
  ariaLabel?: string;
  /** Whether to hide from screen readers when adjacent to duplicate text */
  ariaHidden?: boolean;
  /** Optional custom subtitle text when variant="badge" */
  badgeSubtitle?: string;
  /** Optional click handler if acting as interactive home link */
  onClick?: () => void;
}

const sizeMap: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64
};

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  variant = 'squircle',
  className,
  ariaLabel = 'Digital Pillbox Logo',
  ariaHidden,
  badgeSubtitle = 'Medical Regimen Tracker',
  onClick
}) => {
  const pixelSize = typeof size === 'number' ? size : sizeMap[size] || 40;

  const svgContent = (
    <svg
      viewBox="0 0 512 512"
      width={pixelSize}
      height={pixelSize}
      className={clsx('app-logo-svg', `app-logo-${variant}`)}
      role={ariaHidden ? undefined : 'img'}
      aria-label={ariaHidden ? undefined : ariaLabel}
      aria-hidden={ariaHidden}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="app-logo-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--app-logo-bg, #2b6980)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--app-logo-bg, #265e74)" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Background Container (Squircle or Circle) */}
      {variant === 'squircle' && (
        <rect
          width="512"
          height="512"
          rx="112"
          ry="112"
          fill="url(#app-logo-gradient)"
          className="app-logo-bg"
        />
      )}

      {variant === 'circle' && (
        <circle
          cx="256"
          cy="256"
          r="256"
          fill="url(#app-logo-gradient)"
          className="app-logo-bg"
        />
      )}

      {/* Outer Soft Light Blue Ring */}
      <circle
        cx="256"
        cy="256"
        r="172"
        fill="none"
        stroke="var(--app-logo-ring, #b5ddf2)"
        strokeWidth="22"
        className="app-logo-ring"
      />

      {/* White Healthcare Cross */}
      <g fill="var(--app-logo-cross, #ffffff)" className="app-logo-cross">
        <rect x="131" y="211" width="250" height="90" rx="24" ry="24" />
        <rect x="211" y="131" width="90" height="250" rx="24" ry="24" />
      </g>

      {/* Central Heart Icon */}
      <path
        d="M 256 235 C 248 219 231 216 219 228 C 205 242 207 262 222 277 C 235 289 251 297 256 301 C 261 297 277 289 290 277 C 305 262 307 242 293 228 C 281 216 264 219 256 235 Z"
        fill="var(--app-logo-heart, #2b6980)"
        className="app-logo-heart"
      />
    </svg>
  );

  if (variant === 'badge') {
    return (
      <div
        className={clsx('app-logo-lockup', className, {
          'app-logo-clickable': Boolean(onClick)
        })}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        aria-label={onClick ? `${ariaLabel} - Return to Top` : undefined}
      >
        {svgContent}
        <div className="app-logo-badge-text">
          <span className="app-logo-brand-title">Digital Pillbox</span>
          {badgeSubtitle && (
            <span className="app-logo-brand-subtitle">{badgeSubtitle}</span>
          )}
        </div>
      </div>
    );
  }

  if (onClick) {
    return (
      <div
        className={clsx('app-logo-wrapper', 'app-logo-clickable', className)}
        onClick={onClick}
        role="button"
        tabIndex={0}
        aria-label={`${ariaLabel} - Return to Top`}
      >
        {svgContent}
      </div>
    );
  }

  return (
    <div className={clsx('app-logo-wrapper', className)}>
      {svgContent}
    </div>
  );
};
