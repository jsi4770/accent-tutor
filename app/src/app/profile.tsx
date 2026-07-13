import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Badge } from '@/components/badge';
import { Card } from '@/components/card';
import { ProgressBar } from '@/components/progress-bar';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { Accents, Radius, Spacing } from '@/constants/theme';
import { api } from '@/api/client';
import { User } from '@/data/types';
import { useTheme } from '@/hooks/use-theme';

const goalLabels: Record<User['goal'], string> = {
  'study-abroad': '유학',
  job: '취업',
  travel: '여행',
  daily: '일상회화',
};

const trend = [42, 51, 55, 58, 63, 71];

export default function ProfileScreen() {
  const theme = useTheme();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    api.getCurrentUser().then(setUser);
  }, []);

  if (!user) {
    return (
      <Screen>
        <AppText variant="body" color="textSecondary">
          불러오는 중…
        </AppText>
      </Screen>
    );
  }

  return (
    <Screen>
      <Card style={{ alignItems: 'center' }}>
        <View style={[styles.avatar, { backgroundColor: theme.tintSoft }]}>
          <AppText style={styles.avatarText}>{user.name[0]}</AppText>
        </View>
        <AppText variant="title">{user.name}</AppText>
        <View style={styles.badges}>
          <Badge label={user.level} tone="muted" />
          <Badge label={`${Accents[user.accent].flag} ${Accents[user.accent].label}`} />
          <Badge label={goalLabels[user.goal]} tone="yellow" />
        </View>
      </Card>

      <View style={styles.stats}>
        <Card style={styles.stat}>
          <AppText variant="title" color="tint">
            {user.streakDays}일
          </AppText>
          <AppText variant="caption" color="textSecondary">
            연속 학습
          </AppText>
        </Card>
        <Card style={styles.stat}>
          <AppText variant="title" color="tint">
            {Math.round(user.totalMinutes / 60)}시간
          </AppText>
          <AppText variant="caption" color="textSecondary">
            누적 학습
          </AppText>
        </Card>
      </View>

      <Card>
        <AppText variant="label">획득 뱃지</AppText>
        <View style={styles.badges}>
          {user.badges.map((b) => (
            <Badge key={b} label={`🏅 ${b}`} />
          ))}
        </View>
      </Card>

      <Card>
        <AppText variant="label">발음 점수 추이</AppText>
        <View style={styles.chart}>
          {trend.map((v, i) => (
            <View key={i} style={styles.bar}>
              <View style={[styles.barFill, { height: v, backgroundColor: theme.tint }]} />
              <AppText variant="caption" color="textSecondary">
                {v}
              </AppText>
            </View>
          ))}
        </View>
        <ProgressBar value={trend[trend.length - 1]} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 72,
    height: 72,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 28, fontWeight: '700' },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.one, justifyContent: 'center' },
  stats: { flexDirection: 'row', gap: Spacing.two },
  stat: { flex: 1, alignItems: 'center' },
  chart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 110, gap: Spacing.one },
  bar: { flex: 1, alignItems: 'center', gap: Spacing.half },
  barFill: { width: '70%', borderRadius: Radius.sm },
});
