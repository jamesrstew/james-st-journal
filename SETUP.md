# Setup & operations — James St. Journal

This is the operational runbook for the live pipeline. Keep it short.

## The live cron

- **Trigger ID:** `trig_01TKDTTqN1o1GVnmnRER8yak`
- **Name:** "James St. Journal — Daily Edition"
- **Cron:** `3 12 * * *` UTC (= 5:03 AM PDT / 4:03 AM PST)
- **Model:** `claude-opus-4-6`
- **Repo:** `https://github.com/jamesrstew/james-st-journal` (`allow_unrestricted_git_push: true`)
- **Bootstrap prompt:** inlined in the trigger; re-reads `pipeline/PIPELINE.md` each run, so prompt iteration happens in-repo.
- **Cost:** billed to the Claude Max subscription (no separate API bill).

DST-aware: `3 12 * * *` UTC means the run drifts by one hour between PDT and PST. Acceptable; edit the cron in November/March if you care.

## How the daily run works

1. 5:03 AM PT — the scheduled agent starts in a fresh cloud container, already checked out at HEAD of `main`.
2. It reads `pipeline/bootstrap.md` → delegates to `pipeline/PIPELINE.md`.
3. Orchestrator fetches RSS, clusters, selects 5, builds dossiers, spawns 5 writer sub-agents in parallel, 5 editor sub-agents, up to 1 revision round.
4. Validates with `pnpm exec tsx pipeline/validate.ts $DATE`. If that fails, the commit is marked `status: "failed"` and nothing else is pushed.
5. Commits the 5 markdown files + `pipeline/runs/$DATE.json` in one atomic commit and pushes.
6. Vercel auto-deploys on push — site is live ~60–90 s later.

## Common operations

All via the `RemoteTrigger` tool inside Claude Code.

**Manual fire (run right now, outside the schedule):**
```
RemoteTrigger action: run, trigger_id: trig_01TKDTTqN1o1GVnmnRER8yak
```

**Pause / resume:**
```
RemoteTrigger action: update, trigger_id: trig_01TKDTTqN1o1GVnmnRER8yak, body: { "enabled": false }
```
Set back to `true` to resume.

**Change schedule (e.g., shift to 6 AM PT):**
```
RemoteTrigger action: update, body: { "cron_expression": "3 13 * * *" }
```

**Inspect (see next_run_at, last run, config):**
```
RemoteTrigger action: get, trigger_id: trig_01TKDTTqN1o1GVnmnRER8yak
```

**Tear down:**
```
RemoteTrigger action: delete, trigger_id: trig_01TKDTTqN1o1GVnmnRER8yak
```

## Local testing

Run the full pipeline against today's date without pushing:
```
./pipeline/run-local.sh --dry-run
```

Or just the validator against an existing edition:
```
pnpm exec tsx pipeline/validate.ts 2026-04-13
```

## Observability

- `pipeline/runs/YYYY-MM-DD.json` is the canonical run log. One per day. Inspect it if an edition looks wrong.
- If `pipeline/runs/$TODAY.json` is missing by 6 AM PT, something silently failed. Check the trigger's recent runs via `RemoteTrigger action: get`.
- Article files live in `content/articles/YYYY-MM-DD/NN-<slug>.md`. The Zod schema in `pipeline/schemas/article.ts` is enforced at Vercel build time — a malformed frontmatter fails the deploy before it goes live.

## Tweaking prompts

Everything the scheduled agent reads at runtime lives in `pipeline/`:
- `pipeline/PIPELINE.md` — orchestrator playbook
- `pipeline/prompts/writer.md` — writer sub-agent prompt
- `pipeline/prompts/editor.md` — editor sub-agent prompt
- `pipeline/sources.json` — RSS feed tiers (body-fetchable vs. headline-only)
- `pipeline/categories.ts` — canonical category enum (shared with webapp)

Commit and push to `main`. The next 5 AM run uses the new versions. No trigger edit required.
