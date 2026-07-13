import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { ProgressBar } from '@/components/progress-bar';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const questions = [
  {
    id: 'q1',
    kind: 'listen' as const,
    prompt: '들려주는 문장의 의미로 알맞은 것은?',
    options: ['다음 역에서 내리세요', '표를 미리 예매하세요', '엘리베이터를 이용하세요'],
  },
  {
    id: 'q2',
    kind: 'speak' as const,
    prompt: "다음 문장을 따라 읽어 보세요: \"It's your round, then?\"",
    options: [],
  },
];

export default function LevelTestScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [step, setStep] = useState(0);
  const q = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  const next = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      router.push('/onboarding/goal-setting');
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="caption" color="textSecondary">
          레벨 테스트 {step + 1} / {questions.length}
        </AppText>
        <ProgressBar value={progress} />
      </View>

      <AppText variant="subtitle">{q.prompt}</AppText>

      {q.kind === 'listen' ? (
        <>
          <Button title="🔊 듣기 재생" variant="secondary" onPress={() => {}} />
          <View style={styles.list}>
            {q.options.map((opt, i) => (
              <Card key={i} onPress={next}>
                <AppText variant="body">{opt}</AppText>
              </Card>
            ))}
          </View>
        </>
      ) : (
        <View style={styles.speakArea}>
          <Pressable
            onPress={next}
            style={[styles.mic, { backgroundColor: theme.tint }]}>
            <AppText style={styles.micIcon}>🎙️</AppText>
          </Pressable>
          <AppText variant="caption" color="textSecondary">
            버튼을 눌러 녹음 (스캐폴드 — 실제 녹음 미구현)
          </AppText>
        </View>
      )}

      <Button title="테스트 스킵" variant="ghost" onPress={() => router.push('/onboarding/goal-setting')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: Spacing.two },
  list: { gap: Spacing.two },
  speakArea: { alignItems: 'center', gap: Spacing.three, paddingVertical: Spacing.four },
  mic: {
    width: 96,
    height: 96,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micIcon: { fontSize: 40 },
});
