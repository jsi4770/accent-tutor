import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { Accents, Spacing } from '@/constants/theme';
import { api } from '@/api/client';
import { Expression } from '@/data/types';

export default function ExpressionSummaryScreen() {
  const router = useRouter();
  const [expressions, setExpressions] = useState<Expression[]>([]);

  useEffect(() => {
    api.getExpressions().then(setExpressions);
  }, []);

  const bookmarked = expressions.filter((e) => e.bookmarked);

  return (
    <Screen>
      <AppText variant="title">학습 완료 🎉</AppText>

      <View style={styles.stats}>
        <Card style={styles.stat}>
          <AppText variant="display" color="tint">
            {expressions.length}
          </AppText>
          <AppText variant="caption" color="textSecondary">
            학습한 표현
          </AppText>
        </Card>
        <Card style={styles.stat}>
          <AppText variant="display" color="tint">
            {bookmarked.length}
          </AppText>
          <AppText variant="caption" color="textSecondary">
            북마크
          </AppText>
        </Card>
      </View>

      <AppText variant="label">이번 세션 표현</AppText>
      <View style={styles.list}>
        {expressions.map((e) => (
          <Card key={e.id}>
            <View style={styles.row}>
              <AppText variant="label" style={styles.grow}>
                {e.meaning}
              </AppText>
              {e.bookmarked && <Badge label="⭐ 북마크" tone="yellow" />}
            </View>
            <AppText variant="caption" color="textSecondary">
              {e.variants.map((v) => `${Accents[v.accent].label}: ${v.phrase}`).join('  ·  ')}
            </AppText>
          </Card>
        ))}
      </View>

      <Button title="홈으로" onPress={() => router.replace('/(tabs)/home')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  stats: { flexDirection: 'row', gap: Spacing.two },
  stat: { flex: 1, alignItems: 'center' },
  list: { gap: Spacing.two },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  grow: { flex: 1 },
});
