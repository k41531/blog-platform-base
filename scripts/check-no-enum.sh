#!/usr/bin/env bash
# Checks that TypeScript `enum` is not used anywhere in the project.
# Project convention: use string literal unions instead.
#
# Usage: bash scripts/check-no-enum.sh

set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

echo "=== No-Enum Check ==="
echo ""

matches=$(grep -rn --include='*.ts' --include='*.tsx' -E '^\s*(export\s+)?(const\s+)?enum\s+' lib/ app/ components/ 2>/dev/null || true)

if [[ -n "$matches" ]]; then
  echo "VIOLATION: TypeScript enum is forbidden. Use string literal union types instead."
  echo "$matches" | while IFS= read -r line; do
    echo "  $line"
  done
  echo ""
  echo "FAILED: enum usage found."
  exit 1
else
  echo "PASSED: No enum usage found."
  exit 0
fi
