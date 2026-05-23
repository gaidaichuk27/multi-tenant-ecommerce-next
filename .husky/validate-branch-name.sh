#!/usr/bin/env sh

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

CURRENT_BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null)

[ -z "$CURRENT_BRANCH" ] && exit 0

ALLOWED_PATTERN="^(feature|bugfix|hotfix|docs)/(frontend|backend|common)-[a-z0-9-]+$"

if ! echo "$CURRENT_BRANCH" | grep -Eq "$ALLOWED_PATTERN"; then
  echo ""

  printf "${RED}❌ Invalid branch name:${NC} %s\n" "$CURRENT_BRANCH"

  echo ""

  printf "${GREEN}✅ Format:${NC} <type>/<scope>-<description>\n"

  echo ""
  printf "${YELLOW} - type:${NC} feature | bugfix | hotfix | docs\n"
  printf "${YELLOW} - scope:${NC} frontend | backend | common\n"
  printf "${YELLOW} - description:${NC} lowercase-with-hyphens\n"

  echo ""

  printf "${GREEN}👉 Example:${NC} feature/frontend-add-login-form\n"

  echo ""

  exit 1
fi