# Accent Tutor — 아산 AX 4조 개인 프로젝트

AI 기반 다중 악센트(en-UK / en-AU / en-US) 영어 스피킹 튜터링 앱. 10주 학생 프로젝트 스캐폴드.

## 문서

- [`docs/PRD.md`](docs/PRD.md) — 제품 요구사항 (한 단락 PRD + 6질문 워크시트, 필요 데이터/제약사항)
- [`docs/SCREENS.md`](docs/SCREENS.md) — 전체 화면 흐름 및 화면별 상세 명세 (source of truth)

두 문서 모두 **가설(v1)** 이며, 실제 인터뷰로 검증되면 갱신 예정.

## 프로젝트 구조

```
personalPRD/
├─ docs/       PRD, 화면 명세
├─ app/        모바일 앱 (Expo + React Native + TypeScript, expo-router)
└─ server/     백엔드 API (Express + TypeScript, AI 연동 지점은 provider 인터페이스로 스텁 처리)
```

## 실행 방법

```bash
# 백엔드
cd server
npm install
npm run dev          # http://localhost:4000

# 앱 (다른 터미널)
cd app
npm install
npx expo start        # i / a / w 로 iOS·Android·웹 실행
```

앱의 API 클라이언트(`app/src/api/client.ts`)는 기본적으로 `USE_MOCKS = true`로 목데이터를 반환한다. 백엔드를 띄운 뒤 `USE_MOCKS`를 끄고 base URL(`http://localhost:4000`)로 실제 fetch를 붙이면 된다.

## 현재 범위: 무엇이 진짜고 무엇이 목(mock)인가

핵심 기능 3개(다중 악센트 분석, NLP 표현 추천, 소음 예외 처리) 모두 **UI/API 형태는 실제로 동작**하지만, 그 안의 AI 로직은 목데이터/스텁이다:

- `server/src/services/ProsodyAnalysisProvider.ts` — 발음/운율 채점. Mock 구현이 그럴듯한 점수를 반환. 실제 음성 분석 API 연동 지점이 `Real` 스텁으로 표시되어 있음(호출 시 throw).
- `server/src/services/ExpressionRecommendationProvider.ts` — 현지 표현 추천. Mock은 하드코딩된 매핑 테이블(drugstore→chemist's 등) 기반. 실제 LLM 연동 지점이 스텁으로 표시.
- 소음 감지/필터링은 실제 오디오 DSP 없이, 요청 플래그(`noiseHint`)에 따른 응답 필드(`noiseDetected`, `noiseAdvisory`)로만 표현.
- 인증은 소셜 로그인 연동 없이 mock 토큰 발급.

다음 단계로 실제 AI를 붙일 때는 각 provider 인터페이스의 `Real` 구현체만 채우면 되도록 구조를 잡아뒀다 (API 키는 `.env`에서 읽음, `server/.env.example` 참고).

## 다음 단계

- 실제 인터뷰로 PRD 검증 → PRD.md v2 갱신
- `docs/SCREENS.md`의 "결정 필요 사항"(복습 화면 탭 구조 등) 확정
- 각 AI 기능의 실제 provider 구현 (음성 인식/운율 분석 API, LLM 기반 표현 추천)
- 앱 ↔ 서버 실제 연동 (mock 해제)
