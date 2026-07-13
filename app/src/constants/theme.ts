import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#11181C',
    textSecondary: '#5A6570',
    background: '#F6F8FB',
    card: '#FFFFFF',
    border: '#E3E8EF',
    tint: '#1B3A8B',
    tintSoft: '#E7EDFB',
    accentYellow: '#FCE7A2',
    accentYellowText: '#7A5B00',
    success: '#1F9D55',
    danger: '#D64545',
    muted: '#98A2B3',
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    background: '#0C1220',
    card: '#161C2B',
    border: '#26304A',
    tint: '#6E8FE8',
    tintSoft: '#1B2540',
    accentYellow: '#4A3F1A',
    accentYellowText: '#F2D98B',
    success: '#42C17A',
    danger: '#E06A6A',
    muted: '#5A6570',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'system-ui, sans-serif',
    serif: 'serif',
    rounded: 'system-ui, sans-serif',
    mono: 'monospace',
  },
})!;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 48,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 20,
  pill: 999,
} as const;

export const MaxContentWidth = 720;

export const Accents = {
  'en-UK': { label: 'UK', flag: '🇬🇧', country: '영국', city: '런던' },
  'en-AU': { label: 'AU', flag: '🇦🇺', country: '호주', city: '시드니' },
  'en-US': { label: 'US', flag: '🇺🇸', country: '미국', city: '뉴욕' },
} as const;

export type AccentCode = keyof typeof Accents;
export const AccentOrder: AccentCode[] = ['en-UK', 'en-AU', 'en-US'];
