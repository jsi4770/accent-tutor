import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { Accents, Spacing } from '@/constants/theme';
import { api } from '@/api/client';
import { Expression, HistoryEntry } from '@/data/types';

type Tab = 'pronunciation' | 'expression';

export default function ReviewScreen() {
  const [tab, setTab] = useState<Tab>('pronunciation');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [expressions, setExpressions] = useState<Expression[]>([]);

  useEffect(() => {
    api.getHistory().then(setHistory);
    api.getExpressions().then(setExpressions);
  }, []);

  const pron = history.filter((h) => h.type === 'pronunciation');

  return (
    <Screen>
      <AppText variant="title">오늘의 복습</AppText>

      <View style={styles.tabs}>
        <Button
          title="발음 복습"
          variant={tab === 'pronunciation' ? 'primary' : 'ghost'}
          onPress={() => setTab('pronunciation')}
          style={styles.tabBtn}
        />
        <Button
          title="표현 복습"
          variant={tab === 'expression' ? 'primary' : 'ghost'}
          onPress={() => setTab('expression')}
          style={styles.tabBtn}
        />
      </View>

      <View style={styles.list}>
        {tab === 'pronunciation'
          ? pron.map((h) => (
              <Card key={h.id}>
                <View style={styles.row}>
                  <AppText variant="label" style={styles.grow}>
                    {h.title}
                  </AppText>
                  <Badge label={`${h.score}점`} />
                </View>
                <AppText variant="caption" color="textSecondary">
                  {h.date}
                </AppText>
              </Card>
            ))
          : expressions.map((e) => (
              <Card key={e.id}>
                <View style={styles.row}>
                  <AppText variant="label" style={styles.grow}>
                    {e.meaning}
                  </AppText>
                  {e.bookmarked && <Badge label="⭐" tone="yellow" />}
                </View>
                <AppText variant="caption" color="textSecondary">
                  {e.variants.map((v) => `${Accents[v.accent].label}: ${v.phrase}`).join('  ·  ')}
                </AppText>
              </Card>
            ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', gap: Spacing.two },
  tabBtn: { flex: 1 },
  list: { gap: Spacing.two },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  grow: { flex: 1 },
});
