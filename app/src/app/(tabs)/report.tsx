import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AccentToggle } from '@/components/accent-toggle';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { ProgressBar } from '@/components/progress-bar';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { Accents, Radius, Spacing } from '@/constants/theme';
import { api } from '@/api/client';
import { ReportCard } from '@/data/types';
import { useTheme } from '@/hooks/use-theme';
import { useSession } from '@/store/session';

export default function ReportScreen() {
  const theme = useTheme();
  const { accent, setAccent } = useSession();
  const [report, setReport] = useState<ReportCard | null>(null);

  useEffect(() => {
    api.getReportCard(accent).then(setReport);
  }, [accent]);

  return (
    <Screen>
      <AppText variant="title">성적표</AppText>
      <AccentToggle value={accent} onChange={setAccent} />

      {report && (
        <>
          <Card style={{ backgroundColor: theme.tint }}>
            <AppText style={styles.landmark}>🏙️</AppText>
            <AppText variant="subtitle" style={{ color: '#FFFFFF' }}>
              {report.headline}
            </AppText>
            <View style={styles.gauge}>
              <AppText variant="display" style={{ color: '#FFFFFF' }}>
                {report.overallSync}%
              </AppText>
              <AppText variant="caption" style={{ color: '#FFFFFFCC' }}>
                {Accents[accent].country}인 싱크로율
              </AppText>
            </View>
          </Card>

          <Card>
            <AppText variant="label">지표 1 · 탄탄한 기본 발음 (Standard Accuracy)</AppText>
            <AppText variant="caption" color="textSecondary">
              억양과 무관한 딕션 명료도
            </AppText>
            <View style={styles.metricRow}>
              <ProgressBar value={report.standardAccuracy} color={theme.success} />
              <AppText variant="label" color="success">
                {report.standardAccuracy}
              </AppText>
            </View>
          </Card>

          <Card>
            <AppText variant="label">
              지표 2 · {Accents[accent].label} 악센트 싱크로율 (Prosody)
            </AppText>
            <AppText variant="caption" color="textSecondary">
              고저차 · 리듬감(운율) 정밀 추출 점수
            </AppText>
            <View style={styles.metricRow}>
              <ProgressBar value={report.accentProsody} color={theme.tint} />
              <AppText variant="label" color="tint">
                {report.accentProsody}
              </AppText>
            </View>
          </Card>

          <Card style={{ backgroundColor: theme.accentYellow }}>
            <AppText variant="caption" style={{ color: theme.accentYellowText }}>
              다음 챌린지
            </AppText>
            <AppText variant="label" style={{ color: theme.accentYellowText }}>
              {report.nextChallenge}
            </AppText>
            <Button title="도전하기" variant="secondary" onPress={() => {}} style={styles.mt} />
          </Card>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  landmark: { fontSize: 40 },
  gauge: { alignItems: 'center', marginTop: Spacing.two },
  metricRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginTop: Spacing.one },
  mt: { marginTop: Spacing.two, borderRadius: Radius.md },
});
