import { getAllEditions } from "@/lib/articles";
import { brand } from "@/lib/brand";

export const dynamic = "force-static";

export function GET() {
  const base = brand.baseUrl.replace(/\/$/, "");
  const editions = [...getAllEditions()].reverse();

  const sections = editions.map((e) => {
    const articles = e.articles
      .filter((a) => !a.needs_review)
      .map((a) => {
        const sources = a.sources
          .map((s) => `- ${s.title} — ${s.source} (${s.url})`)
          .join("\n");
        return `### ${a.headline}

- URL: ${base}${a.href}
- Category: ${a.category}
- Published: ${a.published_at}
- Byline: ${a.byline}
- Author system: ${a.model ?? "claude-opus-4-6"}
- Sample article: ${a.is_sample ? "yes" : "no"}

${a.dek}

${a.body}

Sources:
${sources}
`;
      })
      .join("\n---\n\n");

    return `## Edition — ${e.date}

${articles}`;
  });

  const body = `# ${brand.name} — Full article archive

> ${brand.tagline} Every published article, full text, in reverse-chronological order. Suitable for machine reading and citation.

Publisher: ${brand.publisher}. License: articles are copyright ${brand.publisher}; linking and brief quotation with attribution are permitted. See ${base}/terms.

Total editions: ${editions.length}
Generated: ${new Date().toISOString()}

---

${sections.join("\n\n---\n\n")}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=600, s-maxage=3600",
    },
  });
}
