export type Accent = "en-UK" | "en-AU" | "en-US";

export const ACCENTS: Accent[] = ["en-UK", "en-AU", "en-US"];

export type LearningGoal = "study" | "job" | "travel" | "daily";

export const LEARNING_GOALS: LearningGoal[] = ["study", "job", "travel", "daily"];

export interface User {
  id: string;
  email: string;
  nickname: string;
  level: string;
  accent: Accent;
  goal: LearningGoal;
  dailyMinutes: number;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: Pick<User, "id" | "email" | "nickname">;
}

export interface SituationCard {
  id: string;
  title: string;
  scenario: string;
  description: string;
  accent: Accent;
  goal: LearningGoal;
  estimatedMinutes: number;
  expectedSyncRate: number;
  completed: boolean;
}

export interface LevelTestResult {
  level: string;
  score: number;
  recommendedAccent: Accent;
  summary: string;
}

export interface SentenceBreakdown {
  sentence: string;
  pronunciationScore: number;
  prosodyScore: number;
  corrections: string[];
}

export interface ProsodyAnalysisResult {
  targetAccent: Accent;
  overallScore: number;
  standardAccuracy: number;
  accentSyncRate: number;
  fluency: number;
  sentences: SentenceBreakdown[];
  noiseDetected: boolean;
  noiseAdvisory: string | null;
}

export interface ExpressionRecommendation {
  original: string;
  suggestion: string;
  targetAccent: Accent;
  explanation: string;
  confidence: number;
  source: "mock-mapping" | "llm";
}

export interface ExpressionComparison {
  meaning: string;
  variants: Array<{ accent: Accent; expression: string; example: string }>;
}

export interface ProgressHistoryItem {
  date: string;
  type: "pronunciation" | "expression";
  title: string;
  minutes: number;
  score: number;
}

export interface ProgressReport {
  storyHeadline: string;
  city: string;
  accentSyncRate: number;
  cumulativeGaugePercent: number;
  standardAccuracy: number;
  prosodyScore: number;
  streakDays: number;
  totalMinutes: number;
  nextChallenge: string;
}
