/**
 * Chemo Calendar — Design System TypeScript Token Map
 * Strictly typed constants and types mirroring CSS custom properties.
 */

export const COLOR_TOKENS = {
  primary: 'var(--md-sys-color-primary)',
  onPrimary: 'var(--md-sys-color-on-primary)',
  primaryContainer: 'var(--md-sys-color-primary-container)',
  onPrimaryContainer: 'var(--md-sys-color-on-primary-container)',

  secondary: 'var(--md-sys-color-secondary)',
  onSecondary: 'var(--md-sys-color-on-secondary)',
  secondaryContainer: 'var(--md-sys-color-secondary-container)',
  onSecondaryContainer: 'var(--md-sys-color-on-secondary-container)',

  tertiary: 'var(--md-sys-color-tertiary)',
  onTertiary: 'var(--md-sys-color-on-tertiary)',
  tertiaryContainer: 'var(--md-sys-color-tertiary-container)',
  onTertiaryContainer: 'var(--md-sys-color-on-tertiary-container)',

  error: 'var(--md-sys-color-error)',
  onError: 'var(--md-sys-color-on-error)',
  errorContainer: 'var(--md-sys-color-error-container)',
  onErrorContainer: 'var(--md-sys-color-on-error-container)',

  warning: 'var(--md-sys-color-warning)',
  onWarning: 'var(--md-sys-color-on-warning)',
  warningContainer: 'var(--md-sys-color-warning-container)',
  onWarningContainer: 'var(--md-sys-color-on-warning-container)',

  success: 'var(--md-sys-color-success)',
  onSuccess: 'var(--md-sys-color-on-success)',
  successContainer: 'var(--md-sys-color-success-container)',
  onSuccessContainer: 'var(--md-sys-color-on-success-container)',

  surface: 'var(--md-sys-color-surface)',
  surfaceDim: 'var(--md-sys-color-surface-dim)',
  surfaceBright: 'var(--md-sys-color-surface-bright)',
  surfaceContainerLowest: 'var(--md-sys-color-surface-container-lowest)',
  surfaceContainerLow: 'var(--md-sys-color-surface-container-low)',
  surfaceContainer: 'var(--md-sys-color-surface-container)',
  surfaceContainerHigh: 'var(--md-sys-color-surface-container-high)',
  surfaceContainerHighest: 'var(--md-sys-color-surface-container-highest)',

  onSurface: 'var(--md-sys-color-on-surface)',
  onSurfaceVariant: 'var(--md-sys-color-on-surface-variant)',
  outline: 'var(--md-sys-color-outline)',
  outlineVariant: 'var(--md-sys-color-outline-variant)',
  inverseSurface: 'var(--md-sys-color-inverse-surface)',
  inverseOnSurface: 'var(--md-sys-color-inverse-on-surface)'
} as const;

export type ColorTokenKey = keyof typeof COLOR_TOKENS;

export const SPACING_TOKENS = {
  '0': 'var(--space-0)',
  '0_5': 'var(--space-0_5)',
  '1': 'var(--space-1)',
  '1_5': 'var(--space-1_5)',
  '2': 'var(--space-2)',
  '2_5': 'var(--space-2_5)',
  '3': 'var(--space-3)',
  '3_5': 'var(--space-3_5)',
  '4': 'var(--space-4)',
  '5': 'var(--space-5)',
  '6': 'var(--space-6)',
  '7': 'var(--space-7)',
  '8': 'var(--space-8)',
  '9': 'var(--space-9)',
  '10': 'var(--space-10)',
  '12': 'var(--space-12)',
  '14': 'var(--space-14)',
  '16': 'var(--space-16)'
} as const;

export type SpacingToken = keyof typeof SPACING_TOKENS;

export function getSpacingVar(space?: SpacingToken): string | undefined {
  if (!space) return undefined;
  return SPACING_TOKENS[space] || undefined;
}

export const TYPOGRAPHY_TOKENS = {
  xs: 'var(--text-xs)',
  sm: 'var(--text-sm)',
  base: 'var(--text-base)',
  md: 'var(--text-md)',
  lg: 'var(--text-lg)',
  xl: 'var(--text-xl)',
  '2xl': 'var(--text-2xl)',
  '3xl': 'var(--text-3xl)'
} as const;

export type TypographySize = keyof typeof TYPOGRAPHY_TOKENS;

export type FontWeight = 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';

export type ButtonVariant = 'filled' | 'filled-tonal' | 'outlined' | 'text' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type CardVariant = 'elevated' | 'outlined' | 'flat' | 'interactive';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';
export type CardAccent = 'primary' | 'secondary' | 'tertiary' | 'warning' | 'error' | 'success' | 'none';

export type ProgressBarColor = 'primary' | 'success' | 'warning' | 'error' | 'secondary' | 'tertiary';
export type ProgressBarSize = 'sm' | 'md' | 'lg';

export type CalloutVariant = 'surface' | 'primary' | 'secondary' | 'warning' | 'error' | 'success' | 'rest';
export type CalloutBorderStyle = 'solid' | 'dashed' | 'none';

export type TextColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'error'
  | 'warning'
  | 'success'
  | 'inverse';

export type HeadingLevel = 1 | 2 | 3 | 4;
export type HeadingVariant = 'h1' | 'h2' | 'h3' | 'h4';
