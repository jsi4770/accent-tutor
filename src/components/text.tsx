import { StyleSheet, Text, type TextProps } from 'react-native';

import { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Variant = 'display' | 'title' | 'subtitle' | 'body' | 'label' | 'caption';

export type AppTextProps = TextProps & {
  variant?: Variant;
  color?: ThemeColor;
};

export function AppText({ style, variant = 'body', color, ...rest }: AppTextProps) {
  const theme = useTheme();
  return <Text style={[{ color: theme[color ?? 'text'] }, styles[variant], style]} {...rest} />;
}

const styles = StyleSheet.create({
  display: { fontSize: 32, lineHeight: 40, fontWeight: '700' },
  title: { fontSize: 24, lineHeight: 32, fontWeight: '700' },
  subtitle: { fontSize: 18, lineHeight: 26, fontWeight: '600' },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' },
  label: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
});
