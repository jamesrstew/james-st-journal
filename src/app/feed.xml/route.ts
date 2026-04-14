import { getAllArticles } from "@/lib/articles";
import { brand } from "@/lib/brand";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const dynamic = "force-static";

export function GET() {
  const base = brand.baseUrl.replace(/\/$/, "");
  const articles = getAllArticles()
    .filter((a) => !a.needs_review)
    .sort((a, b) =>
      a.published_at < b.published_at ? 1 : a.published_at > b.published_at ? -1 : 0,
    )
    .slice(0, 50);

  const lastBuild = articles[0]?.published_at ?? new Date().toISOString();

  const items = articles
    .map((a) => {
      const url = `${base}${a.href}`;
      return `    <item>
      <title>${escapeXml(a.headline)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(a.published_at).toUTCString()}</pubDate>
      <category>${escapeXml(a.category)}</category>
      <author>${escapeXml(a.byline)}</author>
      <description>${escapeXml(a.dek)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(brand.name)}</title>
    <link>${base}</link>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(brand.disclosure)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date(lastBuild).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=600, s-maxage=3600",
    },
  });
}
