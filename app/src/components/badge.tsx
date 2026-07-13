import { StyleSheet, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { AppText } from './text';

type BadgeProps = {
  label: string;
  tone?: 'tint' | 'yellow' | 'success' | 'muted';
};

export function Badge({ label, tone = 'tint' }: BadgeProps) {
  const theme = useTheme();

  const map: Record<NonNullable<BadgeProps['tone']>, { bg: string; fg: string }> = {
    tint: { bg: theme.tintSoft, fg: theme.tint },
    yellow: { bg: theme.accentYellow, fg: theme.accentYellowText },
    success: { bg: theme.tintSoft, fg: theme.success },
    muted: { bg: theme.border, fg: theme.textSecondary },
  };
  const c = map[tone];

  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <AppText variant="caption" style={{ color: c.fg }}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
});
