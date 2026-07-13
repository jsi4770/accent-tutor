import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { Card } from '@/components/card';
import { ProgressBar } from '@/components/progress-bar';
import { Screen } from '@/components/screen';
import { AppText } from '@/components/text';
import { Radius, Spacing } from '@/constants/theme';
import { api } from '@/api/client';
import { ChatTurn } from '@/data/types';
import { useTheme } from '@/hooks/use-theme';

export default function SpeakingScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { cardId } = useLocalSearchParams<{ cardId?: string }>();
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [recording, setRecording] = useState(false);
  const wave = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    api.getSpeakingSession(cardId ?? 'c_pub').then(setTurns);
  }, [cardId]);

  useEffect(() => {
    if (recording) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(wave, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(wave, { toValue: 0, duration: 500, useNativeDriver: true }),
        ]),
      );
      loop.start();
      return () => loop.stop();
    }
  }, [recording, wave]);

  // Placeholder: real recording + STT is handled by the backend; here we just advance the flow.
  const toggleMic = () => {
    if (recording) {
      setRecording(false);
      router.push('/pronunciation-feedback');
    } else {
      setRecording(true);
    }
  };

  return (
    <Screen>
      <View style={styles.statusRow}>
        <View style={styles.grow}>
          <AppText variant="caption" color="textSecondary">
            대화 진행도
          </AppText>
          <ProgressBar value={60} height={8} />
        </View>
      </View>

      <View style={[styles.noise, { backgroundColor: theme.tintSoft }]}>
        <AppText style={styles.dot}>🎧</AppText>
        <AppText variant="caption" color="tint">
          오디오 스트리밍 안심 모드 · 소음 자동 필터링 중
        </AppText>
      </View>

      <View style={styles.chat}>
        {turns.map((turn) => (
          <View key={turn.id}>
            {turn.suggestion && (
              <View style={[styles.popup, { backgroundColor: theme.accentYellow }]}>
                <AppText variant="caption" style={{ color: theme.accentYellowText }}>
                  💡 {turn.suggestion.tip}
                </AppText>
                <AppText variant="caption" style={{ color: theme.accentYellowText, fontWeight: '700' }}>
                  {turn.suggestion.from} → {turn.suggestion.to}
                </AppText>
              </View>
            )}
            <View
              style={[
                styles.bubble,
                turn.role === 'tutor'
                  ? { alignSelf: 'flex-start', backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }
                  : { alignSelf: 'flex-end', backgroundColor: theme.tint },
              ]}>
              <AppText
                variant="body"
                style={{ color: turn.role === 'user' ? '#FFFFFF' : theme.text }}>
                {turn.text}
              </AppText>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.micArea}>
        {recording && (
          <View style={styles.waveRow}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Animated.View
                key={i}
                style={[
                  styles.waveBar,
                  {
                    backgroundColor: theme.tint,
                    transform: [
                      {
                        scaleY: wave.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.4 + i * 0.1, 1.2 - i * 0.05],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ))}
          </View>
        )}
        <Pressable
          onPress={toggleMic}
          style={[styles.mic, { backgroundColor: recording ? theme.danger : theme.tint }]}>
          <AppText style={styles.micIcon}>{recording ? '⏹️' : '🎙️'}</AppText>
        </Pressable>
        <AppText variant="caption" color="textSecondary">
          {recording ? '녹음 중… 버튼을 눌러 피드백 보기' : '마이크를 눌러 말해보세요'}
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  grow: { flex: 1, gap: Spacing.one },
  noise: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.two,
    borderRadius: Radius.md,
  },
  dot: { fontSize: 16 },
  chat: { gap: Spacing.three, marginVertical: Spacing.two },
  popup: {
    padding: Spacing.two,
    borderRadius: Radius.md,
    marginBottom: Spacing.one,
    gap: Spacing.half,
    maxWidth: '90%',
    alignSelf: 'flex-end',
  },
  bubble: {
    maxWidth: '85%',
    padding: Spacing.three,
    borderRadius: Radius.lg,
  },
  micArea: { alignItems: 'center', gap: Spacing.two, marginTop: 'auto' },
  waveRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, height: 40 },
  waveBar: { width: 6, height: 32, borderRadius: 3 },
  mic: {
    width: 88,
    height: 88,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micIcon: { fontSize: 36 },
});
