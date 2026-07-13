import { PropsWithChildren } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type CardProps = PropsWithChildren<{
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}>;

export function Card({ children, onPress, style }: CardProps) {
  const theme = useTheme();
  const base: ViewStyle = {
    backgroundColor: theme.card,
    borderColor: theme.border,
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.card, base, { opacity: pressed ? 0.9 : 1 }, style]}>
        {children}
      </Pressable>
    );
  }
  return <View style={[styles.card, base, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.two,
  },
});
