# Railway cron service — James St. Journal daily edition

This directory contains the Docker image and entrypoint for the Railway service that runs the daily pipeline at 5:03 AM PT. It replaces the Anthropic-hosted scheduled trigger (`trig_01TKDTTqN1o1GVnmnRER8yak`), which fails at the platform's `git_repository source` provisioning step before our pipeline code can run.

## Architecture

- **Cron schedule:** `3 12 * * *` UTC (5:03 AM PDT / 4:03 AM PST — drifts with DST).
- **Image:** `node:22-slim` + `git`, `curl`, `jq`, `pnpm@10`, `@anthropic-ai/claude-code` (CLI). pnpm store is primed at image build time so runtime install is offline-fast.
- **Auth to Claude:** OAuth tokens extracted from the owner's macOS Keychain, stored as Railway secret `CLAUDE_CREDENTIALS_JSON`. The entrypoint writes them to `/root/.claude/.credentials.json` and the CLI auto-refreshes via the embedded refresh token. Cost stays on the Claude Max sub.
- **Auth to GitHub:** fine-grained PAT (`contents:write` on this repo only), stored as Railway secret `GITHUB_PAT`. Used via `git credential.helper=store`.
- **Pipeline invocation:** `claude -p "$(cat pipeline/bootstrap.md)" --permission-mode bypassPermissions --model opus --max-turns 200`. Reuses the canonical prompt in `pipeline/bootstrap.md` — no duplication of the bootstrap text in this directory.

## One-time setup

### 1. Generate the GitHub PAT

GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token.

- **Repository access:** Only select repositories → `jamesrstew/james-st-journal`
- **Permissions:** Repository permissions → Contents: Read and write
- **Expiry:** 90 days (set a calendar reminder to rotate)

Save the token string — you'll paste it into Railway as `GITHUB_PAT`.

### 2. Extract Claude OAuth from Keychain

On the Mac that's logged into Claude Code:

```bash
security find-generic-password -s "Claude Code-credentials" -a "$USER" -w
```

Copy the entire JSON output (one line, starts with `{"claudeAiOauth":{`). You'll paste it into Railway as `CLAUDE_CREDENTIALS_JSON`.

### 3. Configure the Railway service

In the Railway dashboard:

1. New project → Deploy from GitHub repo → `jamesrstew/james-st-journal`.
2. Service settings:
   - **Source:** root of repo (the Dockerfile path is `infra/railway/Dockerfile`, build context is repo root)
   - **Dockerfile path:** `infra/railway/Dockerfile`
   - **Service type:** Cron
   - **Schedule:** `3 12 * * *` (UTC)
3. Variables (Railway → Service → Variables):
   - `CLAUDE_CREDENTIALS_JSON` — paste from step 2
   - `GITHUB_PAT` — paste from step 1
4. Notifications: enable "Send email on failure" so a broken cron pages you within minutes.
5. Trigger a manual run from the Railway UI to validate. Tail logs end-to-end. Confirm an `edition: $DATE — ... — N/5 stories` commit lands on `origin/main`.

## Operations

### Manual fire (run right now, outside the schedule)

In the Railway UI for this service, click **Deploy** → it'll run the cron immediately. Logs stream live in the dashboard.

### View logs

Railway → service → "Deployments" tab → latest deployment → log stream. Each cron fire is a new deployment.

### Refresh expired Claude credentials

The OAuth refresh token will eventually be rotated by Anthropic or invalidated if you log in elsewhere. Symptom: 7 AM PT health-check workflow fails because no edition landed; the Railway run log shows a `claude` exit code with an auth error.

Recovery (~2 min):

```bash
security find-generic-password -s "Claude Code-credentials" -a "$USER" -w
```

Paste the new JSON into Railway → Variables → `CLAUDE_CREDENTIALS_JSON` → Save. Next cron fire will use the fresh creds.

### Rotate the GitHub PAT

Set a calendar reminder for the PAT expiry. Generate a new PAT (same scopes), paste into Railway → Variables → `GITHUB_PAT` → Save. Revoke the old one in GitHub.

### Disable temporarily

Railway → service → Settings → toggle off the cron schedule. Re-enable when ready.

## Failure modes

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| No commit on `origin/main` for today, no run log | Container failed before clone — Railway logs will show why (image build error, missing env var) | Read Railway logs, fix env or Dockerfile |
| In-progress breadcrumb commit landed but no edition commit | Pipeline died mid-run — read `pipeline/runs/$DATE.json` and Railway logs | Usually rate-limit; pipeline auto-downgrades to Sonnet for editors per `pipeline/PIPELINE.md` Step 9 |
| `claude` exits with auth error | Credentials expired or rotated | See "Refresh expired Claude credentials" above |
| `git push` fails with 401/403 | PAT expired or revoked | See "Rotate the GitHub PAT" above |
| Pipeline runs but two editions land for same date | Both Railway and the (disabled) Anthropic trigger fired | Confirm `RemoteTrigger get trig_01TKDTTqN1o1GVnmnRER8yak` shows `enabled: false` |

## Why this design

- **Reuse `pipeline/bootstrap.md` and `pipeline/PIPELINE.md` verbatim.** This service is just a venue for invoking Claude with the existing prompt — no pipeline logic lives here. Edits to PIPELINE.md are picked up on the next run automatically.
- **PAT in credential helper, not in clone URL.** Keeps the PAT out of `ps aux` and `git remote -v`.
- **Pre-baked pnpm store.** Saves ~30s per run, cuts a flaky network dependency on every fire.
- **`bypassPermissions` not `acceptEdits`.** Headless containers have no human to approve `Bash` calls; the pipeline needs unrestricted shell for git, pnpm, and feed-fetching curl. Validated locally before this directory was written.

## Known risks (acknowledged)

1. **Max ToS:** Anthropic's Max sub is licensed for interactive personal use; running headless from a Railway IP is a defensible-but-grey interpretation. Worst case: account revocation.
2. **Cred expiry cadence is unpredictable.** The 7 AM PT health check catches it within 24h.
3. **Vercel still auto-deploys on push** — no change to the publishing path. Same `content/articles/$DATE/*.md` flow as before.
