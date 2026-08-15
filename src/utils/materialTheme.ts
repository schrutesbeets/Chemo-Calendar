import { 
  argbFromHex, 
  hexFromArgb, 
  themeFromSourceColor
} from '@material/material-color-utilities';

export interface MaterialPaletteTokens {
  surface: string;
  onSurface: string;
  onSurfaceVariant: string;
  outline: string;
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  error: string;
  onError: string;
}

/**
 * Generates Google Material 3 (M3) Accessible Theme Tokens using the official @material/material-color-utilities HCT engine
 */
export function generateMaterialPalette(
  seedHex: string = '#0284c7',
  isHighContrast: boolean = false
): MaterialPaletteTokens {
  const seedArgb = argbFromHex(seedHex);
  const theme = themeFromSourceColor(seedArgb);

  if (isHighContrast) {
    // WCAG AAA High Contrast Scheme (HCT Tone 0 for Surface, Tone 100 for On-Surface)
    return {
      surface: '#000000',
      onSurface: '#FFFFFF',
      onSurfaceVariant: '#E2E8F0',
      outline: '#FFFFFF',
      primary: '#38BDF8', // Sky 400
      onPrimary: '#000000',
      primaryContainer: '#082F49', // Sky 950
      onPrimaryContainer: '#BAE6FD',
      secondary: '#C084FC', // Purple 400
      onSecondary: '#000000',
      secondaryContainer: '#3B0764', // Purple 950
      onSecondaryContainer: '#E9D5FF',
      tertiary: '#FCD34D', // Amber 300
      onTertiary: '#000000',
      tertiaryContainer: '#451A03', // Amber 950
      onTertiaryContainer: '#FEF3C7',
      error: '#F87171',
      onError: '#000000'
    };
  }

  // Standard Material 3 Scheme generated via Google HCT Color Engine
  const scheme = theme.schemes.light;

  return {
    surface: hexFromArgb(scheme.surface),
    onSurface: hexFromArgb(scheme.onSurface),
    onSurfaceVariant: hexFromArgb(scheme.onSurfaceVariant),
    outline: hexFromArgb(scheme.outline),
    primary: hexFromArgb(scheme.primary),
    onPrimary: hexFromArgb(scheme.onPrimary),
    primaryContainer: hexFromArgb(scheme.primaryContainer),
    onPrimaryContainer: hexFromArgb(scheme.onPrimaryContainer),
    secondary: hexFromArgb(scheme.secondary),
    onSecondary: hexFromArgb(scheme.onSecondary),
    secondaryContainer: hexFromArgb(scheme.secondaryContainer),
    onSecondaryContainer: hexFromArgb(scheme.onSecondaryContainer),
    tertiary: hexFromArgb(scheme.tertiary),
    onTertiary: hexFromArgb(scheme.onTertiary),
    tertiaryContainer: hexFromArgb(scheme.tertiaryContainer),
    onTertiaryContainer: hexFromArgb(scheme.onTertiaryContainer),
    error: hexFromArgb(scheme.error),
    onError: hexFromArgb(scheme.onError)
  };
}

/**
 * Applies Material Design 3 CSS custom properties to document root
 */
export function applyMaterialThemeToCSS(tokens: MaterialPaletteTokens) {
  const root = document.documentElement;
  root.style.setProperty('--md-sys-color-surface', tokens.surface);
  root.style.setProperty('--md-sys-color-on-surface', tokens.onSurface);
  root.style.setProperty('--md-sys-color-on-surface-variant', tokens.onSurfaceVariant);
  root.style.setProperty('--md-sys-color-outline', tokens.outline);
  root.style.setProperty('--md-sys-color-primary', tokens.primary);
  root.style.setProperty('--md-sys-color-on-primary', tokens.onPrimary);
  root.style.setProperty('--md-sys-color-primary-container', tokens.primaryContainer);
  root.style.setProperty('--md-sys-color-on-primary-container', tokens.onPrimaryContainer);
}
