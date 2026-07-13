import { AccentCode } from '@/constants/theme';
import {
  mockChat,
  mockExpressions,
  mockFeedback,
  mockHistory,
  mockSituationCards,
  mockUser,
  getReportCard as getMockReportCard,
} from '@/data/mock';
import {
  ChatTurn,
  Expression,
  HistoryEntry,
  PronunciationFeedback,
  ReportCard,
  SituationCard,
  User,
} from '@/data/types';

export const API_BASE_URL = 'http://localhost:4000';

// Flip to true to develop the UI without the backend running (server/ scaffold).
const USE_MOCKS = false;

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    throw new Error(`API ${path} failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

// ---- server response shapes (only the fields this app reads) ----
interface ServerProfile {
  id: string;
  nickname: string;
  level: string;
  accent: AccentCode;
  goal: 'study' | 'job' | 'travel' | 'daily';
  dailyMinutes: number;
  badges: string[];
  cumulativeMinutes: number;
}
interface ServerProgressHistory {
  streakDays: number;
  totalMinutes: number;
  items: { date: string; type: 'pronunciation' | 'expression'; title: string; minutes: number; score: number }[];
}
interface ServerCard {
  id: string;
  title: string;
  scenario: string;
  description: string;
  accent: AccentCode;
  estimatedMinutes: number;
  expectedSyncRate: number;
  completed: boolean;
}
interface ServerHomeCards {
  todayCards: ServerCard[];
}
interface ServerAnalysis {
  overallScore: number;
  standardAccuracy: number;
  accentSyncRate: number;
  fluency: number;
  sentences: { sentence: string; pronunciationScore: number; prosodyScore: number; corrections: string[] }[];
}
interface ServerRecommendation {
  original: string;
  suggestion: string;
  explanation: string;
}
interface ServerExpressionComparisons {
  comparisons: { meaning: string; variants: { accent: AccentCode; expression: string; example: string }[] }[];
}
interface ServerReport {
  city: string;
  storyHeadline: string;
  accentSyncRate: number;
  standardAccuracy: number;
  prosodyScore: number;
  nextChallenge: string;
}
interface ServerLevelTestResult {
  level: string;
  score: number;
  recommendedAccent: AccentCode;
  summary: string;
}

export interface LevelTestAnswer {
  questionId: string;
  type: 'listening' | 'speaking';
  response: string;
}

const goalFromServer: Record<ServerProfile['goal'], User['goal']> = {
  study: 'study-abroad',
  job: 'job',
  travel: 'travel',
  daily: 'daily',
};

const goalToServer: Record<User['goal'], ServerProfile['goal']> = {
  'study-abroad': 'study',
  job: 'job',
  travel: 'travel',
  daily: 'daily',
};

function syncRateToStars(rate: number): number {
  return Math.min(5, Math.max(1, Math.round(rate / 20)));
}

// Deterministic pseudo-waveform for a sentence's score — the server scores
// pronunciation/prosody but doesn't emit raw waveform samples (out of scope
// for this scaffold's mock speech provider), so the app derives a visual
// shape from the score itself: same seed -> same bars every render.
function waveformFromScore(seed: string, score: number): number[] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) % 1000;
  const bars = 8;
  const base = score / 100;
  return Array.from({ length: bars }, (_, i) => {
    const jitter = ((hash * (i + 1)) % 17) / 100;
    return Math.max(0.15, Math.min(1, base - 0.15 + jitter));
  });
}

// The backend has no modeled chat session — /speaking is a single-shot
// transcript -> analysis call, not a conversation. This demo utterance
// stands in for real STT/audio capture (out of scope for this scaffold).
const DEMO_UTTERANCE = "I'll go to the drugstore first, then get a beer.";

export const api = {
  async getCurrentUser(): Promise<User> {
    if (USE_MOCKS) return delay(mockUser);
    const [profile, history] = await Promise.all([
      http<ServerProfile>('/users/me/profile'),
      http<ServerProgressHistory>('/progress/history'),
    ]);
    return {
      id: profile.id,
      name: profile.nickname,
      level: profile.level,
      accent: profile.accent,
      goal: goalFromServer[profile.goal],
      dailyGoalMinutes: profile.dailyMinutes,
      streakDays: history.streakDays,
      totalMinutes: profile.cumulativeMinutes,
      badges: profile.badges,
    };
  },

  async getSituationCards(accent: AccentCode): Promise<SituationCard[]> {
    if (USE_MOCKS) return delay(mockSituationCards.filter((c) => c.accent === accent));
    const data = await http<ServerHomeCards>(`/home/cards?accent=${accent}`);
    return data.todayCards.map((c) => ({
      id: c.id,
      accent: c.accent,
      title: `${c.title} — ${c.scenario}`,
      description: c.description,
      expectedSync: syncRateToStars(c.expectedSyncRate),
      durationMin: c.estimatedMinutes,
      completed: c.completed,
    }));
  },

  // Tutor's opening/closing lines are static UI copy (no chat-session endpoint
  // exists yet); the "user" turn's suggestion popup is a real call to the
  // expression-recommendation service so it reflects the live provider.
  async getSpeakingSession(_cardId: string, accent: AccentCode): Promise<ChatTurn[]> {
    if (USE_MOCKS) return delay(mockChat);
    const rec = await http<ServerRecommendation>('/expressions/recommend', {
      method: 'POST',
      body: JSON.stringify({ transcript: DEMO_UTTERANCE, targetAccent: accent }),
    });
    const changed = rec.suggestion.toLowerCase() !== rec.original.toLowerCase();
    return [
      { id: 't1', role: 'tutor', text: "Evening! What can I get you lot? First round's on the house." },
      {
        id: 't2',
        role: 'user',
        text: rec.original,
        suggestion: changed ? { from: rec.original, to: rec.suggestion, tip: rec.explanation } : undefined,
      },
      { id: 't3', role: 'tutor', text: "Good shout. It's your round, then?" },
    ];
  },

  async submitUtterance(_cardId: string, accent: AccentCode): Promise<PronunciationFeedback> {
    if (USE_MOCKS) return delay(mockFeedback, 800);
    const result = await http<ServerAnalysis>('/speaking/analyze', {
      method: 'POST',
      body: JSON.stringify({ transcript: DEMO_UTTERANCE, targetAccent: accent, noiseHint: true }),
    });
    return {
      overall: result.overallScore,
      pronunciation: result.standardAccuracy,
      intonation: result.accentSyncRate,
      fluency: result.fluency,
      sentences: result.sentences.map((s) => ({
        text: s.sentence,
        nativeWaveform: waveformFromScore(s.sentence + 'native', 90),
        userWaveform: waveformFromScore(s.sentence + 'user', s.pronunciationScore),
        note: s.corrections[0] ?? '좋습니다.',
      })),
      corrections: [...new Set(result.sentences.flatMap((s) => s.corrections))],
    };
  },

  async getExpressions(): Promise<Expression[]> {
    if (USE_MOCKS) return delay(mockExpressions);
    const data = await http<ServerExpressionComparisons>('/expressions/by-accent');
    return data.comparisons.map((c, idx) => ({
      id: `expr_${idx}`,
      meaning: c.meaning,
      bookmarked: false, // no bookmark persistence on the backend yet
      variants: c.variants.map((v) => ({
        accent: v.accent,
        phrase: v.expression,
        example: v.example,
        context: '',
      })),
    }));
  },

  async getHistory(): Promise<HistoryEntry[]> {
    if (USE_MOCKS) return delay(mockHistory);
    const data = await http<ServerProgressHistory>('/progress/history');
    return data.items.map((item, idx) => ({
      id: `${item.date}_${item.type}_${idx}`,
      type: item.type,
      title: item.title,
      date: item.date,
      score: item.score,
    }));
  },

  async getReportCard(accent: AccentCode): Promise<ReportCard> {
    if (USE_MOCKS) return delay(getMockReportCard(accent));
    const r = await http<ServerReport>(`/progress/report?accent=${accent}`);
    return {
      city: r.city,
      headline: r.storyHeadline,
      overallSync: r.accentSyncRate,
      standardAccuracy: r.standardAccuracy,
      accentProsody: r.prosodyScore,
      nextChallenge: r.nextChallenge,
    };
  },

  async updateAccent(accent: AccentCode): Promise<void> {
    if (USE_MOCKS) return delay(undefined);
    await http('/users/me/accent', { method: 'PUT', body: JSON.stringify({ accent }) });
  },

  async submitLevelTest(input: { answers?: LevelTestAnswer[]; skipped?: boolean }): Promise<ServerLevelTestResult> {
    if (USE_MOCKS) {
      return delay({
        level: 'Intermediate (B1)',
        score: 65,
        recommendedAccent: 'en-UK',
        summary: '스캐폴드 mock 결과입니다.',
      });
    }
    const result = await http<ServerLevelTestResult>('/level-test/submit', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    // Persist the estimated level onto the profile so home/profile/mypage reflect it.
    await http('/users/me/profile', { method: 'PUT', body: JSON.stringify({ level: result.level }) });
    return result;
  },

  async updateGoal(goal: User['goal'], dailyMinutes: number): Promise<void> {
    if (USE_MOCKS) return delay(undefined);
    await http('/users/me/goal', {
      method: 'PUT',
      body: JSON.stringify({ goal: goalToServer[goal], dailyMinutes }),
    });
  },
};
