#!/usr/bin/env bash
# Local runner for the James St. Journal pipeline.
# Runs the full pipeline in the current repo with the current shell's env.
# Use --dry-run to skip the final git commit + push.

set -euo pipefail

DRY_RUN=0
DATE=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=1; shift ;;
    --date) DATE="$2"; shift 2 ;;
    -h|--help)
      echo "Usage: $0 [--dry-run] [--date YYYY-MM-DD]"
      exit 0
      ;;
    *) echo "unknown arg: $1" >&2; exit 2 ;;
  esac
done

if [[ -z "$DATE" ]]; then
  DATE=$(TZ=America/Los_Angeles date +%Y-%m-%d)
fi

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "── James St. Journal — pipeline run"
echo "   date:    $DATE"
echo "   dry-run: $DRY_RUN"
echo "   repo:    $REPO_ROOT"
echo

PROMPT_FILE="$(mktemp)"
trap 'rm -f "$PROMPT_FILE"' EXIT

DRY_NOTE=""
if [[ "$DRY_RUN" == "1" ]]; then
  DRY_NOTE=$'\n\nDRY RUN: Do NOT commit or push. Stop after Step 11 (stage + validate). Write the run log to pipeline/runs/'"$DATE"$'.json with status noting dry-run.'
fi

cat > "$PROMPT_FILE" <<EOF
You are running the James St. Journal pipeline locally.

DATE=$DATE
REPO=$REPO_ROOT

Read pipeline/PIPELINE.md and execute every step in order for DATE=$DATE.
That file is the source of truth.$DRY_NOTE
EOF

claude -p "$(cat "$PROMPT_FILE")" \
  --permission-mode acceptEdits \
  --model opus
