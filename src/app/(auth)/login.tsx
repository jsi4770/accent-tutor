import { useRouter } from 'expo-router';
import { StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const socials = [
  { id: 'google', label: 'Google 로그인', emoji: '🟦' },
  { id: 'naver', label: '네이버 로그인', emoji: '🟩' },
  { id: 'kakao', label: '카카오 로그인', emoji: '🟨' },
];

export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();
  const enter = () => router.replace('/(tabs)/home');

  return (
    <Screen>
      <AppText variant="title">로그인</AppText>

      <Card>
        <AppText variant="label">자체 아이디 로그인</AppText>
        <TextInput
          placeholder="아이디"
          placeholderTextColor={theme.muted}
          style={[styles.input, { borderColor: theme.border, color: theme.text }]}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="비밀번호"
          placeholderTextColor={theme.muted}
          secureTextEntry
          style={[styles.input, { borderColor: theme.border, color: theme.text }]}
        />
        <Button title="로그인" onPress={enter} style={styles.mt} />
        <AppText variant="caption" color="tint" style={styles.center}>
          아이디 / 비밀번호 찾기
        </AppText>
      </Card>

      <View style={styles.list}>
        {socials.map((s) => (
          <Button key={s.id} title={`${s.emoji}  ${s.label}`} variant="ghost" onPress={enter} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 15,
  },
  list: { gap: Spacing.two },
  mt: { marginTop: Spacing.two },
  center: { textAlign: 'center' },
});
