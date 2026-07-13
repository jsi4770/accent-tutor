import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { AccentCode, AccentOrder, Accents, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useSession } from '@/store/session';

export default function AccentSelectScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { accent, setAccent } = useSession();
  const [selected, setSelected] = useState<AccentCode>(accent);

  const confirm = () => {
    setAccent(selected);
    router.push('/onboarding/level-test');
  };

  return (
    <Screen>
      <AppText variant="title">목표 악센트를 선택하세요</AppText>
      <AppText variant="body" color="textSecondary">
        선택한 악센트 기준으로 억양과 표현을 학습합니다. 추후 언제든 변경할 수 있어요.
      </AppText>

      <View style={styles.list}>
        {AccentOrder.map((code) => {
          const active = code === selected;
          const a = Accents[code];
          return (
            <Card
              key={code}
              onPress={() => setSelected(code)}
              style={active ? { borderColor: theme.tint, borderWidth: 2 } : undefined}>
              <View style={styles.row}>
                <AppText style={styles.flag}>{a.flag}</AppText>
                <View style={styles.grow}>
                  <AppText variant="subtitle">
                    {a.country} ({code})
                  </AppText>
                  <AppText variant="caption" color="textSecondary">
                    대표 도시: {a.city}
                  </AppText>
                </View>
                {active && (
                  <View style={[styles.check, { backgroundColor: theme.tint }]}>
                    <AppText style={styles.checkMark}>✓</AppText>
                  </View>
                )}
              </View>
            </Card>
          );
        })}
      </View>

      <Button title="다음" onPress={confirm} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.two },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  grow: { flex: 1 },
  flag: { fontSize: 36 },
  check: {
    width: 26,
    height: 26,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: { color: '#FFFFFF', fontWeight: '700' },
});
