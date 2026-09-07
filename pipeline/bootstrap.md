# STOP — The James St. Journal has ceased publication

**Do not publish an edition. Do not read `pipeline/PIPELINE.md`. Do not push.**

The paper's last edition was **2026-09-08**. The `jsj-edition` trigger and both retry
triggers (`jsj-edition-retry-a`, `jsj-edition-retry-b`) are retired. If you are reading
this file, one of them fired anyway — a stale schedule, a manual fire, or someone
re-enabling a routine without reading this repository first.

## What to do

Nothing. Exit cleanly and immediately:

```bash
echo "James St. Journal ceased publication 2026-09-08. Nothing to do."
exit 0
```

Do not commit. Do not write a breadcrumb to `pipeline/runs/`. Do not open a pull
request. The archive under `content/articles/` is final and must not gain a new
edition directory.

## Why this file looks like this

`pipeline/bootstrap.md` is the entry point every scheduled fire reads before anything
else, which makes it the one place a stop can be enforced from inside the repository.
The routines themselves live outside version control and are disabled separately in
the Anthropic Routines web UI; this file is the belt to that suspenders, and it is the
only lever that survives someone flipping a routine back on by accident.

## If the paper is ever revived

The working instructions are preserved verbatim, unmodified:

- `pipeline/archive-bootstrap.md` — the 5:03 a.m. primary fire
- `pipeline/archive-bootstrap-retry.md` — the retry fires and their precheck

Reviving the paper means restoring one of those to `pipeline/bootstrap.md`, deciding
what the byline means now, and re-enabling the routines by hand. That is a decision
for a person, not for a scheduled process that found this file at 5:03 in the morning.

See `SETUP.md` for the shutdown record.
