import { Pressable, StyleSheet, View } from 'react-native';

import { AccentCode, AccentOrder, Accents, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { AppText } from './text';

type AccentToggleProps = {
  value: AccentCode;
  onChange: (accent: AccentCode) => void;
};

export function AccentToggle({ value, onChange }: AccentToggleProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.tintSoft }]}>
      {AccentOrder.map((code) => {
        const active = code === value;
        return (
          <Pressable
            key={code}
            onPress={() => onChange(code)}
            style={[styles.item, active && { backgroundColor: theme.tint }]}>
            <AppText
              variant="label"
              style={{ color: active ? '#FFFFFF' : theme.tint }}>
              {Accents[code].flag} {Accents[code].label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: Radius.pill,
    padding: Spacing.half,
    gap: Spacing.half,
  },
  item: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
  },
});
