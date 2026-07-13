import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { Radius, Spacing } from '@/constants/theme';
import { api } from '@/api/client';
import { useTheme } from '@/hooks/use-theme';
import { useSession } from '@/store/session';

const socials = [
  { id: 'google', label: 'Google로 계속하기', emoji: '🟦' },
  { id: 'naver', label: '네이버로 계속하기', emoji: '🟩' },
  { id: 'kakao', label: '카카오로 계속하기', emoji: '🟨' },
];

export default function SignupScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { signIn } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const next = () => router.replace('/onboarding/accent-select');

  const withSocial = (provider: string) => async () => {
    setSubmitting(true);
    const { token } = await api.signup(`${provider}@example.com`, 'social-oauth-placeholder');
    signIn(token);
    next();
  };

  const withEmail = async () => {
    setSubmitting(true);
    const { token } = await api.signup(email, password, nickname || undefined);
    signIn(token);
    next();
  };

  const canSubmit = email.includes('@') && password.length >= 4;

  return (
    <Screen>
      <AppText variant="title">회원가입</AppText>
      <AppText variant="body" color="textSecondary">
        소셜 계정으로 3초 만에 시작하세요.
      </AppText>

      <View style={styles.list}>
        {socials.map((s) => (
          <Button
            key={s.id}
            title={`${s.emoji}  ${s.label}`}
            variant="ghost"
            loading={submitting}
            onPress={withSocial(s.id)}
          />
        ))}
      </View>

      <Card>
        <AppText variant="label">자체 계정으로 가입</AppText>
        <TextInput
          placeholder="이메일"
          placeholderTextColor={theme.muted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={[styles.input, { borderColor: theme.border, color: theme.text }]}
        />
        <TextInput
          placeholder="비밀번호 (4자 이상)"
          placeholderTextColor={theme.muted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={[styles.input, { borderColor: theme.border, color: theme.text }]}
        />
        <TextInput
          placeholder="닉네임 (선택)"
          placeholderTextColor={theme.muted}
          value={nickname}
          onChangeText={setNickname}
          style={[styles.input, { borderColor: theme.border, color: theme.text }]}
        />
        <Button
          title="이메일로 가입하기"
          onPress={withEmail}
          disabled={!canSubmit}
          loading={submitting}
          style={styles.mt}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.two },
  input: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 15,
    marginTop: Spacing.two,
  },
  mt: { marginTop: Spacing.two },
});
