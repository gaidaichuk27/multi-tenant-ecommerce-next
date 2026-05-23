#!/usr/bin/env sh

MSG_FILE=$1
OUTPUT=$(pnpm exec commitlint --edit "$MSG_FILE" 2>&1)
STATUS=$?

echo "$OUTPUT"

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

if [ "$STATUS" -ne 0 ]; then
  echo ""

  printf "${RED}❌ Invalid commit message!${NC}\n"

  echo ""
  echo "✅ Format: <type>(<scope>): <description>"
  echo "   - type: feat | fix | docs | style | refactor | test | chore | revert"
  echo "   - scope: frontend | backend | common"
  echo "   - description: imperative sentence"
  echo ""
  echo "👉 Example: feat(frontend): add login form"
  echo ""

  exit 1
fi