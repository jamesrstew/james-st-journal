import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { ArticleBody } from "@/components/ArticleBody";
import { SourceList } from "@/components/SourceList";
import { JsonLd } from "@/components/JsonLd";
import { getAllEditions, getArticle } from "@/lib/articles";
import { formatDateline } from "@/lib/date";
import { brand } from "@/lib/brand";
import { articleJsonLd } from "@/lib/seo";

interface RouteParams {
  date: string;
  slug: string;
}

export function generateStaticParams(): RouteParams[] {
  return getAllEditions().flatMap((e) =>
    e.articles.map((a) => ({ date: e.date, slug: a.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { date, slug } = await params;
  const article = getArticle(date, slug);
  if (!article) return {};

  return {
    title: article.headline,
    description: article.dek,
    keywords: [article.category, "news", brand.name],
    authors: [{ name: article.byline }],
    alternates: { canonical: article.href },
    robots: article.needs_review ? { index: false, follow: false } : undefined,
    openGraph: {
      title: article.headline,
      description: article.dek,
      type: "article",
      publishedTime: article.published_at,
      authors: [article.byline],
      section: article.category,
      siteName: brand.name,
      url: `${brand.baseUrl}${article.href}`,
    },
    twitter: {
      card: "summary_large_image",
      title: article.headline,
      description: article.dek,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { date, slug } = await params;
  const article = getArticle(date, slug);
  if (!article) notFound();

  return (
    <>
      <JsonLd data={articleJsonLd(article)} />
      <Masthead editionDate={date} />
      <main className="mx-auto max-w-[680px] px-4 sm:px-6 py-8 sm:py-12">
        {article.is_sample && (
          <p className="mb-6 border border-rule bg-paper px-3 py-2 text-center text-xs small-caps text-muted">
            Sample article · illustrative copy, not a published story
          </p>
        )}

        <p className="small-caps text-accent-red">{article.category}</p>

        <h1 className="headline mt-3 text-[clamp(1.75rem,6vw,3rem)]">
          {article.headline}
        </h1>

        <p className="dek mt-4 text-lg sm:text-xl">{article.dek}</p>

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs small-caps text-muted">
          <span>By {article.byline}</span>
          <span>·</span>
          <time dateTime={article.published_at}>
            {formatDateline(date)}
          </time>
          {article.reading_time_min ? (
            <>
              <span>·</span>
              <span>{article.reading_time_min} min read</span>
            </>
          ) : null}
        </div>

        <hr className="mt-8 mb-12 sm:mb-14 rule-thin" />

        <ArticleBody markdown={article.body} />

        <SourceList sources={article.sources} />

        <p className="mt-10 italic text-sm text-muted">
          {brand.disclosure}
        </p>

        <div className="mt-12 flex items-center justify-between text-xs small-caps">
          <Link href="/">← Back to today&rsquo;s edition</Link>
          <Link href={`/archive/${date}`}>Full edition: {date}</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
