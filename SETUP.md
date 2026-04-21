# Setup & operations — James St. Journal

This is the operational runbook for the live pipeline. Keep it short. For the trigger's static config (IDs, cron expression, env), see `pipeline/SCHEDULE.md`.

## The live cron

- **Venue:** Anthropic Routines
- **Trigger ID:** `trig_01XWayYkU3ZRzgqotgeHviSy`
- **Name:** `jsj-edition`
- **Cron:** `3 12 * * *` UTC (= 5:03 AM PDT / 4:03 AM PST — edit in the routine's web config in March/November if you care about the one-hour DST drift)
- **Model:** `claude-opus-4-7`
- **Repo source:** `https://github.com/jamesrstew/james-st-journal` with `allow_unrestricted_git_push: true` (toggled in the routine's web UI; default would limit pushes to `claude/*` branches)
- **Bootstrap prompt:** reads `pipeline/bootstrap.md` from the repo, which delegates to `pipeline/PIPELINE.md`. Prompt iteration happens in-repo — commit and push to main, next run picks it up.
- **Cost:** billed to the Claude Max subscription (no separate API bill).

## How the daily run works

1. 5:03 AM PT — Routines spins up a container already checked out at HEAD of `main`. Actual execution starts ~5–15 min later due to queue/provisioning.
2. It reads `pipeline/bootstrap.md` → delegates to `pipeline/PIPELINE.md`.
3. Orchestrator fetches RSS, clusters, selects 5, builds dossiers, drafts + edits (inline or via Task sub-agents), up to 1 revision round.
4. Validates with `pnpm exec tsx pipeline/validate.ts $DATE`. If that fails, the commit is marked `status: "failed"` and nothing else is pushed.
5. Commits the markdown files + `pipeline/runs/$DATE.json` and pushes to `main`.
6. Vercel auto-deploys on push — site is live ~60–90 s later, typically ~6:30 AM PT.

## Common operations

All via the `RemoteTrigger` tool inside Claude Code.

**Manual fire (run right now, outside the schedule):**
```
RemoteTrigger action: run, trigger_id: trig_01XWayYkU3ZRzgqotgeHviSy
```

**Pause / resume:**
```
RemoteTrigger action: update, trigger_id: trig_01XWayYkU3ZRzgqotgeHviSy, body: { "enabled": false }
```
Set back to `true` to resume.

**Change schedule (e.g., shift to 6 AM PT):**
```
RemoteTrigger action: update, trigger_id: trig_01XWayYkU3ZRzgqotgeHviSy, body: { "cron_expression": "3 13 * * *" }
```

**Inspect (see next_run_at, last run, config):**
```
RemoteTrigger action: get, trigger_id: trig_01XWayYkU3ZRzgqotgeHviSy
```

Deletion of a Routines trigger is web-UI only (no API action). Use claude.ai/code → routines.

## Local fallback

If Routines is down and you need to land a day's edition:
```
cd james-st-journal
claude -p "$(cat pipeline/bootstrap.md)" --permission-mode bypassPermissions --model opus --max-turns 200
```
Uses the Mac's OAuth. Sidesteps Routines entirely.

## Observability

- `pipeline/runs/YYYY-MM-DD.json` is the canonical run log. One per day. Inspect it if an edition looks wrong.
- If `pipeline/runs/$TODAY.json` is missing by 8 AM PT, `.github/workflows/edition-health-check.yml` pages via Telegram. Check the routine's recent runs via `RemoteTrigger action: get` or the session log on claude.ai/code.
- Article files live in `content/articles/YYYY-MM-DD/NN-<slug>.md`. The Zod schema in `pipeline/schemas/article.ts` is enforced at Vercel build time — a malformed frontmatter fails the deploy before it goes live.

## Tweaking prompts

Everything the scheduled agent reads at runtime lives in `pipeline/`:
- `pipeline/PIPELINE.md` — orchestrator playbook
- `pipeline/prompts/writer.md` — writer sub-agent prompt
- `pipeline/prompts/editor.md` — editor sub-agent prompt
- `pipeline/sources.json` — RSS feed tiers (body-fetchable vs. headline-only)
- `pipeline/categories.ts` — canonical category enum (shared with webapp)

Commit and push to `main`. The next 5:03 AM run uses the new versions. No trigger edit required.
