import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { Radius, Spacing } from '@/constants/theme';
import { api } from '@/api/client';
import { PronunciationFeedback } from '@/data/types';
import { useTheme } from '@/hooks/use-theme';
import { useSession } from '@/store/session';

function Waveform({ data, color }: { data: number[]; color: string }) {
  return (
    <View style={styles.wave}>
      {data.map((v, i) => (
        <View key={i} style={[styles.waveBar, { height: 8 + v * 32, backgroundColor: color }]} />
      ))}
    </View>
  );
}

export default function PronunciationFeedbackScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { accent } = useSession();
  const { cardId } = useLocalSearchParams<{ cardId?: string }>();
  const [fb, setFb] = useState<PronunciationFeedback | null>(null);

  useEffect(() => {
    api.submitUtterance(cardId ?? 'c_pub', accent).then(setFb);
  }, [cardId, accent]);

  if (!fb) {
    return (
      <Screen>
        <AppText variant="body" color="textSecondary">
          발음을 분석하는 중…
        </AppText>
      </Screen>
    );
  }

  const scores = [
    { label: '발음', value: fb.pronunciation },
    { label: '억양', value: fb.intonation },
    { label: '유창성', value: fb.fluency },
  ];

  return (
    <Screen>
      <Card style={{ alignItems: 'center', backgroundColor: theme.tint }}>
        <AppText variant="caption" style={{ color: '#FFFFFFCC' }}>
          전체 점수
        </AppText>
        <AppText variant="display" style={{ color: '#FFFFFF' }}>
          {fb.overall}
        </AppText>
      </Card>

      <View style={styles.scoreRow}>
        {scores.map((s) => (
          <Card key={s.label} style={styles.scoreCard}>
            <AppText variant="title" color="tint">
              {s.value}
            </AppText>
            <AppText variant="caption" color="textSecondary">
              {s.label}
            </AppText>
          </Card>
        ))}
      </View>

      <AppText variant="label">문장별 파형 비교</AppText>
      {fb.sentences.map((s, i) => (
        <Card key={i}>
          <AppText variant="body">{s.text}</AppText>
          <AppText variant="caption" color="textSecondary">
            원어민
          </AppText>
          <Waveform data={s.nativeWaveform} color={theme.tint} />
          <AppText variant="caption" color="textSecondary">
            내 발화
          </AppText>
          <Waveform data={s.userWaveform} color={theme.muted} />
          <AppText variant="caption" color="tint">
            {s.note}
          </AppText>
        </Card>
      ))}

      <Card style={{ backgroundColor: theme.accentYellow }}>
        <AppText variant="label" style={{ color: theme.accentYellowText }}>
          교정 포인트
        </AppText>
        {fb.corrections.map((c, i) => (
          <AppText key={i} variant="caption" style={{ color: theme.accentYellowText }}>
            • {c}
          </AppText>
        ))}
      </Card>

      <Button title="성적표에서 확인하기" onPress={() => router.replace('/(tabs)/report')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scoreRow: { flexDirection: 'row', gap: Spacing.two },
  scoreCard: { flex: 1, alignItems: 'center' },
  wave: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 44 },
  waveBar: { flex: 1, borderRadius: Radius.sm },
});
