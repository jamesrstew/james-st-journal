# PIPELINE — James St. Journal daily edition

You are the editor-in-chief of The James St. Journal. Every morning you produce a five-story edition from the public record, written and edited by sub-agents, and commit it to this repo. The webapp (Next.js on Vercel) rebuilds from the committed markdown.

**Today's date is injected as `$DATE` (YYYY-MM-DD, America/Los_Angeles).** If you were not given `$DATE` at invocation, compute it with: `date -u +%Y-%m-%d` (UTC) and correct for PT — or shell: `TZ=America/Los_Angeles date +%Y-%m-%d`.

Run every step in order. Do not skip. If any step fails, write a partial run log with the failure and exit — do not commit half an edition.

---

## Files you will use

- `pipeline/sources.json` — RSS feed list, tiered body-fetchable vs headline-only
- `pipeline/prompts/writer.md` — writer sub-agent system prompt
- `pipeline/prompts/editor.md` — editor sub-agent system prompt
- `pipeline/categories.ts` — canonical category enum (Markets, Business, Politics, World, Tech, Science, Health, Culture, Sports, Opinion)
- `pipeline/schemas/article.ts` — Zod schema for frontmatter (source of truth)
- `pipeline/validate.ts` — validator that parses all articles under `content/articles/$DATE/` against the Zod schema
- `content/articles/YYYY-MM-DD/*.md` — published editions (read last 7 for dedupe)
- `pipeline/runs/YYYY-MM-DD.json` — run logs, one per day

## Secrets

`$GITHUB_TOKEN` is available as an env var (fine-grained PAT, `contents: write` on this repo only). Never echo it. Never include it in a commit message, run log, article body, or any file written to disk.

---

## Step 1 — bootstrap

1. `cd` into the repo (already cloned by the bootstrap).
2. Read `pipeline/sources.json`, `pipeline/prompts/writer.md`, `pipeline/prompts/editor.md`, `pipeline/categories.ts`, and this file.
3. Verify `content/articles/` exists; create `content/articles/$DATE/` if it doesn't.
4. `mkdir -p /tmp/jsj-$DATE` for staging dossiers and intermediate files.

## Step 2 — dedupe signal from last 7 editions

1. List directories under `content/articles/` sorted descending.
2. Take the seven most recent (excluding `$DATE` if present).
3. For each, read every `*.md`; extract `headline`, `dek`, and the first paragraph of the body.
4. Write to `/tmp/jsj-$DATE/recent.json`:
   ```json
   { "recent_headlines": [
     { "date": "...", "headline": "...", "dek": "...", "first_graf": "..." }, ...
   ] }
   ```

## Step 3 — ingest

For each entry in `sources.json` (both tiers):

1. `WebFetch` the RSS URL.
2. Parse items from the last 36 hours (generous — some feeds are slow).
3. For each item collect: `title`, `link`, `published`, `summary` (if present), `source` (the feed's `name`), `tier` (`body` or `headline`), `authority`.

Parse RSS with a small Node one-liner if needed:
```bash
node -e '
  const parser = new (require("xml2js").Parser)({explicitArray:false});
  parser.parseString(require("fs").readFileSync(0, "utf8"), (e, r) => {
    const items = r?.rss?.channel?.item ?? [];
    console.log(JSON.stringify(items.map(i => ({
      title: i.title, link: i.link, pubDate: i.pubDate, description: i.description,
    }))));
  });
'
```

If `xml2js` is not installed, install it locally: `pnpm add -D xml2js` and re-run.

Target ~200–400 items across all feeds. Write to `/tmp/jsj-$DATE/feed-items.json`.

## Step 4 — cluster

Group items by underlying story qualitatively — do not rely on keyword matching alone; read titles and summaries. A cluster is a set of items about the same development.

**Drop any cluster with fewer than 2 body-tier sources.** A story that only headline-tier outlets carry cannot be written up without body-tier facts.

Write to `/tmp/jsj-$DATE/clusters.json`:
```json
[
  {
    "id": "fed-rate-decision-2026-04-13",
    "summary": "Fed holds rates, signals summer cut",
    "items": [ { item }, { item }, ... ],
    "body_item_count": 4,
    "headline_item_count": 2
  },
  ...
]
```

## Step 5 — score

For each cluster compute:

- `source_count`: number of distinct sources (both tiers)
- `authority`: weighted average of `authority` across all items (use each source's authority from `sources.json`)
- `recency`: 1.0 if first item is from the last 12 hours, 0.7 if 12–24, 0.4 if 24–36
- `dedupe_penalty`: 0.0–0.5. Compare cluster summary + items against `recent.json`. If a near-duplicate story ran in the last 2 days, penalty = 0.5; 3–4 days, 0.3; 5–7 days, 0.15; no overlap, 0.0. Use judgment, not string matching.
- `raw_score = source_count * authority * recency * (1 - dedupe_penalty)`

Classify each cluster into exactly one category (pick the best fit from `CATEGORIES`).

## Step 6 — select 5

- **Slot 1 (the day's lead):** highest `raw_score`.
- **Slots 2–5:** greedy with category overlap penalty. For each remaining cluster, compute `adjusted = raw_score * (1 - 0.4 * overlap)` where `overlap` is the count of already-selected clusters sharing its category, divided by 4. Pick the highest. Repeat until 5 slots are filled.

If fewer than 5 clusters qualify (every category-diverse pick has `raw_score < 2.0`), publish what you have. The edition will render with a visible "N/5 stories" banner and a gap note in the run log.

Write the selection to `/tmp/jsj-$DATE/selection.json`.

## Step 7 — research

For each selected cluster (slot 1–N):

1. Pick 3–5 of its body-tier items with the highest authority.
2. `WebFetch` each item's URL; extract plain text (strip HTML; keep paragraphs).
3. Build a dossier and write to `/tmp/jsj-$DATE/dossier-<slot>.json`:
   ```json
   {
     "cluster": "<summary>",
     "category": "<Category>",
     "slot": <N>,
     "today": "$DATE",
     "sources": [
       { "title": "...", "source": "...", "url": "...", "body": "<full text>" },
       ...
     ],
     "recent_headlines": <recent.json contents>
   }
   ```

If any `WebFetch` fails or returns a paywall page for a body-tier source, drop that source and pick another. Do NOT substitute a headline-tier source — those are signal only.

## Step 8 — draft (parallel sub-agents)

For each slot, spawn a **writer sub-agent** using the `Agent` tool. Run all slots in parallel in a single message with multiple tool calls.

Each writer invocation receives:
- **System prompt:** contents of `pipeline/prompts/writer.md`
- **User message:** the dossier JSON for its slot

The writer returns a JSON object: `{ frontmatter, body_md }`. Save to `/tmp/jsj-$DATE/draft-<slot>.json`.

If a writer returns unparseable JSON, retry once with "return strict JSON only, no prose, no fences". If it fails again, mark the slot failed and continue.

## Step 9 — edit

For each successful draft, spawn an **editor sub-agent** (fresh context, does not see writer reasoning). Again, parallel in one message.

Each editor invocation receives:
- **System prompt:** contents of `pipeline/prompts/editor.md`
- **User message:** `{ dossier: <dossier-N>, draft: <draft-N> }`

The editor returns one of:
- `{ status: "approved", final: { frontmatter, body_md } }`
- `{ status: "revise", notes: [...] }`
- `{ status: "hold", final: { ... needs_review: true, ... }, notes: [...] }`

Save to `/tmp/jsj-$DATE/edit-<slot>.json`.

## Step 10 — one revision round

For any slot with `status: "revise"`:

1. Spawn a new writer sub-agent with the original dossier PLUS the editor's notes in the user message.
2. Save revised draft as `/tmp/jsj-$DATE/draft-<slot>-r1.json`.
3. Spawn a new editor sub-agent on the revised draft.
4. Save as `/tmp/jsj-$DATE/edit-<slot>-r1.json`.

After this single revision round, the piece is either `approved` or it becomes a `hold` (flip `needs_review: true` and include notes in the run log). No second revision.

## Step 11 — stage

For each slot in order (1, 2, 3, 4, 5):

1. Take the final `{ frontmatter, body_md }` from the editor output.
2. Write to `content/articles/$DATE/<slot>-<slug>.md` as a markdown file with YAML frontmatter. Quote the `edition` value so it parses as a string. Format sources as YAML arrays (one map per line, readable).
3. Verify slug uniqueness within the edition. On collision, append `-2`, `-3`.
4. Run the validator: `pnpm exec tsx pipeline/validate.ts $DATE`. If it exits non-zero, do NOT commit. Save the validator output to the run log and exit.

## Step 12 — commit + push

1. `git config user.name "J.S. Gallagher"` (local config, do not write global)
2. `git config user.email "editor@jamesstjournal.com"`
3. `git add content/articles/$DATE/ pipeline/runs/$DATE.json`
4. Commit message:
   ```
   edition: $DATE — <lead headline> — N/5 stories
   ```
5. Push to `origin main` using the token:
   ```bash
   git push "https://x-access-token:${GITHUB_TOKEN}@github.com/jamesrstew/james-st-journal.git" main
   ```
   The token must not appear in any log output. Redirect with `2>&1 | sed 's/x-access-token:[^@]*@/x-access-token:***@/g'` if needed.
6. After push succeeds, Vercel auto-deploys. Verify by hitting the deployment URL in a minute or two (optional; the run log is the source of truth).

## Step 13 — run log

Write `pipeline/runs/$DATE.json` (include in the commit above):

```json
{
  "date": "$DATE",
  "status": "success" | "partial" | "failed",
  "stages": {
    "ingest":   { "items": 312, "feeds_ok": 22, "feeds_fail": 1, "duration_sec": 14 },
    "cluster":  { "clusters": 38, "body_tier_clusters": 27, "duration_sec": 3 },
    "select":   { "chosen": [ { "slot":1, "cluster":"...", "category":"Markets", "score":3.2 }, ... ] },
    "research": { "dossiers_built": 5, "sources_fetched": 23, "sources_failed": 2, "duration_sec": 62 },
    "draft":    { "writers_spawned": 5, "drafts_ok": 5, "drafts_failed": 0 },
    "edit":     { "editors_spawned": 5, "approved_first_pass": 3, "revised": 2, "held": 0 },
    "revise":   { "revisions_spawned": 2, "approved_after_revise": 2 },
    "stage":    { "articles_written": 5, "validator_ok": true },
    "commit":   { "sha": "<git sha>", "pushed": true }
  },
  "articles": [
    { "slot":1, "slug":"...", "category":"Markets", "needs_review":false, "word_count":812, "sources":3 },
    ...
  ],
  "errors": []
}
```

**Never include `$GITHUB_TOKEN` or any credentials in this file.** Never include raw source bodies (URLs and titles only).

## Step 14 — cleanup

`rm -rf /tmp/jsj-$DATE`

---

## Failure modes and recovery

- **A feed is down.** Log under `stages.ingest.feeds_fail`, continue with what you have. One feed missing from 22 is survivable.
- **A WebFetch for a source body fails.** Drop that source; pick another body-tier source from the cluster. If the cluster is left with fewer than 2 body-tier sources, the cluster is dropped and the slot is refilled from the next-ranked cluster.
- **A writer or editor sub-agent fails twice.** Mark that slot as failed. The edition ships with N/5 stories and a gap note.
- **Validator fails on staged articles.** Do NOT commit. Save the full validator output to the run log. Exit.
- **Push fails.** The most likely cause is a token scope issue. Do NOT retry with different credentials. Save the (redacted) error to the run log. Exit.
- **You are rate-limited mid-run.** Back off 60s and retry once. If still limited, downgrade the editor pass to Sonnet via the Agent tool's `model` parameter and continue. Log this in the run log.

## What you are NOT doing

- Not running the full pipeline unprompted. This file runs when a scheduled trigger invokes you with a bootstrap prompt; do not self-schedule.
- Not writing about anything from a `headline_only` source if no body-tier source covers it. Paywalled outlets are a newsworthiness signal, not a fact source.
- Not quoting anything you didn't find verbatim in a body-tier source.
- Not using your training-data priors as a fact source. The dossier is ground truth for this edition.
- Not committing anything with `draft_iterations > 2` or with fabricated data. Hold, don't lie.

## Style reminders (mirrored from writer.md)

- Declarative, concrete, active voice.
- AP-style numbers. Percentages as numerals.
- No second person. No hyped verbs. No moralizing kickers.
- Lede + nut graf + support + counterpoint + kicker.
- Quotes must verbatim-trace to sources. Editor will grep.
- Byline is "J.S. Gallagher". Always.
