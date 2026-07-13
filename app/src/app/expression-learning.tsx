import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { ProgressBar } from '@/components/progress-bar';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { Accents, Radius, Spacing } from '@/constants/theme';
import { api } from '@/api/client';
import { Expression } from '@/data/types';
import { useTheme } from '@/hooks/use-theme';

export default function ExpressionLearningScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [expressions, setExpressions] = useState<Expression[]>([]);
  const [index, setIndex] = useState(0);
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    api.getExpressions().then((list) => {
      setExpressions(list);
      setBookmarks(Object.fromEntries(list.map((e) => [e.id, e.bookmarked])));
    });
  }, []);

  if (expressions.length === 0) {
    return (
      <Screen>
        <AppText variant="body" color="textSecondary">
          표현을 불러오는 중…
        </AppText>
      </Screen>
    );
  }

  const current = expressions[index];
  const isLast = index === expressions.length - 1;

  const next = () => {
    if (isLast) {
      router.push('/expression-summary');
    } else {
      setIndex(index + 1);
    }
  };

  return (
    <Screen>
      <ProgressBar value={((index + 1) / expressions.length) * 100} />
      <View style={styles.head}>
        <AppText variant="caption" color="textSecondary">
          {index + 1} / {expressions.length}
        </AppText>
        <Pressable onPress={() => setBookmarks((b) => ({ ...b, [current.id]: !b[current.id] }))}>
          <AppText style={styles.star}>{bookmarks[current.id] ? '⭐' : '☆'}</AppText>
        </Pressable>
      </View>

      <AppText variant="title">{current.meaning}</AppText>
      <AppText variant="caption" color="textSecondary">
        같은 의미를 악센트별로 비교해 보세요.
      </AppText>

      <View style={styles.list}>
        {current.variants.map((v) => (
          <Card key={v.accent}>
            <View style={styles.variantHead}>
              <Badge label={`${Accents[v.accent].flag} ${Accents[v.accent].label}`} />
              <AppText variant="subtitle" style={styles.grow}>
                {v.phrase}
              </AppText>
              <Pressable
                onPress={() => {}}
                style={[styles.play, { backgroundColor: theme.tintSoft }]}>
                <AppText>🔊</AppText>
              </Pressable>
            </View>
            <AppText variant="body">“{v.example}”</AppText>
            <AppText variant="caption" color="textSecondary">
              {v.context}
            </AppText>
          </Card>
        ))}
      </View>

      <Button title={isLast ? '학습 완료' : '다음 표현'} onPress={next} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  star: { fontSize: 26 },
  list: { gap: Spacing.two },
  variantHead: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  grow: { flex: 1 },
  play: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
