#!/bin/bash

# ============================================
# NPM Security Audit Script
# ============================================
# Script để kiểm tra và fix các lỗ hổng bảo mật trong npm packages

set -e

echo "============================================"
echo "NPM Security Audit"
echo "============================================"

cd "$(dirname "$0")/../frontend" || exit 1

echo ""
echo "1. Running npm audit..."
npm audit --audit-level=moderate

echo ""
echo "2. Checking for outdated packages..."
npm outdated || true

echo ""
echo "3. Running npm audit fix (dry-run)..."
echo "Review the following suggestions:"
npm audit fix --dry-run || true

echo ""
echo "============================================"
echo "Audit completed!"
echo "============================================"
echo ""
echo "To apply fixes automatically (use with caution):"
echo "  npm audit fix"
echo ""
echo "To update packages manually:"
echo "  npm update"
echo ""

