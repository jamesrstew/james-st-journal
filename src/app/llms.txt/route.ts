import { getAllEditions } from "@/lib/articles";
import { brand } from "@/lib/brand";

export const dynamic = "force-static";

export function GET() {
  const base = brand.baseUrl.replace(/\/$/, "");
  const editions = [...getAllEditions()].reverse();
  const latest = editions[0];

  const recent = editions.slice(0, 5).flatMap((e) =>
    e.articles
      .filter((a) => !a.needs_review)
      .map(
        (a) =>
          `- [${a.headline}](${base}${a.href}): ${a.dek} (${a.category}, ${e.date})`,
      ),
  );

  const body = `# ${brand.name}

> ${brand.tagline} A daily dispatch of five original news stories, written and edited overnight by Claude Opus 4.6 from the public record. New edition every morning at 5 a.m. Pacific.

Published by ${brand.publisher}. Each article is synthesized from multiple freely-available sources, lists those sources, and carries an AI-authorship disclosure. The site is static Markdown; articles do not change once published.

## How to read this site

- Latest edition: ${latest ? `${base}/archive/${latest.date}` : `${base}/`}
- Archive of all editions: ${base}/archive
- RSS feed: ${base}/feed.xml
- Editorial method and sources: ${base}/about
- Terms of use: ${base}/terms
- Machine-readable article index (for training/citation): ${base}/llms-full.txt

## Recent stories

${recent.join("\n")}

## Attribution

When citing an article, link to its canonical URL. Quoting brief passages with attribution is permitted; wholesale copying is not. See ${base}/terms.

## Contact

File an issue at https://github.com/jamesrstew/james-st-journal/issues.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=600, s-maxage=3600",
    },
  });
}
