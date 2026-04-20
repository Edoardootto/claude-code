import { Platform, TextStyle } from 'react-native';

export const Colors = {
  coral:      '#FF5A4E',
  coralSoft:  '#FFE8E5',
  coralDim:   '#FFD1CC',
  ink:        '#0A0A0B',
  inkSoft:    '#1A1A1C',
  ink2:       '#2A2A2D',
  bg:         '#FAFAFA',
  card:       '#FFFFFF',
  gray100:    '#F4F4F5',
  gray150:    '#EDEDEF',
  gray200:    '#E4E4E7',
  gray300:    '#D4D4D8',
  gray400:    '#A1A1AA',
  gray500:    '#71717A',
  gray600:    '#52525B',
  gray700:    '#3F3F46',
  green:      '#10B981',
  amber:      '#F59E0B',
  blue:       '#3B82F6',
  white:      '#FFFFFF',
  border:     '#E4E4E7',
};

export const SportColors: Record<string, string> = {
  Basketball: '#FF5A4E',
  Soccer:     '#10B981',
  Tennis:     '#3B82F6',
  Volleyball: '#F59E0B',
  Running:    '#0A0A0B',
  Cycling:    '#8B5CF6',
  Padel:      '#3B82F6',
  Pickleball: '#F59E0B',
  Football:   '#10B981',
};

export const SportEmoji: Record<string, string> = {
  Basketball: '🏀',
  Soccer:     '⚽',
  Tennis:     '🎾',
  Volleyball: '🏐',
  Running:    '🏃',
  Cycling:    '🚴',
  Padel:      '🏓',
  Pickleball: '🏓',
  Football:   '⚽',
  default:    '🏅',
};

export const Radius = {
  xs:   6,
  sm:   10,
  md:   14,
  card: 22,
  lg:   28,
  pill: 999,
};

export const Font = {
  display:       Platform.select({ ios: undefined, android: undefined }) as unknown as string,
  displayItalic: Platform.select({ ios: undefined, android: undefined }) as unknown as string,
};

export const MicroStyle: TextStyle = {
  fontSize: 10,
  letterSpacing: 1.3,
  textTransform: 'uppercase',
  color: Colors.gray500,
};
