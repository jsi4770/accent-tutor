import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { Spacing } from '@/constants/theme';
import { api } from '@/api/client';
import { HistoryEntry } from '@/data/types';

type Tab = 'all' | 'pronunciation' | 'expression';

export default function HistoryScreen() {
  const router = useRouter();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [tab, setTab] = useState<Tab>('all');

  useEffect(() => {
    api.getHistory().then(setEntries);
  }, []);

  const filtered = entries.filter((e) => tab === 'all' || e.type === tab);
  const streak = 3;
  const totalMin = 420;

  const openEntry = (entry: HistoryEntry) => {
    if (entry.type === 'pronunciation') {
      router.push('/pronunciation-feedback');
    } else {
      router.push('/expression-summary');
    }
  };

  return (
    <Screen>
      <AppText variant="title">학습 이력</AppText>

      <View style={styles.stats}>
        <Card style={styles.stat}>
          <AppText variant="display" color="tint">
            {streak}
          </AppText>
          <AppText variant="caption" color="textSecondary">
            연속 학습일
          </AppText>
        </Card>
        <Card style={styles.stat}>
          <AppText variant="display" color="tint">
            {Math.round(totalMin / 60)}h
          </AppText>
          <AppText variant="caption" color="textSecondary">
            누적 학습 시간
          </AppText>
        </Card>
      </View>

      <View style={styles.tabs}>
        {(['all', 'pronunciation', 'expression'] as Tab[]).map((t) => (
          <Button
            key={t}
            title={t === 'all' ? '전체' : t === 'pronunciation' ? '발음' : '표현'}
            variant={tab === t ? 'primary' : 'ghost'}
            onPress={() => setTab(t)}
            style={styles.tabBtn}
          />
        ))}
      </View>

      <View style={styles.list}>
        {filtered.map((e) => (
          <Card key={e.id} onPress={() => openEntry(e)}>
            <View style={styles.row}>
              <View style={styles.grow}>
                <AppText variant="label">{e.title}</AppText>
                <AppText variant="caption" color="textSecondary">
                  {e.date}
                </AppText>
              </View>
              {e.type === 'pronunciation' ? (
                <Badge label={`${e.score}점`} tone="tint" />
              ) : (
                <Badge label="표현" tone="yellow" />
              )}
            </View>
          </Card>
        ))}
      </View>

      <Button title="복습하러 가기" variant="secondary" onPress={() => router.push('/review')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  stats: { flexDirection: 'row', gap: Spacing.two },
  stat: { flex: 1, alignItems: 'center' },
  tabs: { flexDirection: 'row', gap: Spacing.one },
  tabBtn: { flex: 1, minHeight: 40, paddingVertical: Spacing.two },
  list: { gap: Spacing.two },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  grow: { flex: 1 },
});
