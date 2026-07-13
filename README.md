# Accent Tutor API (Backend Scaffold)

Node.js + Express + TypeScript backend for the AI multi-accent English tutoring app
(아산 AX, 4조). Source of truth for product scope: [`../docs/PRD.md`](../docs/PRD.md)
and [`../docs/SCREENS.md`](../docs/SCREENS.md).

This is a **student-project scaffold**: the HTTP surface and the two AI-dependent
services are stubbed with realistic mock data (the Kim Minsu / London persona from the
PRD) so the frontend team can build and demo a coherent flow. No real external APIs are
called.

## Run

```bash
npm install
npm run dev        # tsx watch, http://localhost:4000 (override with PORT)
```

Other scripts:

```bash
npm run build      # tsc → dist/
npm start          # node dist/index.js
npm run typecheck  # tsc --noEmit
```

CORS is enabled for all origins so a local Expo dev client can call the API.

## Routes

| Method | Path                    | Purpose                                                        |
| ------ | ----------------------- | -------------------------------------------------------------- |
| GET    | `/health`               | Liveness check                                                 |
| POST   | `/auth/signup`          | Mock signup → fake token                                       |
| POST   | `/auth/login`           | Mock login → fake token                                        |
| GET    | `/users/me/accent`      | Get selected accent                                            |
| PUT    | `/users/me/accent`      | Set accent (`en-UK` / `en-AU` / `en-US`)                       |
| PUT    | `/users/me/goal`        | Set learning goal + daily minutes                              |
| GET    | `/users/me/profile`     | Profile screen data                                            |
| PUT    | `/users/me/profile`     | Update nickname / level                                        |
| GET    | `/users/me/settings`    | 내 정보 settings                                               |
| PUT    | `/users/me/settings`    | Update settings                                                |
| POST   | `/level-test/submit`    | Submit (or skip) level test → mock result                      |
| GET    | `/home/cards`           | Situational cards filtered by `accent` + `goal` query params   |
| POST   | `/speaking/analyze`     | Prosody/pronunciation scoring (mock provider)                  |
| POST   | `/expressions/recommend`| Local-expression suggestion (mock provider)                    |
| GET    | `/expressions/by-accent`| Cross-accent expression comparison sets                        |
| GET    | `/progress/history`     | Streak / cumulative time / per-session history                 |
| GET    | `/progress/report`      | Storytelling sync-rate report                                  |

### Query params

- `GET /home/cards?accent=en-UK&goal=study` — both optional; default to the current user.
- `GET /expressions/by-accent?accent=en-UK` — optional; omit for the full comparison set.
- `GET /progress/history?type=pronunciation` — optional filter (`pronunciation` | `expression`).

### Example

```bash
curl -X POST http://localhost:4000/speaking/analyze \
  -H 'Content-Type: application/json' \
  -d '{"targetAccent":"en-UK","transcript":"Where is the drugstore?","noiseHint":true}'
```

## Mocked vs. real

Both AI-dependent features sit behind a **provider interface** with a mock
implementation and a clearly-marked real stub. Swap the factory return value once a real
implementation + credentials exist. Credentials are always read from `process.env` and
never hardcoded — see [`.env.example`](./.env.example).

| Concern                         | Interface                          | Mock (active)                          | Real stub (TODO)                              |
| ------------------------------- | ---------------------------------- | -------------------------------------- | --------------------------------------------- |
| Prosody / pronunciation scoring | `ProsodyAnalysisProvider`          | `MockProsodyAnalysisProvider` (seeded plausible scores) | `RealProsodyAnalysisProvider` (`SPEECH_PROVIDER_API_KEY`) |
| Local expression recommendation | `ExpressionRecommendationProvider` | `MockExpressionRecommendationProvider` (hardcoded mapping table) | `LlmExpressionRecommendationProvider` (`ANTHROPIC_API_KEY`) |

Also mocked / stubbed:

- **Auth** — accepts any credentials and returns a base64 fake token. Real social login
  (구글/네이버/카카오) + self ID login + JWT signing (`JWT_SECRET`) are TODO in `src/routes/auth.ts`.
- **Noise-robust UX (PRD 핵심 기능 ③)** — `/speaking/analyze` accepts a `noiseHint` flag
  and returns `noiseDetected` + a `noiseAdvisory` message instead of forcing repetition.
  No actual audio DSP is performed; the frontend uses the flag to render the "안심 모드" state.
- **Audio** — `/speaking/analyze` takes an optional `audioBase64` stand-in; there is no
  real audio upload/decoding.
- **Persistence** — a single in-memory demo user (`src/data/store.ts`); resets on restart.

## Structure

```
src/
  index.ts                  app entry, middleware, route mounting
  types/index.ts            shared domain types (Accent, User, results…)
  middleware/
    validate.ts             zod body validation
    errorHandler.ts         404 + error middleware
  data/
    mockData.ts             Kim Minsu persona, cards, expression tables
    store.ts                in-memory user/settings store
  services/
    ProsodyAnalysisProvider.ts          interface + mock + real stub
    ExpressionRecommendationProvider.ts interface + mock + real stub
  routes/
    auth.ts users.ts levelTest.ts home.ts
    speaking.ts expressions.ts progress.ts
```

## Notes / conventions

- Validation on all POST/PUT bodies via zod; failures return `400` with field details.
- Accent is fixed to the initial scope of `en-UK` / `en-AU` / `en-US` (PRD 제약사항).
