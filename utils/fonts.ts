import { Fonts } from '@/constants/theme';

type FontType = 'sans' | 'serif' | 'rounded' | 'mono';

const fallbackFonts: Record<FontType, string> = {
  sans: 'System',
  serif: 'Georgia',
  rounded: 'System',
  mono: 'Courier New',
};

export const getFontFamily = (type: FontType): string => {
  return Fonts?.[type] ?? fallbackFonts[type];
};