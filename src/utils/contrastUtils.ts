/**
 * Calculates WCAG 2.1 relative luminance and returns optimal high-contrast text color ('#000000' or '#ffffff')
 */
export function getContrastTextColor(hexColor: string): '#000000' | '#ffffff' {
  if (!hexColor) return '#000000';
  
  let hex = hexColor.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }

  if (hex.length !== 6) return '#000000';

  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const aR = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const aG = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const aB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  const luminance = 0.2126 * aR + 0.7152 * aG + 0.0722 * aB;

  // WCAG threshold for light vs dark background
  return luminance > 0.45 ? '#000000' : '#ffffff';
}

/**
 * Returns Tailwind class pairs with guaranteed WCAG AAA contrast ratio
 */
export function getAccessibleColorPair(
  bgType: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'dark' | 'light',
  isHighContrast: boolean = false
) {
  if (isHighContrast) {
    switch (bgType) {
      case 'primary':
        return { bg: 'bg-sky-400', text: 'text-black', border: 'border-2 border-white' };
      case 'secondary':
        return { bg: 'bg-purple-400', text: 'text-black', border: 'border-2 border-white' };
      case 'tertiary':
      case 'warning':
        return { bg: 'bg-amber-300', text: 'text-black', border: 'border-2 border-white' };
      case 'success':
        return { bg: 'bg-emerald-400', text: 'text-black', border: 'border-2 border-white' };
      case 'light':
        return { bg: 'bg-white', text: 'text-black', border: 'border-2 border-black' };
      case 'dark':
      default:
        return { bg: 'bg-black', text: 'text-white', border: 'border-2 border-white' };
    }
  }

  switch (bgType) {
    case 'primary':
      return { bg: 'bg-sky-50', text: 'text-sky-950', border: 'border-sky-300' };
    case 'secondary':
      return { bg: 'bg-purple-50', text: 'text-purple-950', border: 'border-purple-300' };
    case 'tertiary':
    case 'warning':
      return { bg: 'bg-amber-50', text: 'text-amber-950', border: 'border-amber-300' };
    case 'success':
      return { bg: 'bg-emerald-50', text: 'text-emerald-950', border: 'border-emerald-300' };
    case 'light':
      return { bg: 'bg-slate-100', text: 'text-slate-900', border: 'border-slate-300' };
    case 'dark':
    default:
      return { bg: 'bg-slate-900', text: 'text-white', border: 'border-slate-800' };
  }
}
