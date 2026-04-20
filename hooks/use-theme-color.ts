import { Colors } from '@/constants/theme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: string
) {
  return props.light ?? Colors.ink;
}
