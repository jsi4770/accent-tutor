import type { Accent, ProsodyAnalysisResult, SentenceBreakdown } from "../types";

export interface ProsodyAnalysisInput {
  targetAccent: Accent;
  transcript?: string;
  audioBase64?: string;
  noiseHint?: boolean;
}

export interface ProsodyAnalysisProvider {
  analyze(input: ProsodyAnalysisInput): Promise<ProsodyAnalysisResult>;
}

function seededScore(seed: string, min: number, max: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
  }
  return min + (hash % (max - min + 1));
}

function splitSentences(transcript: string): string[] {
  const parts = transcript
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length ? parts : [transcript.trim() || "(no speech captured)"];
}

export class MockProsodyAnalysisProvider implements ProsodyAnalysisProvider {
  async analyze(input: ProsodyAnalysisInput): Promise<ProsodyAnalysisResult> {
    const transcript = input.transcript ?? "Hello, I'd like a pint please. Where is the drugstore?";
    const sentences: SentenceBreakdown[] = splitSentences(transcript).map((sentence) => {
      const pronunciationScore = seededScore(sentence + "p", 55, 92);
      const prosodyScore = seededScore(sentence + input.targetAccent, 40, 85);
      const corrections: string[] = [];
      if (prosodyScore < 60) {
        corrections.push(
          `${input.targetAccent} 억양의 문장 끝 억양(intonation)을 조금 더 올려보세요.`,
        );
      }
      if (pronunciationScore < 70) {
        corrections.push("모음을 더 또렷하게 발음하면 명료도가 올라갑니다.");
      }
      if (!corrections.length) {
        corrections.push("좋습니다. 원어민 리듬에 가깝게 발화했어요.");
      }
      return { sentence, pronunciationScore, prosodyScore, corrections };
    });

    const standardAccuracy = Math.round(
      sentences.reduce((a, s) => a + s.pronunciationScore, 0) / sentences.length,
    );
    const accentSyncRate = Math.round(
      sentences.reduce((a, s) => a + s.prosodyScore, 0) / sentences.length,
    );
    const fluency = seededScore(transcript, 50, 88);
    const overallScore = Math.round((standardAccuracy + accentSyncRate + fluency) / 3);

    // Noise-robust exception handling (PRD 핵심 기능 ③): we surface a flag/advisory
    // instead of forcing endless repetition. Real ambient-noise DSP is out of scope
    // for this scaffold — the frontend uses this flag to show the "안심 모드" state.
    const noiseDetected = Boolean(input.noiseHint);
    const noiseAdvisory = noiseDetected
      ? "주변 소음이 감지되었습니다. 발음이 씹혀도 반복을 강요하지 않으니 편하게 이어가세요."
      : null;

    return {
      targetAccent: input.targetAccent,
      overallScore,
      standardAccuracy,
      accentSyncRate,
      fluency,
      sentences,
      noiseDetected,
      noiseAdvisory,
    };
  }
}

/**
 * TODO(real-integration): 실제 발음/운율 스코어링으로 교체.
 * 예) 음성 스코어링 API 호출 또는 Anthropic/OpenAI로 정성 피드백 생성.
 * 자격 증명은 process.env에서 읽고 절대 하드코딩하지 않는다.
 *   const apiKey = process.env.SPEECH_PROVIDER_API_KEY;
 *   const anthropicKey = process.env.ANTHROPIC_API_KEY;
 * audioBase64를 실제 스코어링 엔드포인트로 전송하고 결과를 ProsodyAnalysisResult로 매핑한다.
 */
export class RealProsodyAnalysisProvider implements ProsodyAnalysisProvider {
  async analyze(_input: ProsodyAnalysisInput): Promise<ProsodyAnalysisResult> {
    throw new Error("RealProsodyAnalysisProvider not implemented — configure SPEECH_PROVIDER_API_KEY and implement.");
  }
}

export function getProsodyAnalysisProvider(): ProsodyAnalysisProvider {
  // Swap to RealProsodyAnalysisProvider once credentials + implementation exist.
  return new MockProsodyAnalysisProvider();
}
