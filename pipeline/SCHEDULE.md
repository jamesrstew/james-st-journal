# Schedule — James St. Journal

The paper publishes once per day at 5am America/Los_Angeles. This file documents the cron trigger configuration.

## Cron

- **Expression:** `0 5 * * *`
- **Timezone:** `America/Los_Angeles` (handles DST automatically)
- **Trigger name:** `james-st-journal-daily`
- **Bootstrap prompt:** contents of `pipeline/bootstrap.md` (thin ~20-line prompt that clones the repo and points at `pipeline/PIPELINE.md`)
- **Env vars:**
  - `GITHUB_TOKEN` — fine-grained PAT, scoped to `jamesrstew/james-st-journal` only, `contents: write` permission, no other scopes. See `SETUP.md` for how to generate.

## Why 5am PT

- James wakes up around 6–7am PT. Edition needs to be live before he opens his laptop.
- The pipeline runs 20–40 minutes end to end. 5am start → 5:45am completion → Vercel build → live by ~6am PT.
- RSS feeds are populated with overnight US news by 5am PT.

## Why America/Los_Angeles not UTC

If the trigger only supports UTC cron expressions, use `0 12 * * *` (5am PST / 6am PDT). This drifts with DST. Prefer TZ-aware if available.

## Manual trigger

To run the pipeline manually (e.g., to backfill a missed day or test), use the Anthropic `/trigger` UI or `claude -p` locally via `pipeline/run-local.sh`.

## Failure signaling

- The trigger writes `pipeline/runs/$DATE.json` on every run (success / partial / failed).
- The webapp homepage shows a "Today's edition is being prepared" banner if today's files are missing.
- If the trigger fails to run entirely (quota, auth issue), there will be no file and no commit. Check the Anthropic trigger history.
