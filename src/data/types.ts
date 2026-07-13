import { AccentCode } from '@/constants/theme';

export type LearningGoal = 'study-abroad' | 'job' | 'travel' | 'daily';

export interface User {
  id: string;
  name: string;
  level: string;
  accent: AccentCode;
  goal: LearningGoal;
  dailyGoalMinutes: number;
  streakDays: number;
  totalMinutes: number;
  badges: string[];
}

export interface SituationCard {
  id: string;
  accent: AccentCode;
  title: string;
  description: string;
  expectedSync: number;
  durationMin: number;
  completed: boolean;
}

export interface ChatTurn {
  id: string;
  role: 'tutor' | 'user';
  text: string;
  suggestion?: {
    from: string;
    to: string;
    tip: string;
  };
}

export interface PronunciationFeedback {
  overall: number;
  pronunciation: number;
  intonation: number;
  fluency: number;
  sentences: {
    text: string;
    nativeWaveform: number[];
    userWaveform: number[];
    note: string;
  }[];
  corrections: string[];
}

export interface ExpressionVariant {
  accent: AccentCode;
  phrase: string;
  example: string;
  context: string;
}

export interface Expression {
  id: string;
  meaning: string;
  variants: ExpressionVariant[];
  bookmarked: boolean;
}

export interface HistoryEntry {
  id: string;
  type: 'pronunciation' | 'expression';
  title: string;
  date: string;
  score?: number;
}

export interface ReportCard {
  city: string;
  headline: string;
  overallSync: number;
  standardAccuracy: number;
  accentProsody: number;
  nextChallenge: string;
}
