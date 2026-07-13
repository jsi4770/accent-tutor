import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { Spacing } from '@/constants/theme';

export default function StartScreen() {
  const router = useRouter();

  return (
    <Screen scroll={false} contentStyle={styles.content}>
      <View style={styles.hero}>
        <AppText style={styles.emoji}>🗣️</AppText>
        <AppText variant="display" style={styles.center}>
          악센트까지 배우는{'\n'}영어 스피킹
        </AppText>
        <AppText variant="body" color="textSecondary" style={styles.center}>
          목적지 국가(UK · AU · US)의 억양과 현지 표현을 AI 튜터와 함께 연습하세요. 소음 환경에서도
          무한 반복 없이 학습할 수 있어요.
        </AppText>
      </View>
      <View style={styles.actions}>
        <Button title="회원가입" onPress={() => router.push('/(auth)/signup')} />
        <Button title="로그인" variant="secondary" onPress={() => router.push('/(auth)/login')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { justifyContent: 'space-between' },
  hero: { flex: 1, justifyContent: 'center', gap: Spacing.three },
  emoji: { fontSize: 64, textAlign: 'center' },
  center: { textAlign: 'center' },
  actions: { gap: Spacing.two },
});
