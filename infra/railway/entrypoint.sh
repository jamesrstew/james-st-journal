#!/usr/bin/env bash
set -euo pipefail

: "${CLAUDE_CREDENTIALS_JSON:?required: paste from local Keychain extract; see infra/railway/README.md}"
: "${GITHUB_PAT:?required: fine-grained PAT, contents:write on jamesrstew/james-st-journal}"

mkdir -p /root/.claude
printf '%s' "$CLAUDE_CREDENTIALS_JSON" > /root/.claude/.credentials.json
chmod 600 /root/.claude/.credentials.json

mkdir -p /root/git
printf 'https://x-access-token:%s@github.com\n' "$GITHUB_PAT" > /root/git/credentials
chmod 600 /root/git/credentials
git config --global credential.helper "store --file=/root/git/credentials"
git config --global user.name "J.S. Gallagher"
git config --global user.email "editor@jamesstjournal.com"

rm -rf /work
git clone https://github.com/jamesrstew/james-st-journal.git /work
cd /work

pnpm install --frozen-lockfile --offline

DATE=$(TZ=America/Los_Angeles date +%Y-%m-%d)
echo "── James St. Journal — Railway run for $DATE"

if [ "${DRY_RUN:-}" = "1" ]; then
  echo "── DRY_RUN=1: smoke-testing auth + Agent tool, skipping full pipeline"
  set +e
  claude -p "Use the Agent tool to spawn a sub-agent whose entire job is to return the literal string 'sub-agent ok'. Then print 'smoke test passed' and exit." \
    --permission-mode bypassPermissions \
    --model sonnet \
    --max-turns 5
  EXIT=$?
  set -e
else
  set +e
  claude -p "$(cat pipeline/bootstrap.md)" \
    --permission-mode bypassPermissions \
    --model opus \
    --max-turns 200
  EXIT=$?
  set -e
fi

echo "── claude exited with code $EXIT"
exit $EXIT
