# Setup & operations — James St. Journal

> ## CEASED PUBLICATION — 2026-09-08
>
> The paper is done. Last edition: `content/articles/2026-09-08/`. Nothing below is
> live any more; it is kept as the record of how the paper ran and as the recipe if it
> is ever revived.
>
> **Shutdown checklist**
>
> | Lever | State | Where |
> |---|---|---|
> | `pipeline/bootstrap.md` | Replaced with a hard stop. Any fire exits without publishing. | this repo |
> | `pipeline/archive-bootstrap.md`, `pipeline/archive-bootstrap-retry.md` | The old working instructions, preserved verbatim. | this repo |
> | `.github/workflows/edition-health-check.yml` | Schedule removed; `workflow_dispatch` only. It would otherwise page Telegram every morning forever. | this repo |
> | `jsj-edition` (`trig_01XWayYkU3ZRzgqotgeHviSy`) | **Disable by hand** | claude.ai/code → Routines |
> | `jsj-edition-retry-a` (`trig_01PVSDeMgC4uFTeRu7JtUvwt`) | **Disable by hand** | claude.ai/code → Routines |
> | `jsj-edition-retry-b` (`trig_01DPcHN8m342aiWTAad18bQd`) | **Disable by hand** | claude.ai/code → Routines |
>
> The three routines were created through the HTTP API, and the Routines API refuses
> agent-initiated updates to those ("Agents can only update routines they created").
> They have to be switched off in the web UI. Until that happens the repo-side stop in
> `pipeline/bootstrap.md` is what prevents a new edition: a fire still spins up a
> container and burns a few minutes of Max quota, but it reads the stop file and exits
> before touching `content/` or `pipeline/runs/`.
>
> Vercel can stay connected. With no new commits there are no new deploys, and the
> archive keeps serving.

## The live cron

- **Venue:** Anthropic Routines
- **Trigger ID:** `trig_01XWayYkU3ZRzgqotgeHviSy`
- **Name:** `jsj-edition`
- **Cron:** `3 12 * * *` UTC (= 5:03 AM PDT / 4:03 AM PST — edit in the routine's web config in March/November if you care about the one-hour DST drift)
- **Model:** `claude-opus-4-7`
- **Repo source:** `https://github.com/jamesrstew/james-st-journal` with `allow_unrestricted_git_push: true` (toggled in the routine's web UI; default would limit pushes to `claude/*` branches)
- **Bootstrap prompt:** reads `pipeline/bootstrap.md` from the repo, which delegated to `pipeline/PIPELINE.md`. Prompt iteration happened in-repo — commit and push to main, next run picks it up. (As of the sunset, `pipeline/bootstrap.md` is a stop file; the publishing version is `pipeline/archive-bootstrap.md`.)
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
