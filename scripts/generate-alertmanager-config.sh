#!/bin/bash
# Tạo file alertmanager.yml từ template với biến môi trường
# Chạy: ./scripts/generate-alertmanager-config.sh
# Cần: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, SMTP_USER, SMTP_PASSWORD, ALERT_EMAIL

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMPLATE="$PROJECT_ROOT/monitoring/alertmanager.yml.template"
OUTPUT="$PROJECT_ROOT/monitoring/alertmanager.yml"

if [ ! -f "$TEMPLATE" ]; then
    echo "Error: Template not found: $TEMPLATE"
    exit 1
fi

# Load .env if exists
if [ -f "$PROJECT_ROOT/.env" ]; then
    set -a
    source "$PROJECT_ROOT/.env"
    set +a
fi

# Export vars for envsubst (chỉ thay thế các biến đã export)
export ALERT_EMAIL="${ALERT_EMAIL:-admin@example.com}"
export ALERT_FROM="${ALERT_FROM:-alertmanager@example.com}"
export SMTP_HOST="${SMTP_HOST:-smtp.gmail.com}"
export SMTP_PORT="${SMTP_PORT:-587}"
export SMTP_USER="${SMTP_USER:-}"
export SMTP_PASSWORD="${SMTP_PASSWORD:-}"
export TELEGRAM_BOT_TOKEN="${TELEGRAM_BOT_TOKEN:-}"
export TELEGRAM_CHAT_ID="${TELEGRAM_CHAT_ID:-}"

envsubst < "$TEMPLATE" > "$OUTPUT"
echo "Generated: $OUTPUT"
echo "Kiểm tra: cat $OUTPUT"

