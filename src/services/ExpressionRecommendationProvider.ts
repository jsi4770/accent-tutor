import type { Accent, ExpressionRecommendation } from "../types";
import { expressionMappings } from "../data/mockData";

export interface ExpressionRecommendationInput {
  transcript: string;
  targetAccent: Accent;
}

export interface ExpressionRecommendationProvider {
  recommend(input: ExpressionRecommendationInput): Promise<ExpressionRecommendation>;
}

export class MockExpressionRecommendationProvider
  implements ExpressionRecommendationProvider
{
  async recommend(
    input: ExpressionRecommendationInput,
  ): Promise<ExpressionRecommendation> {
    const lower = input.transcript.toLowerCase();
    const table = expressionMappings[input.targetAccent] ?? [];
    const hit = table.find((entry) => lower.includes(entry.from));

    if (hit) {
      const suggestion = input.transcript.replace(
        new RegExp(hit.from, "i"),
        hit.to,
      );
      return {
        original: input.transcript,
        suggestion,
        targetAccent: input.targetAccent,
        explanation: `문법은 완벽해요! 다만 ${input.targetAccent} 현지에서는 "${hit.from}" 대신 "${hit.to}"가 더 자연스러워요. ${hit.explanation}`,
        confidence: 0.9,
        source: "mock-mapping",
      };
    }

    return {
      original: input.transcript,
      suggestion: input.transcript,
      targetAccent: input.targetAccent,
      explanation: "현지 표현으로 바꿀 만한 부분이 보이지 않아요. 자연스러운 문장이에요!",
      confidence: 0.4,
      source: "mock-mapping",
    };
  }
}

/**
 * TODO(real-integration): 하드코딩 매핑 대신 실제 LLM 호출로 교체.
 * 예) Anthropic API(claude-*)로 목적지 국가 맥락에 맞는 현지 표현을 생성.
 * 자격 증명은 process.env.ANTHROPIC_API_KEY에서 읽고 절대 하드코딩하지 않는다.
 *   const apiKey = process.env.ANTHROPIC_API_KEY;
 *   // const client = new Anthropic({ apiKey });
 *   // prompt: transcript + targetAccent → 자연스러운 현지 표현 + 설명
 * 매핑 테이블은 LLM 실패 시 fallback으로 유지한다.
 */
export class LlmExpressionRecommendationProvider
  implements ExpressionRecommendationProvider
{
  async recommend(
    _input: ExpressionRecommendationInput,
  ): Promise<ExpressionRecommendation> {
    throw new Error("LlmExpressionRecommendationProvider not implemented — configure ANTHROPIC_API_KEY and implement.");
  }
}

export function getExpressionRecommendationProvider(): ExpressionRecommendationProvider {
  // Swap to LlmExpressionRecommendationProvider once ANTHROPIC_API_KEY + implementation exist.
  return new MockExpressionRecommendationProvider();
}
