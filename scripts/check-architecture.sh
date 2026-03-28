#!/usr/bin/env bash
# Architecture boundary checker
# Enforces layer dependency rules for Clean Architecture.
#
# Allowed dependencies:
#   domain/     -> shared/ only (no I/O, no external deps)
#   repositories/ -> domain/, shared/, supabase/server only
#   actions/    -> domain/, repositories/, shared/, supabase/server, actions/types only
#
# Usage: bash scripts/check-architecture.sh

set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

violations=0

# --- Helper ---
check_forbidden_imports() {
  local layer="$1"
  local pattern="$2"
  local description="$3"

  matches=$(grep -rn --include='*.ts' --include='*.tsx' -E "$pattern" "$layer" 2>/dev/null || true)
  if [[ -n "$matches" ]]; then
    echo "VIOLATION: $description"
    echo "$matches" | while IFS= read -r line; do
      echo "  $line"
    done
    echo ""
    violations=$((violations + 1))
  fi
}

echo "=== Architecture Boundary Check ==="
echo ""

# --- domain/ layer: may only import from @/lib/shared/ ---
# Forbidden: repositories, actions, supabase, components
check_forbidden_imports \
  "lib/domain" \
  "from [\"']@/lib/(repositories|actions|supabase)" \
  "domain/ must not import from repositories/, actions/, or supabase/"

check_forbidden_imports \
  "lib/domain" \
  "from [\"']@/components" \
  "domain/ must not import from components/"

# Also check for relative imports escaping domain/
check_forbidden_imports \
  "lib/domain" \
  "from [\"']\.\./\.\." \
  "domain/ must not use relative imports escaping to parent layers"

# --- repositories/ layer ---
# Forbidden: actions, supabase/client
check_forbidden_imports \
  "lib/repositories" \
  "from [\"']@/lib/actions" \
  "repositories/ must not import from actions/"

check_forbidden_imports \
  "lib/repositories" \
  "from [\"']@/lib/supabase/client" \
  "repositories/ must not import supabase/client (server-only)"

check_forbidden_imports \
  "lib/repositories" \
  "from [\"']@/components" \
  "repositories/ must not import from components/"

# --- actions/ layer ---
# Forbidden: components, supabase/client
check_forbidden_imports \
  "lib/actions" \
  "from [\"']@/lib/supabase/client" \
  "actions/ must not import supabase/client (server-only)"

check_forbidden_imports \
  "lib/actions" \
  "from [\"']@/components" \
  "actions/ must not import from components/"

# --- Summary ---
if [[ $violations -gt 0 ]]; then
  echo "FAILED: $violations architecture violation(s) found."
  exit 1
else
  echo "PASSED: All architecture boundaries are respected."
  exit 0
fi
