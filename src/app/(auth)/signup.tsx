import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { Spacing } from '@/constants/theme';

const socials = [
  { id: 'google', label: 'Google로 계속하기', emoji: '🟦' },
  { id: 'naver', label: '네이버로 계속하기', emoji: '🟩' },
  { id: 'kakao', label: '카카오로 계속하기', emoji: '🟨' },
];

export default function SignupScreen() {
  const router = useRouter();
  const next = () => router.replace('/onboarding/accent-select');

  return (
    <Screen>
      <AppText variant="title">회원가입</AppText>
      <AppText variant="body" color="textSecondary">
        소셜 계정으로 3초 만에 시작하세요.
      </AppText>

      <View style={styles.list}>
        {socials.map((s) => (
          <Button key={s.id} title={`${s.emoji}  ${s.label}`} variant="ghost" onPress={next} />
        ))}
      </View>

      <Card>
        <AppText variant="label">자체 계정으로 가입</AppText>
        <AppText variant="caption" color="textSecondary">
          이메일 · 비밀번호 입력 폼이 이 자리에 들어갑니다 (스캐폴드).
        </AppText>
        <Button title="이메일로 가입하기" onPress={next} style={styles.mt} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.two },
  mt: { marginTop: Spacing.two },
});
