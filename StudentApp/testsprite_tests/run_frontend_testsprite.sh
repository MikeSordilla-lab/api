#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TMP_DIR="$ROOT_DIR/testsprite_tests/tmp"

mkdir -p "$TMP_DIR"
rm -f "$TMP_DIR/execution.lock"

EXPO_LOG="$TMP_DIR/expo-web.log"
TS_RUN_LOG="$TMP_DIR/testsprite-cli.log"

cleanup() {
  if [[ -n "${EXPO_PID:-}" ]]; then
    kill "$EXPO_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

cd "$ROOT_DIR"

echo "Starting Expo web server on http://localhost:8081 ..."
npx expo start --web --port 8081 --host localhost --non-interactive >"$EXPO_LOG" 2>&1 &
EXPO_PID=$!

# Wait until the web endpoint is reachable.
READY=0
for _ in $(seq 1 60); do
  if command -v curl >/dev/null 2>&1; then
    if curl -fsS "http://localhost:8081" >/dev/null 2>&1; then
      READY=1
      break
    fi
  else
    # Basic TCP fallback when curl is not available.
    if (echo > /dev/tcp/127.0.0.1/8081) >/dev/null 2>&1; then
      READY=1
      break
    fi
  fi
  sleep 1
done

if [[ "$READY" -ne 1 ]]; then
  echo "ERROR: Expo server never became ready on port 8081."
  echo "Check log: $EXPO_LOG"
  exit 1
fi

echo "Expo is ready. Locating TestSprite CLI ..."
TS_BIN="$(find "/c/Users/$USERNAME/AppData/Local/npm-cache/_npx" -path "*/node_modules/@testsprite/testsprite-mcp/dist/index.js" 2>/dev/null | tail -n 1 || true)"

if [[ -z "$TS_BIN" ]]; then
  echo "TestSprite CLI not found in npx cache, installing once via npx ..."
  npx -y @testsprite/testsprite-mcp@latest --help >/dev/null 2>&1 || true
  TS_BIN="$(find "/c/Users/$USERNAME/AppData/Local/npm-cache/_npx" -path "*/node_modules/@testsprite/testsprite-mcp/dist/index.js" 2>/dev/null | tail -n 1 || true)"
fi

if [[ -z "$TS_BIN" ]]; then
  echo "ERROR: Could not resolve TestSprite CLI binary path."
  exit 1
fi

echo "Running TestSprite from: $TS_BIN"
node "$TS_BIN" generateCodeAndExecute | tee "$TS_RUN_LOG"

echo "Done. Expected outputs:"
echo "- $ROOT_DIR/testsprite_tests/tmp/raw_report.md"
echo "- $ROOT_DIR/testsprite_tests/tmp/test_results.json"
echo "- $ROOT_DIR/testsprite_tests/testsprite-mcp-test-report.md"
