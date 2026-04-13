# The James St. Journal

> A personal daily paper. Five stories. Every morning at 5 a.m. Pacific.
> Circulation: one.

## Origin story

The Wall Street Journal raised my renewal rate to $25 a month, which was the last straw in a long and mostly one-sided relationship. I considered cancelling and re-subscribing as a "new" customer — discovering, to my horror, that new customers now pay *more*. This is the part of the story where a normal person would pay the bill.

I am not a normal person. I am a person who subscribes to Claude Max.

So I did what any reasonable, sleep-deprived, mildly-petty software engineer would do: I hired a newsroom. The newsroom is Claude Opus 4.6. Its staff is one person ("J.S. Gallagher"), who is not real and has never been to J-school. It publishes five stories every morning at 5 a.m. Pacific, chosen from a field of ~300 wire items by an algorithm that will be described, at length, in a blog post I will never write.

You are reading the repo for this paper.

## What it does

Every morning, at 5:00 a.m. sharp, an Anthropic-hosted scheduled agent wakes up, clones this repo, reads the night's RSS feeds, clusters the stories, picks the five that matter, writes them up in a passable imitation of broadsheet English, hands the drafts to a second agent pretending to be a weary copy editor, reconciles their differences, commits the result, and goes back to sleep.

Vercel notices the commit and redeploys the site. By 5:30 a.m. there is a new edition at [james-st-journal.vercel.app](https://james-st-journal.vercel.app), assuming nothing has exploded. Things will occasionally explode. This is addressed in the fine print.

## Editorial principles

1. **Never invent a quote.** The editor agent runs a literal `grep` against the source dossier for every quoted string in every draft. If the quote isn't in a source, the story goes back for a rewrite. This is more rigorous than some newsrooms, which is not a compliment to the newsrooms.
2. **Never rewrite a paywalled article.** Sources are split into two tiers: paywalled outlets (WSJ, NYT, FT, Bloomberg) contribute *headlines only*, used as a signal that a story is newsworthy. The actual facts are pulled from the wire — AP, Reuters, BBC, NPR, and other organizations that have decided the news is a public good.
3. **Never pretend.** Every article ends with a small italic line confessing that it was written by Claude. If that bothers you, you will not enjoy the rest of the 2020s.
4. **Never use em-dashes.** Just kidding — we love them.

## What's in the repo

```
content/articles/YYYY-MM-DD/   each morning's edition, as markdown files
docs/brand/                    the brand guidelines that this repo takes very seriously
pipeline/                      the master prompt the scheduled agent runs
src/                           the Next.js app that renders all of the above
.github/workflows/             a health check that emails me when 5 a.m. goes wrong
```

## Stack

- **Next.js 16** on Vercel Hobby (free)
- **Tailwind v4** with CSS variables for the brand tokens
- **Playfair Display**, **Source Serif 4**, **Inter** via `next/font/google`
- **Markdown + frontmatter** in the repo itself — git is the database
- **Claude Code `/schedule`** for the cron (covered by my Max sub; this is the whole point)
- **GitHub Actions** as a fallback if `/schedule` decides to take the morning off

No Railway. No Postgres. No pgvector. No pain. No dark mode. No dependency on a separate API bill. You will notice the stark absence of these things. This is on purpose.

## Can I subscribe?

No. But you can bookmark [james-st-journal.vercel.app](https://james-st-journal.vercel.app) and read it for free, which is the same as subscribing except no one asks you for a credit card at renewal time.

## Can I contribute?

Please don't. The editorial staff is Claude Opus 4.6 and the managing editor is me. We are fully staffed. If you find a typo, a factual error, or a headline that feels too WSJ-like for comfort, you may file a grievance via GitHub issues and we will take it under advisement, where "under advisement" means "into a tidy little triage folder."

## Why "J.S. Gallagher"

Because it sounds like a real person who has covered three recessions and one war, drinks his coffee black, and keeps a Rolodex in a desk drawer as a matter of principle. If anyone named J.S. Gallagher is reading this and would like a byline credit, please accept our retroactive apologies.

## Legal

All articles are original syntheses from publicly available news sources, with attribution in every article footer. Quotes are verbatim from source wire stories. We link to the underlying reporting. If your outlet is in our source list and you'd rather it not be, [open an issue](https://github.com/jamesrstew/james-st-journal/issues) and we will quietly remove you.

---

_Written and edited by Claude Opus 4.6. Managing editor: [@jamesrstew](https://github.com/jamesrstew). Circulation department: me again._
