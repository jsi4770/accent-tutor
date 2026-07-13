---
name: run-server
description: Build, run, and smoke-test the Accent Tutor Express/TypeScript API. Use when asked to start the server, run it, curl an endpoint, or verify a backend change actually works.
---

Node/Express + TypeScript API, driven with `curl`. All paths below are relative to `server/` (this project's root). The primary agent path is the committed smoke script — it launches the server in the background, exercises 6 representative routes plus 2 error paths, checks the log for exceptions, and shuts the server down.

## Prerequisites

Verified on macOS (Darwin), Node v24. No system packages needed beyond Node/npm.

## Setup

```bash
npm install
```

## Run (agent path)

```bash
./.claude/skills/run-server/smoke.sh
```

Exit code is nonzero if the server never comes up, an error-path status code doesn't match, or the dev-server log contains "error"/"exception". Override the port with `PORT=4000 ./.claude/skills/run-server/smoke.sh` (4000 is already the default). Dev-server output lands at `/tmp/accent-tutor-server.log`.

Routes exercised by the script (edit `smoke.sh` to add more):

| method | route | what it proves |
|---|---|---|
| GET | `/health` | server is up |
| POST | `/auth/login` | mock auth issues a token |
| GET | `/home/cards?accent=en-UK&goal=study` | mock situational cards, filtered |
| POST | `/speaking/analyze` (`noiseHint: true`) | ProsodyAnalysisProvider mock + noise-advisory flag |
| POST | `/expressions/recommend` | ExpressionRecommendationProvider mock (drugstore → chemist's) |
| GET | `/progress/report` | storytelling sync-rate report |
| POST | `/speaking/analyze` with `{}` | zod validation → 400 |
| GET | `/nope` | unknown route → 404 |

## Run (human path)

```bash
npm run dev   # tsx watch src/index.ts, http://localhost:4000, Ctrl-C to stop
```

## Test

```bash
npm run typecheck   # tsc --noEmit
```

No test suite yet beyond the typecheck and this smoke script — this is a student-project scaffold.

## Gotchas

- **`npm start` / `npm run dev` blocks the shell** — always background-launch (`(PORT=4000 npm run dev > /tmp/x.log 2>&1 &)`) and poll `/health`, never run it in the foreground from an agent.
- **Stopping by PID isn't reliable across `npm run dev`** — `tsx watch` spawns a child process, so `kill $!` on the `npm` wrapper can leave the actual server running. Use `pkill -f "tsx watch src/index.ts"` (what `smoke.sh` does) plus a `lsof -ti:$PORT | xargs kill` fallback in case the port is still held.
- **`macOS` has no `timeout` command** — don't write `timeout 30 bash -c '...'` to wait for readiness; poll with a counter loop instead (see `smoke.sh`).
