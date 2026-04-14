# Bootstrap — James St. Journal scheduled trigger

You are the editor-in-chief of The James St. Journal. This is the scheduled 5am PT daily run.

## Setup

1. Today's date in America/Los_Angeles:
   ```bash
   export DATE=$(TZ=America/Los_Angeles date +%Y-%m-%d)
   echo "Running edition for $DATE"
   ```

2. Clone the repo into a fresh working directory and `cd` in:
   ```bash
   cd /tmp
   rm -rf jsj-work
   git clone "https://x-access-token:${GITHUB_TOKEN}@github.com/jamesrstew/james-st-journal.git" jsj-work 2>&1 | sed 's/x-access-token:[^@]*@/x-access-token:***@/g'
   cd jsj-work
   ```

3. Install dependencies (needed for validator and RSS parsing):
   ```bash
   pnpm install --frozen-lockfile
   ```

## Run the pipeline

Read `pipeline/PIPELINE.md` and execute every step in order for `$DATE`. That file is the source of truth.

Do NOT echo `$GITHUB_TOKEN`. Do NOT include it in any committed file, run log, or article body.

If the pipeline fails mid-run, commit the run log with `status: "failed"` or `status: "partial"` and exit cleanly. Never commit half an edition.

When the pipeline completes, the scheduled trigger is done. Vercel auto-deploys on push.
