# Bootstrap — James St. Journal SHADOW edition (Routines dark-launch)

This is the shadow runner used by the `jsj-edition-shadow` Routine. It produces the full daily edition per `pipeline/PIPELINE.md`, but commits to a branch Vercel never deploys — so nothing this routine produces can land on jamesstjournal.com. This exists so the Routines-based infra can be observed in parallel with the Railway cron before migration.

## Setup (before PIPELINE.md Step 1)

1. `cd` into the cloned repo.
2. Enable pnpm: `corepack enable`
3. Install deps: `pnpm install --frozen-lockfile`
4. Compute the date:
   ```bash
   export DATE=$(TZ=America/Los_Angeles date +%Y-%m-%d)
   ```
5. Configure git author locally (not `--global`):
   ```bash
   git config user.name "J.S. Gallagher"
   git config user.email "editor@jamesstjournal.com"
   ```
6. Create and switch to the shadow branch. Include a UTC fire-time suffix so every run gets its own branch — the routine can fire multiple times against the same `$DATE` (manual test fires on the same day as the scheduled fire, DST edges, etc.), and a collision with an existing remote branch will reject the push as non-fast-forward.
   ```bash
   export FIRE_TS=$(date -u +T%H%MZ)
   export SHADOW_BRANCH="claude/shadow-edition-$DATE-$FIRE_TS"
   git checkout -b "$SHADOW_BRANCH"
   ```

## Overrides to PIPELINE.md

Execute every step of `pipeline/PIPELINE.md` in order, with these overrides only:

- **Step 1 sub-step 5 (early breadcrumb):** write the breadcrumb to `pipeline/runs/$DATE-shadow.json` (not `$DATE.json`). Commit it on the shadow branch and push with `git push -u origin HEAD` (not `origin main`).
- **Step 12 (commit + push):** stage `content/articles/$DATE/` and `pipeline/runs/$DATE-shadow.json`. Commit with message:
  ```
  shadow-edition: $DATE — <lead headline> — N/5 stories
  ```
  Push with `git push origin HEAD` (NOT `git push origin main`).
- **Step 13 (run log):** write to `pipeline/runs/$DATE-shadow.json` (not `$DATE.json`).
- **Step 14 (cleanup):** skip the `rm -rf /tmp/jsj-$DATE` purge on failure paths so the dossiers are available for post-mortem.

All other steps (ingest, cluster, score, select, research, draft, edit, revise, stage, validate) execute verbatim from `pipeline/PIPELINE.md`.

## Guardrails

- Do NOT push to `main` under any circumstance.
- Do NOT merge the shadow branch.
- Do NOT modify the non-shadow `pipeline/runs/$DATE.json` if it exists (it's Railway's artifact).
- Do NOT delete existing shadow branches.
- Do NOT reuse a branch name from a prior fire. If the suffix-timestamp collides (same UTC minute, extremely rare), bail early with a run-log error — do not `--force` push.
- Do NOT echo credentials. Routines provides auth via the connected GitHub identity; there is no `$GITHUB_TOKEN` to reference.
