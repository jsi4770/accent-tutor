# Accent Tutor — Mobile App (Expo + TypeScript)

AI 기반 다중 악센트(en-UK / en-AU / en-US) 영어 스피킹 튜터 앱의 프론트엔드 스캐폴드입니다.
제품 요구사항과 화면 명세는 상위 폴더의 문서를 참고하세요:

- [`../docs/PRD.md`](../docs/PRD.md) — 제품 요구사항 (한 단락 PRD + 6질문)
- [`../docs/SCREENS.md`](../docs/SCREENS.md) — 화면 흐름 명세 (source of truth)

## 실행 방법

```bash
npm install        # 의존성 설치 (최초 1회)
npx expo start     # Metro 번들러 시작 → i(iOS) / a(Android) / w(web)
```

타입 체크:

```bash
npx tsc --noEmit
```

## 폴더 구조

```
app/
├─ src/
│  ├─ app/                     # expo-router 파일 기반 라우트
│  │  ├─ _layout.tsx           # 루트 Stack + Provider (세션/테마)
│  │  ├─ index.tsx             # /(auth)/start 로 리다이렉트
│  │  ├─ (auth)/               # start · signup · login
│  │  ├─ onboarding/           # accent-select · level-test · goal-setting
│  │  ├─ (tabs)/               # 하단 탭: home · history · report · mypage
│  │  ├─ speaking.tsx          # ★ 실시간 스피킹 + 표현 추천 팝업
│  │  ├─ pronunciation-feedback.tsx  # 발음 점수 · 파형 비교
│  │  ├─ expression-learning.tsx     # 악센트별 표현 비교 · 북마크
│  │  ├─ expression-summary.tsx      # 표현 학습 요약
│  │  ├─ review.tsx            # 복습 (발음/표현 탭)
│  │  ├─ profile.tsx           # 프로필 · 뱃지 · 점수 추이
│  │  └─ my-info.tsx           # 계정 설정
│  ├─ components/              # UI 키트 (Screen, Button, Card, Badge, ...)
│  ├─ constants/theme.ts       # 색상 · 간격 · 악센트 메타
│  ├─ data/                    # types.ts (인터페이스) + mock.ts (목업 데이터)
│  ├─ api/client.ts            # 얇은 API 클라이언트 (현재 목업)
│  ├─ store/session.tsx        # 선택한 악센트 공유 컨텍스트
│  └─ hooks/                   # use-theme / use-color-scheme
├─ assets/
└─ app.json
```

## 화면 흐름

```
start → signup/login → accent-select → level-test → goal-setting → (tabs)/home
home → speaking → pronunciation-feedback
home → expression-learning → expression-summary
tabs: home · history · report · mypage
```

## 백엔드 연동

이 앱 레이어는 실제 오디오 녹음 · STT · TTS · AI 호출을 구현하지 않습니다.
모든 데이터는 `src/api/client.ts`를 통해 제공되며 현재는 `src/data/mock.ts`의 목업을 반환합니다.

실제 백엔드가 준비되면:

1. `src/api/client.ts` 상단의 `USE_MOCKS` 를 `false` 로 변경
2. `API_BASE_URL` (`http://localhost:4000`) 을 실제 서버 주소로 설정

`request()` 헬퍼가 이미 `fetch` 경로를 포함하고 있어 목업 → 실 API 전환이 매끄럽습니다.
녹음/STT가 필요한 지점(`speaking.tsx`, `submitUtterance`)에는 플레이스홀더 주석이 있습니다.
