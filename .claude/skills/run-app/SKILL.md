---
name: run-app
description: Build, run, and screenshot the Accent Tutor Expo/React Native app on web. Use when asked to start the app, run it, take a screenshot of a screen, or verify a UI change actually renders.
---

Expo Router app driven via its web build. Start the Expo web dev server, then drive it headlessly with Playwright through `.claude/skills/run-app/driver.mjs` — no manual browser needed. All paths below are relative to `app/` (this project's root).

## Prerequisites

Verified on macOS (Darwin), Node v24. Playwright and its Chromium binary are already project devDependencies/cached — nothing extra to install system-wide.

## Setup

```bash
npm install                # installs playwright as a devDependency
npx playwright install chromium   # downloads the browser binary (cached after first run; ~260MB first time)
```

## Run (agent path)

1. Start the Expo web dev server in the background and poll until it serves (don't `sleep` a fixed amount — the first bundle takes 10-15s):

```bash
(npx expo start --web --port 8090 > /tmp/expo-web.log 2>&1 &)
i=0
until curl -sf http://localhost:8090 >/dev/null 2>&1 || [ $i -ge 45 ]; do sleep 2; i=$((i+1)); done
curl -sf http://localhost:8090 >/dev/null 2>&1 && echo READY || echo NOT_READY
```

2. Run the driver. It navigates 5 representative expo-router routes, screenshots each, and reports console/page errors (nonzero exit if any):

```bash
node .claude/skills/run-app/driver.mjs
# optional args: node .claude/skills/run-app/driver.mjs <baseUrl> <outDir>
# defaults: baseUrl=http://localhost:8090  outDir=/tmp/run-app-screenshots
```

3. Look at the screenshots (don't just check the exit code):

```bash
ls /tmp/run-app-screenshots
```

4. Stop the dev server:

```bash
pkill -f "expo start --web --port 8090"
lsof -ti:8090 2>/dev/null | xargs -r kill
```

Routes captured by the driver (edit `ROUTES` in `driver.mjs` to add more):

| route | screen |
|---|---|
| `/(auth)/start` | 시작 화면 |
| `/onboarding/accent-select` | 악센트 선택 |
| `/(tabs)/home` | 홈 (국가 토글 + 학습 카드) |
| `/speaking` | 실전 스피킹 (채팅 + 표현 추천 팝업) |
| `/(tabs)/report` | 성적표 (기본 발음 vs 악센트 싱크로율) |

## Run (human path)

```bash
npx expo start --web   # opens a browser tab on the Metro dev server; Ctrl-C to stop
```

## Test

```bash
npx tsc --noEmit
```

No test suite yet beyond the typecheck — this is a student-project scaffold.

## Gotchas

- **macOS has no `timeout` command** (that's Linux/coreutils). Don't use `timeout 30 bash -c '...'` to wait for the server — it fails with `command not found`. Use the poll-with-counter loop shown above instead.
- **`chromium-cli` isn't installed in this environment** — Playwright is used directly instead (`chromium.launch(...)` in `driver.mjs`). If a future environment has `chromium-cli`, that's simpler; this driver is the fallback and still works fine.
- **expo-router paths with route groups** (e.g. `(auth)`, `(tabs)`) are navigated as literal URL paths including the parens — `http://localhost:8090/(auth)/start` — this works fine with `page.goto`, no need to strip the group segment.
- **First navigation after a cold dev-server start is slow** (Metro compiles the route on demand) — `waitUntil: 'networkidle'` plus the small `waitForTimeout(1000)` in the driver handles this; a bare `goto` without waiting can screenshot a blank/partial frame.
