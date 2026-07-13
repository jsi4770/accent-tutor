import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Switch, View } from 'react-native';
import { useState } from 'react';

import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useSession } from '@/store/session';
import { Accents } from '@/constants/theme';

export default function MyInfoScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { accent } = useSession();
  const [notify, setNotify] = useState(true);

  const rows: { label: string; value?: string; onPress?: () => void }[] = [
    { label: '계정 정보', value: 'minsu@example.com' },
    { label: '비밀번호 변경' },
    { label: '악센트 변경', value: `${Accents[accent].flag} ${Accents[accent].label}`, onPress: () => router.push('/onboarding/accent-select') },
    { label: '학습 목표 재설정', onPress: () => router.push('/onboarding/goal-setting') },
  ];

  return (
    <Screen>
      <AppText variant="label">계정</AppText>
      <Card>
        {rows.map((r, i) => (
          <Pressable
            key={r.label}
            onPress={r.onPress}
            style={[styles.row, i < rows.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border }]}>
            <AppText variant="body" style={styles.grow}>
              {r.label}
            </AppText>
            {r.value && (
              <AppText variant="caption" color="textSecondary">
                {r.value}
              </AppText>
            )}
            {r.onPress && <AppText color="muted"> ›</AppText>}
          </Pressable>
        ))}
      </Card>

      <AppText variant="label">알림</AppText>
      <Card>
        <View style={styles.row}>
          <AppText variant="body" style={styles.grow}>
            학습 리마인더 알림
          </AppText>
          <Switch value={notify} onValueChange={setNotify} />
        </View>
      </Card>

      <AppText variant="label">기타</AppText>
      <Card>
        {['이용약관', '개인정보처리방침', '고객센터 문의'].map((label, i, arr) => (
          <Pressable
            key={label}
            style={[styles.row, i < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border }]}>
            <AppText variant="body" style={styles.grow}>
              {label}
            </AppText>
            <AppText color="muted"> ›</AppText>
          </Pressable>
        ))}
      </Card>

      <Pressable style={styles.logout} onPress={() => router.replace('/(auth)/start')}>
        <AppText variant="label" color="danger">
          로그아웃
        </AppText>
      </Pressable>
      <Pressable style={styles.logout}>
        <AppText variant="caption" color="muted">
          회원탈퇴
        </AppText>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.three, gap: Spacing.two },
  grow: { flex: 1 },
  logout: { alignItems: 'center', paddingVertical: Spacing.two },
});
