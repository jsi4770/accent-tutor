import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Badge } from '@/components/badge';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { Accents, Radius, Spacing } from '@/constants/theme';
import { api } from '@/api/client';
import { User } from '@/data/types';
import { useTheme } from '@/hooks/use-theme';

const menu = [
  { label: '프로필', route: '/profile' as const, emoji: '👤' },
  { label: '내 정보 · 계정 설정', route: '/my-info' as const, emoji: '⚙️' },
  { label: '복습', route: '/review' as const, emoji: '🔁' },
];

export default function MyPageScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    api.getCurrentUser().then(setUser);
  }, []);

  return (
    <Screen>
      <AppText variant="title">마이페이지</AppText>

      <Card>
        <View style={styles.row}>
          <View style={[styles.avatar, { backgroundColor: theme.tintSoft }]}>
            <AppText style={styles.avatarText}>{user?.name?.[0] ?? '민'}</AppText>
          </View>
          <View style={styles.grow}>
            <AppText variant="subtitle">{user?.name ?? '—'}</AppText>
            <View style={styles.badges}>
              <Badge label={user?.level ?? '—'} tone="muted" />
              {user && <Badge label={`${Accents[user.accent].flag} ${Accents[user.accent].label}`} />}
            </View>
          </View>
        </View>
      </Card>

      <View style={styles.list}>
        {menu.map((m) => (
          <Card key={m.route} onPress={() => router.push(m.route)}>
            <View style={styles.row}>
              <AppText style={styles.emoji}>{m.emoji}</AppText>
              <AppText variant="label" style={styles.grow}>
                {m.label}
              </AppText>
              <AppText color="muted">›</AppText>
            </View>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  grow: { flex: 1 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 22, fontWeight: '700' },
  badges: { flexDirection: 'row', gap: Spacing.one, marginTop: Spacing.half },
  list: { gap: Spacing.two },
  emoji: { fontSize: 22 },
});
