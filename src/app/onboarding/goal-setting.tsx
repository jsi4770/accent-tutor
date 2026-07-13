import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { Radius, Spacing } from '@/constants/theme';
import { LearningGoal } from '@/data/types';
import { useTheme } from '@/hooks/use-theme';

const goals: { id: LearningGoal; label: string; emoji: string }[] = [
  { id: 'study-abroad', label: '유학', emoji: '🎓' },
  { id: 'job', label: '취업', emoji: '💼' },
  { id: 'travel', label: '여행', emoji: '✈️' },
  { id: 'daily', label: '일상회화', emoji: '☕' },
];

const times = [10, 20, 30, 60];

export default function GoalSettingScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [goal, setGoal] = useState<LearningGoal>('study-abroad');
  const [minutes, setMinutes] = useState(20);

  return (
    <Screen>
      <AppText variant="title">학습 목표 설정</AppText>

      <AppText variant="label">무엇을 위해 학습하나요?</AppText>
      <View style={styles.grid}>
        {goals.map((g) => {
          const active = g.id === goal;
          return (
            <Card
              key={g.id}
              onPress={() => setGoal(g.id)}
              style={[styles.gridItem, active ? { borderColor: theme.tint, borderWidth: 2 } : null]}>
              <AppText style={styles.emoji}>{g.emoji}</AppText>
              <AppText variant="label">{g.label}</AppText>
            </Card>
          );
        })}
      </View>

      <AppText variant="label">하루 목표 학습 시간</AppText>
      <View style={styles.timeRow}>
        {times.map((t) => {
          const active = t === minutes;
          return (
            <Pressable
              key={t}
              onPress={() => setMinutes(t)}
              style={[
                styles.chip,
                { borderColor: theme.border },
                active && { backgroundColor: theme.tint, borderColor: theme.tint },
              ]}>
              <AppText variant="label" style={{ color: active ? '#FFFFFF' : theme.text }}>
                {t}분
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <Button title="학습 시작하기" onPress={() => router.replace('/(tabs)/home')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  gridItem: { flexBasis: '48%', flexGrow: 1, alignItems: 'center', paddingVertical: Spacing.four },
  emoji: { fontSize: 32 },
  timeRow: { flexDirection: 'row', gap: Spacing.two, flexWrap: 'wrap' },
  chip: {
    borderWidth: 1,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
});
