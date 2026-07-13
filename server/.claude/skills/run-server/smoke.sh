#!/usr/bin/env bash
# Boots the API in the background, hits a representative set of routes
# (including two error paths), prints each response, then shuts the
# server down. Exit code is nonzero if health check or curls fail.
set -uo pipefail

PORT="${PORT:-4000}"
BASE="http://localhost:${PORT}"
LOG=/tmp/accent-tutor-server.log

cleanup() {
  pkill -f "tsx watch src/index.ts" >/dev/null 2>&1
  lsof -ti:"$PORT" 2>/dev/null | xargs -r kill >/dev/null 2>&1
}
trap cleanup EXIT

(PORT="$PORT" npm run dev > "$LOG" 2>&1 &)

i=0
until curl -sf "$BASE/health" >/dev/null 2>&1 || [ "$i" -ge 30 ]; do
  sleep 1; i=$((i + 1))
done
if ! curl -sf "$BASE/health" >/dev/null 2>&1; then
  echo "SERVER NEVER CAME UP — log tail:"
  tail -30 "$LOG"
  exit 1
fi

fail=0

echo "=== GET /health ==="
curl -s "$BASE/health"; echo

echo "=== POST /auth/login ==="
curl -s -X POST "$BASE/auth/login" -H 'Content-Type: application/json' \
  -d '{"email":"minsu@example.com","password":"x"}'; echo

echo "=== GET /home/cards?accent=en-UK&goal=study ==="
curl -s "$BASE/home/cards?accent=en-UK&goal=study" | head -c 400; echo

echo "=== POST /speaking/analyze (noiseHint=true) ==="
curl -s -X POST "$BASE/speaking/analyze" -H 'Content-Type: application/json' \
  -d '{"transcript":"I will go to the drugstore first, then get a beer.","targetAccent":"en-UK","noiseHint":true}'; echo

echo "=== POST /expressions/recommend ==="
curl -s -X POST "$BASE/expressions/recommend" -H 'Content-Type: application/json' \
  -d '{"transcript":"I need to buy medicine at the drugstore.","targetAccent":"en-UK"}'; echo

echo "=== GET /progress/report ==="
curl -s "$BASE/progress/report" | head -c 400; echo

echo "=== error: invalid body -> expect 400 ==="
status=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/speaking/analyze" -H 'Content-Type: application/json' -d '{}')
echo "status=$status"
[ "$status" = "400" ] || fail=1

echo "=== error: unknown route -> expect 404 ==="
status=$(curl -s -o /dev/null -w '%{http_code}' "$BASE/nope")
echo "status=$status"
[ "$status" = "404" ] || fail=1

if grep -qiE "error|exception" "$LOG"; then
  echo "--- unexpected log output ---"
  grep -iE "error|exception" "$LOG"
  fail=1
fi

exit $fail
