import { AccentCode } from '@/constants/theme';
import {
  getReportCard,
  mockChat,
  mockExpressions,
  mockFeedback,
  mockHistory,
  mockSituationCards,
  mockUser,
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

const USE_MOCKS = true;

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// Swap USE_MOCKS to false once the backend at API_BASE_URL is live.
async function request<T>(path: string, mock: T, init?: RequestInit): Promise<T> {
  if (USE_MOCKS) {
    return delay(mock);
  }
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    throw new Error(`API ${path} failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

export const api = {
  getCurrentUser(): Promise<User> {
    return request('/me', mockUser);
  },
  getSituationCards(accent: AccentCode): Promise<SituationCard[]> {
    return request(
      `/cards?accent=${accent}`,
      mockSituationCards.filter((c) => c.accent === accent),
    );
  },
  getSpeakingSession(cardId: string): Promise<ChatTurn[]> {
    return request(`/sessions/${cardId}/turns`, mockChat);
  },
  // Placeholder: real STT happens on the backend; here we just echo mock turns.
  submitUtterance(_cardId: string, _audioUri: string): Promise<PronunciationFeedback> {
    return request('/feedback', mockFeedback, { method: 'POST' });
  },
  getExpressions(): Promise<Expression[]> {
    return request('/expressions', mockExpressions);
  },
  getHistory(): Promise<HistoryEntry[]> {
    return request('/history', mockHistory);
  },
  getReportCard(accent: AccentCode): Promise<ReportCard> {
    return request(`/report?accent=${accent}`, getReportCard(accent));
  },
};
