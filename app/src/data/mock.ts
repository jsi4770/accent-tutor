import { AccentCode } from '@/constants/theme';
import {
  ChatTurn,
  Expression,
  HistoryEntry,
  PronunciationFeedback,
  ReportCard,
  SituationCard,
  User,
} from './types';

export const mockUser: User = {
  id: 'u_001',
  name: '김민수',
  level: 'Intermediate B1',
  accent: 'en-UK',
  goal: 'study-abroad',
  dailyGoalMinutes: 20,
  streakDays: 3,
  totalMinutes: 420,
  badges: ['첫 발화', '3일 연속', '표현 수집가'],
};

export const mockSituationCards: SituationCard[] = [
  {
    id: 'c_pub',
    accent: 'en-UK',
    title: '동네 펍 (Local Pub) — 영국인 동기들과 첫 소셜라이징',
    description:
      '펍에서 친구들과 모였습니다. 맥주를 주문(My round)하고 대화 리듬에 자연스럽게 녹아들어 보세요.',
    expectedSync: 4,
    durationMin: 8,
    completed: false,
  },
  {
    id: 'c_tube',
    accent: 'en-UK',
    title: '런던 튜브 타기 — 길 묻고 환승하기',
    description: 'Mind the gap. 튜브에서 방향을 묻고 환승 정보를 확인하는 상황입니다.',
    expectedSync: 3,
    durationMin: 6,
    completed: true,
  },
  {
    id: 'c_lecture',
    accent: 'en-UK',
    title: '대학원 세미나 — 교수님께 질문하기',
    description: '세미나 후 교수님께 정중하게 후속 질문을 던지는 학술 상황입니다.',
    expectedSync: 5,
    durationMin: 10,
    completed: false,
  },
  {
    id: 'c_cafe',
    accent: 'en-AU',
    title: '시드니 카페 — 브런치 주문하기',
    description: 'Flat white 한 잔과 브런치를 호주식 억양으로 주문해 보세요.',
    expectedSync: 3,
    durationMin: 5,
    completed: false,
  },
  {
    id: 'c_interview',
    accent: 'en-US',
    title: '뉴욕 인터뷰 — 스몰토크로 시작하기',
    description: '면접 전 가벼운 스몰토크로 분위기를 풀어가는 미국식 비즈니스 상황입니다.',
    expectedSync: 4,
    durationMin: 9,
    completed: false,
  },
];

export const mockChat: ChatTurn[] = [
  {
    id: 't1',
    role: 'tutor',
    text: "Evening! What can I get you lot? First round's on the house.",
  },
  {
    id: 't2',
    role: 'user',
    text: "I'll go to the drugstore first, then get a beer.",
    suggestion: {
      from: 'drugstore',
      to: "chemist's",
      tip: '문법은 완벽해요! 하지만 영국 현지에서는 drugstore 대신 chemist\'s라고 하면 런던 현지인 느낌을 200% 살릴 수 있어요.',
    },
  },
  {
    id: 't3',
    role: 'tutor',
    text: "Good shout. The chemist's is just round the corner. It's your round, then?",
  },
];

export const mockFeedback: PronunciationFeedback = {
  overall: 78,
  pronunciation: 84,
  intonation: 71,
  fluency: 79,
  sentences: [
    {
      text: "It's your round, then?",
      nativeWaveform: [0.2, 0.6, 0.9, 0.5, 0.7, 0.3, 0.8, 0.4],
      userWaveform: [0.3, 0.5, 0.6, 0.7, 0.4, 0.5, 0.6, 0.5],
      note: '문미 상승 억양(rising intonation)을 조금 더 살려 보세요.',
    },
    {
      text: "The chemist's is round the corner.",
      nativeWaveform: [0.4, 0.8, 0.5, 0.6, 0.9, 0.3, 0.5, 0.7],
      userWaveform: [0.4, 0.7, 0.5, 0.5, 0.7, 0.4, 0.5, 0.6],
      note: 'chemist의 첫 음절 강세가 정확합니다. 좋아요!',
    },
  ],
  corrections: [
    "'round'의 모음을 영국식으로 더 둥글게 발음해 보세요.",
    "문장 끝 't'를 살짝 흘리는 영국식 글로탈 스톱을 연습해 보세요.",
  ],
};

export const mockExpressions: Expression[] = [
  {
    id: 'e_pharmacy',
    meaning: '약국',
    bookmarked: true,
    variants: [
      { accent: 'en-UK', phrase: "chemist's", example: "I'm popping to the chemist's.", context: '영국에서 가장 자연스러운 표현' },
      { accent: 'en-AU', phrase: 'chemist', example: "I'll grab it from the chemist.", context: '호주도 chemist를 흔히 사용' },
      { accent: 'en-US', phrase: 'drugstore / pharmacy', example: "I'm heading to the drugstore.", context: '미국식 표준 표현' },
    ],
  },
  {
    id: 'e_elevator',
    meaning: '엘리베이터',
    bookmarked: false,
    variants: [
      { accent: 'en-UK', phrase: 'lift', example: "Take the lift to the third floor.", context: '영국식 필수 어휘' },
      { accent: 'en-AU', phrase: 'lift', example: "The lift's over there.", context: '호주도 lift 사용' },
      { accent: 'en-US', phrase: 'elevator', example: 'Take the elevator up.', context: '미국식 표준 표현' },
    ],
  },
  {
    id: 'e_fries',
    meaning: '감자튀김',
    bookmarked: false,
    variants: [
      { accent: 'en-UK', phrase: 'chips', example: 'Fish and chips, please.', context: '영국에서 chips = 감자튀김' },
      { accent: 'en-AU', phrase: 'chips', example: 'A serve of hot chips.', context: '호주도 chips 사용' },
      { accent: 'en-US', phrase: 'fries', example: 'Can I get fries with that?', context: '미국식 표준 표현' },
    ],
  },
];

export const mockHistory: HistoryEntry[] = [
  { id: 'h1', type: 'pronunciation', title: '런던 튜브 타기', date: '2026-07-12', score: 74 },
  { id: 'h2', type: 'expression', title: '약국 표현 3종 비교', date: '2026-07-12' },
  { id: 'h3', type: 'pronunciation', title: '동네 펍 소셜라이징', date: '2026-07-11', score: 78 },
  { id: 'h4', type: 'expression', title: '교통수단 어휘', date: '2026-07-10' },
];

const reportByAccent: Record<AccentCode, ReportCard> = {
  'en-UK': {
    city: '런던',
    headline: "김민수 님은 지금 '런던 출근 3일 차', 영국인 싱크로율 58%",
    overallSync: 58,
    standardAccuracy: 82,
    accentProsody: 58,
    nextChallenge: '기본기 다지며 다시 도전하기 (런던 튜브 타기 상황극)',
  },
  'en-AU': {
    city: '시드니',
    headline: "김민수 님은 지금 '시드니 정착 1주 차', 호주인 싱크로율 46%",
    overallSync: 46,
    standardAccuracy: 80,
    accentProsody: 46,
    nextChallenge: '시드니 카페 브런치 주문 상황극에 도전하기',
  },
  'en-US': {
    city: '뉴욕',
    headline: "김민수 님은 지금 '뉴욕 적응 중', 미국인 싱크로율 71%",
    overallSync: 71,
    standardAccuracy: 85,
    accentProsody: 71,
    nextChallenge: '뉴욕 인터뷰 스몰토크 상황극에 도전하기',
  },
};

export function getReportCard(accent: AccentCode): ReportCard {
  return reportByAccent[accent];
}
