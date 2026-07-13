import { StyleSheet, View } from 'react-native';

import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ProgressBarProps = {
  value: number;
  color?: string;
  height?: number;
};

export function ProgressBar({ value, color, height = 10 }: ProgressBarProps) {
  const theme = useTheme();
  const pct = Math.max(0, Math.min(100, value));

  return (
    <View style={[styles.track, { backgroundColor: theme.border, height, borderRadius: height / 2 }]}>
      <View
        style={{
          width: `${pct}%`,
          height: '100%',
          backgroundColor: color ?? theme.tint,
          borderRadius: height / 2,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: Radius.pill,
  },
});
