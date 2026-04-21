# Schedule — James St. Journal

The paper publishes once per day at 5:03 a.m. America/Los_Angeles. This file documents the Routines trigger configuration.

## Trigger

- **Venue:** Anthropic Routines (successor to the old `/trigger` UI)
- **Trigger ID:** `trig_01XWayYkU3ZRzgqotgeHviSy`
- **Trigger name:** `jsj-edition`
- **Environment:** `env_01Nsa9MM5p7gmYJmhky2HjmK` (`james-st-journal`) — **Full network access** tier. The Default "Trusted" tier blocks news feed hosts and will fail ingest.
- **Cron:** `3 12 * * *` UTC (= 5:03 AM PDT / 4:03 AM PST — drifts one hour with DST)
- **Model:** `claude-opus-4-7`
- **Push allowlist:** unrestricted (toggled in the routine's web UI repo config; default would limit the routine's GitHub identity to `claude/*` branches)
- **Bootstrap prompt:** contents of `pipeline/bootstrap.md` (thin ~30-line wrapper that points at `pipeline/PIPELINE.md`)

## Why 5:03 AM PT

- Editor (James) wakes up early and wants the edition ready when he opens his laptop.
- Pipeline runs ~60–90 min end to end on Routines. 5:03 AM start → ~6:30 AM completion → Vercel build → live by ~6:45 AM PT.
- RSS feeds are populated with overnight US news by 5 AM PT.
- The `:03` offset avoids the top-of-the-hour congestion on Anthropic's scheduler.

## Manual fire

To run the pipeline manually (e.g. backfill a missed day, test a change):
- `RemoteTrigger run trig_01XWayYkU3ZRzgqotgeHviSy` — fires the scheduled trigger immediately with today's DATE.
- Local run: `claude -p "$(cat pipeline/bootstrap.md)"` — uses the Mac's OAuth. Sidesteps Routines entirely if it's having a bad day.

## Failure signaling

- The trigger writes `pipeline/runs/$DATE.json` on every run with `status: success | partial | failed`.
- `.github/workflows/edition-health-check.yml` fires at 15:05 UTC (8:05 AM PT) and pages via Telegram (`@belief_systems_alerts_bot`, chat `7670412748`) if the run log is missing or `status != success`.
- The webapp homepage shows a "Today's edition is being prepared" banner if today's files are missing on `main`.

## Known quirks

See `~/.claude/.../memory/reference_routines.md` for the full quirks list (env creation is web-UI-only, spin-up delay, occasional "silently stuck" fires, security-proxy bot detection on some source hosts).
