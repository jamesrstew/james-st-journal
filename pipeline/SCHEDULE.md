# Schedule — James St. Journal

The paper publishes once per day at 5:03 a.m. America/Los_Angeles. Two automatic retries at 7:15 AM and 9:30 AM rescue the edition when the primary fire fails. This file documents all three Routines triggers.

## Triggers

| Role | Name | Trigger ID | Cron (UTC) | Local (PDT) | Bootstrap |
|---|---|---|---|---|---|
| Primary | `jsj-edition` | `trig_01XWayYkU3ZRzgqotgeHviSy` | `3 12 * * *` | 5:03 AM | `pipeline/bootstrap.md` |
| Retry A | `jsj-edition-retry-a` | `trig_01PVSDeMgC4uFTeRu7JtUvwt` | `15 14 * * *` | 7:15 AM | `pipeline/bootstrap-retry.md` |
| Retry B | `jsj-edition-retry-b` | `trig_01DPcHN8m342aiWTAad18bQd` | `30 16 * * *` | 9:30 AM | `pipeline/bootstrap-retry.md` |

All three share:

- **Venue:** Anthropic Routines (successor to the old `/trigger` UI)
- **Environment:** `env_01Nsa9MM5p7gmYJmhky2HjmK` (`james-st-journal`) — **Full network access** tier. The Default "Trusted" tier blocks news feed hosts and will fail ingest.
- **Model:** `claude-opus-4-7`
- **Push allowlist:** unrestricted (toggled in each routine's web UI repo config; default would limit the GitHub identity to `claude/*` branches)
- **Cron drift:** UTC fixed; local times shift one hour at DST cutovers

## Why 5:03 AM PT

- Editor (James) wakes up early and wants the edition ready when he opens his laptop.
- Pipeline runs ~60–90 min end to end on Routines. 5:03 AM start → ~6:30 AM completion → Vercel build → live by ~6:45 AM PT.
- RSS feeds are populated with overnight US news by 5 AM PT.
- The `:03` offset avoids the top-of-the-hour congestion on Anthropic's scheduler.

## Retry semantics

Retry A (7:15 AM) and Retry B (9:30 AM) use `pipeline/bootstrap-retry.md`, which opens with a Node-based precheck against today's breadcrumb `pipeline/runs/$DATE.json`:

- `status: "success"` → `skip:success` and exit 0.
- `status: "in_progress"` AND `started_at` within the last **110 min** → `skip:in_progress` and exit 0 (an earlier fire is plausibly still running; 90 min pipeline + 15 min spin-up + 5 min slack).
- Anything else (missing, failed, partial, stale in_progress) → `proceed:*` and run the full pipeline, overwriting the stale breadcrumb at Step 13.

Keyed on `$DATE`, so yesterday's rot cannot block today. The gap between Retry A (7:15) and the health check (8:05) gives Retry A a full 50 minutes to publish before James gets alerted. Retry B (9:30) is a backstop for the rare silent-hang-with-fresh-breadcrumb case that Retry A would skip.

## Manual fire

To run the pipeline manually (e.g. backfill a missed day, test a change):
- `RemoteTrigger run trig_01XWayYkU3ZRzgqotgeHviSy` — fires the primary.
- `RemoteTrigger run trig_01PVSDeMgC4uFTeRu7JtUvwt` — fires Retry A (still respects the skip rule).
- `RemoteTrigger run trig_01DPcHN8m342aiWTAad18bQd` — fires Retry B (still respects the skip rule).
- Local run: `claude -p "$(cat pipeline/bootstrap.md)"` — uses the Mac's OAuth. Sidesteps Routines entirely if it's having a bad day.

## Failure signaling

- Every fire writes `pipeline/runs/$DATE.json` with `status: success | partial | failed`.
- `.github/workflows/edition-health-check.yml` fires at 15:05 UTC (8:05 AM PT) and pages via Telegram (`@belief_systems_alerts_bot`, chat `7670412748`) if the run log is missing or `status != success`. The alert body includes the breadcrumb status, last pipeline stage reached, error, and the most recent edition-commit subject — enough to decide without opening the logs.
- Retry B fires at 9:30 AM PT regardless and may silently rescue the day after the alert.
- The webapp homepage shows a "Today's edition is being prepared" banner if today's files are missing on `main`.

## Known quirks

See `~/.claude/.../memory/reference_routines.md` for the full quirks list (env creation is web-UI-only, spin-up delay, occasional "silently stuck" fires, security-proxy bot detection on some source hosts).
