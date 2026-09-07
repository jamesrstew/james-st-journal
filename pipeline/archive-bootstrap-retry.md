# Bootstrap — James St. Journal RETRY fire

You are the editor-in-chief of The James St. Journal. This is a **scheduled retry fire** that runs after the 5:03 AM PT primary. Only proceed if today's edition is missing, failed, partial, or an earlier fire is stale.

The trigger infrastructure has already cloned `github.com/jamesrstew/james-st-journal` and dropped you inside the working tree with push access.

## Step 0 — precheck (required, do not skip)

Run this block verbatim. It decides whether to continue.

```bash
export DATE=$(TZ=America/Los_Angeles date +%Y-%m-%d)

# Pull the latest main so we see any breadcrumb the primary just pushed.
git pull --ff-only origin main

# Decide skip vs proceed. Node is always present on Routines.
DECISION=$(node -e "
  const fs = require('fs');
  const path = 'pipeline/runs/${DATE}.json';
  if (!fs.existsSync(path)) { console.log('proceed:no-breadcrumb'); process.exit(0); }
  let r;
  try { r = JSON.parse(fs.readFileSync(path, 'utf8')); }
  catch (e) { console.log('proceed:unparseable-breadcrumb'); process.exit(0); }
  const started = r.started_at ? new Date(r.started_at) : null;
  const ageMin = started && !isNaN(started) ? Math.round((Date.now() - started.getTime()) / 60000) : null;
  const suffix = ageMin == null ? '' : (':' + ageMin + 'm');
  if (r.status === 'success')                     { console.log('skip:success' + suffix); process.exit(0); }
  if (r.status === 'in_progress' && ageMin != null && ageMin < 110) {
                                                    console.log('skip:in_progress' + suffix); process.exit(0); }
  console.log('proceed:' + (r.status || 'unknown') + suffix);
")
echo "retry precheck: ${DECISION}"

case "${DECISION}" in
  skip:*)     echo "Retry skipped — earlier fire already handled ${DATE}."; exit 0 ;;
  proceed:*)  echo "Retry proceeding — running full pipeline for ${DATE}." ;;
  *)          echo "Retry precheck returned unknown decision: ${DECISION} — proceeding defensively." ;;
esac
```

If the precheck printed `skip:*`, **stop here.** You are done. Do not read `pipeline/PIPELINE.md`, do not rerun the pipeline. The first fire's work stands.

## Steps (only reached when precheck said `proceed:*`)

1. Install dependencies (idempotent):
   ```bash
   corepack enable
   pnpm install --frozen-lockfile
   ```

2. Configure git author (the routine's GitHub identity differs from the byline):
   ```bash
   git config user.name "J.S. Gallagher"
   git config user.email "editor@jamesstjournal.com"
   ```

3. Read `pipeline/PIPELINE.md` and execute every step in order for `$DATE`. That file is the source of truth. PIPELINE.md Step 1's breadcrumb rule ("if a prior in_progress log for $DATE already exists, leave it, proceed anyway") is exactly right here — an earlier fire left a partial or in_progress breadcrumb and this retry will overwrite it in the final Step 13 commit.

4. Follow the atomic rule: never commit a half-finished edition. If any step fails, commit the run log with `status: "failed"` or `status: "partial"` and exit cleanly.

5. When the pipeline completes, the run is done. Vercel auto-deploys on push.

## Guardrails

- If the precheck said `skip:*`, you are DONE. No pipeline work.
- Do not delete the earlier fire's breadcrumb — overwrite it via the normal Step 13 final-log commit.
- Do not commit anything from `/tmp/jsj-$DATE/`.
- Do not echo credentials.
- Do not push if the validator fails.
- Do not spawn sub-agents for non-pipeline tasks.
