import type {
  User,
  SituationCard,
  ExpressionComparison,
  ProgressHistoryItem,
  Accent,
} from "../types";

export const demoUser: User = {
  id: "user_minsu",
  email: "minsu.kim@example.com",
  nickname: "김민수",
  level: "Intermediate (B1)",
  accent: "en-UK",
  goal: "study",
  dailyMinutes: 30,
  createdAt: "2026-06-01T09:00:00.000Z",
};

export const situationCards: SituationCard[] = [
  {
    id: "card_local_pub",
    title: "동네 펍 (Local Pub)",
    scenario: "영국인 동기들과 첫 소셜라이징",
    description:
      "펍에서 친구들과 모였습니다. 맥주를 주문(My round)하고 대화 리듬에 자연스럽게 녹아들어 보세요.",
    accent: "en-UK",
    goal: "study",
    estimatedMinutes: 10,
    expectedSyncRate: 62,
    completed: false,
  },
  {
    id: "card_tube_commute",
    title: "런던 튜브 타기",
    scenario: "출근길 지하철에서 길 묻기",
    description:
      "Mind the gap. 튜브에서 환승 방향을 묻고, 안내 방송의 영국식 억양에 익숙해져 보세요.",
    accent: "en-UK",
    goal: "study",
    estimatedMinutes: 8,
    expectedSyncRate: 55,
    completed: false,
  },
  {
    id: "card_seminar",
    title: "대학원 세미나 발표",
    scenario: "석사 첫 주 세미나에서 자기소개하기",
    description:
      "지도교수와 동기들 앞에서 연구 관심사를 소개합니다. 격식 있는 영국식 표현을 연습해 보세요.",
    accent: "en-UK",
    goal: "study",
    estimatedMinutes: 12,
    expectedSyncRate: 48,
    completed: true,
  },
  {
    id: "card_cafe_us",
    title: "Coffee Run",
    scenario: "미국식 카페에서 주문하기",
    description: "To-go 주문과 팁 문화를 익히며 미국식 리듬으로 대화해 보세요.",
    accent: "en-US",
    goal: "daily",
    estimatedMinutes: 7,
    expectedSyncRate: 70,
    completed: false,
  },
  {
    id: "card_barbie_au",
    title: "Aussie BBQ (Barbie)",
    scenario: "호주 친구네 주말 바비큐",
    description: "호주식 슬랭(arvo, brekkie)과 느긋한 억양에 적응해 보세요.",
    accent: "en-AU",
    goal: "travel",
    estimatedMinutes: 9,
    expectedSyncRate: 58,
    completed: false,
  },
];

export const expressionComparisons: ExpressionComparison[] = [
  {
    meaning: "약국",
    variants: [
      { accent: "en-UK", expression: "chemist's", example: "I'm popping to the chemist's for some paracetamol." },
      { accent: "en-AU", expression: "chemist", example: "Grab it from the chemist on your way home." },
      { accent: "en-US", expression: "drugstore / pharmacy", example: "I need to stop by the drugstore." },
    ],
  },
  {
    meaning: "엘리베이터",
    variants: [
      { accent: "en-UK", expression: "lift", example: "Take the lift to the third floor." },
      { accent: "en-AU", expression: "lift", example: "The lift's on the left, mate." },
      { accent: "en-US", expression: "elevator", example: "The elevator is around the corner." },
    ],
  },
  {
    meaning: "감자튀김",
    variants: [
      { accent: "en-UK", expression: "chips", example: "Fancy some fish and chips?" },
      { accent: "en-AU", expression: "chips / hot chips", example: "Let's get some hot chips." },
      { accent: "en-US", expression: "fries", example: "Can I get fries with that?" },
    ],
  },
  {
    meaning: "친구 / 이봐",
    variants: [
      { accent: "en-UK", expression: "mate", example: "Alright, mate?" },
      { accent: "en-AU", expression: "mate", example: "G'day mate!" },
      { accent: "en-US", expression: "buddy / dude", example: "Hey buddy, what's up?" },
    ],
  },
];

export const expressionMappings: Record<
  Accent,
  Array<{ from: string; to: string; explanation: string }>
> = {
  "en-UK": [
    { from: "drugstore", to: "chemist's", explanation: "영국에서는 약국을 chemist's라고 부릅니다." },
    { from: "elevator", to: "lift", explanation: "영국에서는 elevator 대신 lift를 씁니다." },
    { from: "french fries", to: "chips", explanation: "영국에서 감자튀김은 chips입니다." },
    { from: "apartment", to: "flat", explanation: "영국에서는 apartment를 flat이라고 합니다." },
    { from: "vacation", to: "holiday", explanation: "영국에서는 vacation 대신 holiday를 씁니다." },
    { from: "trash", to: "rubbish", explanation: "영국에서 쓰레기는 rubbish입니다." },
  ],
  "en-AU": [
    { from: "afternoon", to: "arvo", explanation: "호주 슬랭으로 오후는 arvo입니다." },
    { from: "breakfast", to: "brekkie", explanation: "호주에서는 breakfast를 brekkie라고 줄여 부릅니다." },
    { from: "mcdonald's", to: "Macca's", explanation: "호주에서는 맥도날드를 Macca's라고 부릅니다." },
    { from: "sunglasses", to: "sunnies", explanation: "호주 슬랭으로 선글라스는 sunnies입니다." },
  ],
  "en-US": [
    { from: "chemist's", to: "drugstore", explanation: "미국에서는 약국을 drugstore 또는 pharmacy라고 합니다." },
    { from: "lift", to: "elevator", explanation: "미국에서는 lift 대신 elevator를 씁니다." },
    { from: "chips", to: "fries", explanation: "미국에서 감자튀김은 fries입니다." },
    { from: "flat", to: "apartment", explanation: "미국에서는 flat 대신 apartment를 씁니다." },
  ],
};

export const progressHistory: ProgressHistoryItem[] = [
  { date: "2026-07-12", type: "pronunciation", title: "런던 튜브 타기", minutes: 12, score: 61 },
  { date: "2026-07-12", type: "expression", title: "펍 표현 세트", minutes: 8, score: 74 },
  { date: "2026-07-11", type: "pronunciation", title: "동네 펍 소셜라이징", minutes: 15, score: 58 },
  { date: "2026-07-10", type: "expression", title: "약국·마트 표현", minutes: 6, score: 80 },
  { date: "2026-07-09", type: "pronunciation", title: "대학원 세미나 발표", minutes: 20, score: 52 },
];
