#!/bin/bash
# Pre-commit quality gate hook for Claude Code
# Runs all deterministic checks before allowing git commit.
# Exit 0 = allow, Exit 2 = block (with stderr shown to Claude)

set -uo pipefail

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# Only check git commit commands
if [[ ! "$COMMAND" =~ git[[:space:]]+(commit|.*commit) ]]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

echo "Running pre-commit quality gates..." >&2

# Run check:all
if ! pnpm check:all 2>&1 | tail -20 >&2; then
  echo "" >&2
  echo "Pre-commit check failed. Fix the issues above before committing." >&2
  exit 2
fi

exit 0
