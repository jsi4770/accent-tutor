import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AccentToggle } from '@/components/accent-toggle';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { Accents, Radius, Spacing } from '@/constants/theme';
import { api } from '@/api/client';
import { SituationCard, User } from '@/data/types';
import { useTheme } from '@/hooks/use-theme';
import { useSession } from '@/store/session';

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { accent, setAccent } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [cards, setCards] = useState<SituationCard[]>([]);

  useEffect(() => {
    api.getCurrentUser().then(setUser);
  }, []);

  useEffect(() => {
    api.getSituationCards(accent).then(setCards);
  }, [accent]);

  return (
    <Screen>
      <View style={styles.topRow}>
        <Pressable style={styles.profile} onPress={() => router.push('/profile')}>
          <View style={[styles.avatar, { backgroundColor: theme.tintSoft }]}>
            <AppText style={styles.avatarText}>{user?.name?.[0] ?? '민'}</AppText>
          </View>
          <View>
            <AppText variant="subtitle">{user ? `${user.name} 님` : '불러오는 중…'}</AppText>
            <View style={styles.badgeRow}>
              <Badge label={user?.level ?? '—'} tone="muted" />
              <Badge label={`${Accents[accent].flag} ${Accents[accent].label}`} />
            </View>
          </View>
        </Pressable>
      </View>

      <AccentToggle value={accent} onChange={setAccent} />

      <AppText variant="label">오늘의 학습 · {Accents[accent].country}</AppText>

      <View style={styles.list}>
        {cards.map((card) => (
          <Card key={card.id} onPress={() => router.push({ pathname: '/speaking', params: { cardId: card.id } })}>
            <View style={styles.cardHead}>
              <AppText variant="subtitle" style={styles.grow}>
                {card.title}
              </AppText>
              {card.completed && <Badge label="완료" tone="success" />}
            </View>
            <AppText variant="body" color="textSecondary">
              {card.description}
            </AppText>
            <View style={styles.cardMeta}>
              <AppText variant="caption" color="tint">
                예상 싱크로율 {'★'.repeat(card.expectedSync)}
                {'☆'.repeat(5 - card.expectedSync)}
              </AppText>
              <AppText variant="caption" color="textSecondary">
                약 {card.durationMin}분
              </AppText>
            </View>
          </Card>
        ))}
        {cards.length === 0 && (
          <AppText variant="body" color="textSecondary">
            이 악센트의 학습 카드를 준비 중입니다.
          </AppText>
        )}
      </View>

      <Card onPress={() => router.push('/expression-learning')}>
        <AppText variant="label">💡 악센트별 표현 학습</AppText>
        <AppText variant="caption" color="textSecondary">
          같은 의미를 UK · AU · US 표현으로 비교하고 북마크하세요.
        </AppText>
      </Card>

      <Button
        title="실전 스피킹 시작하기"
        onPress={() => router.push({ pathname: '/speaking', params: { cardId: cards[0]?.id ?? 'c_pub' } })}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  profile: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 20, fontWeight: '700' },
  badgeRow: { flexDirection: 'row', gap: Spacing.one, marginTop: Spacing.half },
  list: { gap: Spacing.two },
  cardHead: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  grow: { flex: 1 },
  cardMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.one },
});
