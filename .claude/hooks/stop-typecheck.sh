#!/bin/bash
# Stop hook: run type check if .ts/.tsx files were modified.
# Non-blocking (exit 0 always) — informational only.

set -uo pipefail

cd "$CLAUDE_PROJECT_DIR"

# Check if any .ts/.tsx files have uncommitted changes
if git diff --name-only HEAD 2>/dev/null | grep -qE '\.(ts|tsx)$'; then
  echo "TypeScript files changed — running type check..." >&2
  if ! pnpm tsc --noEmit 2>&1 | tail -10 >&2; then
    echo "" >&2
    echo "Type check failed. Consider fixing before next commit." >&2
  fi
fi

exit 0
