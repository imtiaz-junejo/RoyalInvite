#!/usr/bin/env bash
set -euo pipefail

curl -sS -X POST "${WHATSAPP_GATEWAY_URL:-http://127.0.0.1:3020}/internal/messages/send" \
  -H "Content-Type: application/json" \
  --data '{"session_id":"eternally-yours-main","to":"+923163169201","text":"Test From sikander : Test message from Eternally Yours WhatsApp sender. If you received this, the shared sender is connected successfully."}'
