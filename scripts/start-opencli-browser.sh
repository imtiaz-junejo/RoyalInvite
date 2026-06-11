#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
EXTENSION_DIR="$ROOT_DIR/.opencli-browser-extension/unpacked"
PROFILE_DIR="/tmp/opencode/opencli-chromium-profile"
LOG_FILE="/tmp/opencode/opencli-chromium.log"

if [[ ! -f "$EXTENSION_DIR/manifest.json" ]]; then
  echo "OpenCLI extension not found at $EXTENSION_DIR" >&2
  exit 1
fi

opencli daemon status >/dev/null 2>&1 || opencli daemon restart >/dev/null
mkdir -p "$PROFILE_DIR"

if ! pgrep -f "[o]pencli-chromium-profile" >/dev/null; then
  setsid -f chromium \
    --user-data-dir="$PROFILE_DIR" \
    --disable-extensions-except="$EXTENSION_DIR" \
    --load-extension="$EXTENSION_DIR" \
    --remote-debugging-port=9333 \
    --no-first-run \
    --no-default-browser-check \
    "about:blank" >"$LOG_FILE" 2>&1
fi

opencli doctor
