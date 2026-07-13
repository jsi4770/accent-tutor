import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { Radius, Spacing } from '@/constants/theme';
import { api } from '@/api/client';
import { useGoogleAuth } from '@/hooks/use-google-auth';
import { useTheme } from '@/hooks/use-theme';
import { useSession } from '@/store/session';

export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { signIn } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const enter = () => router.replace('/(tabs)/home');

  const { promptAsync: googlePromptAsync, ready: googleReady } = useGoogleAuth((token) => {
    signIn(token);
    enter();
  });

  const withEmail = async () => {
    setSubmitting(true);
    const { token } = await api.login(email, password);
    signIn(token);
    enter();
  };

  const canSubmit = email.includes('@') && password.length > 0;

  return (
    <Screen>
      <AppText variant="title">로그인</AppText>

      <Card>
        <AppText variant="label">자체 아이디 로그인</AppText>
        <TextInput
          placeholder="이메일"
          placeholderTextColor={theme.muted}
          value={email}
          onChangeText={setEmail}
          style={[styles.input, { borderColor: theme.border, color: theme.text }]}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          placeholder="비밀번호"
          placeholderTextColor={theme.muted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={[styles.input, { borderColor: theme.border, color: theme.text }]}
        />
        <Button title="로그인" onPress={withEmail} disabled={!canSubmit} loading={submitting} style={styles.mt} />
        <AppText variant="caption" color="tint" style={styles.center}>
          아이디 / 비밀번호 찾기
        </AppText>
      </Card>

      <View style={styles.list}>
        <Button
          title="🟦  Google 로그인"
          variant="ghost"
          loading={submitting}
          disabled={!googleReady}
          onPress={() => googlePromptAsync()}
        />
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
