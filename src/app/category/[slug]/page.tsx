import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { getArticlesByCategory } from "@/lib/articles";
import {
  CATEGORIES,
  categoryFromSlug,
  categorySlug,
} from "../../../../pipeline/categories";
import { formatDateline } from "@/lib/date";

interface RouteParams {
  slug: string;
}

export function generateStaticParams(): RouteParams[] {
  return CATEGORIES.map((c) => ({ slug: categorySlug(c) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = categoryFromSlug(slug);
  if (!category) return {};
  return {
    title: category,
    description: `All stories filed under ${category}.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const category = categoryFromSlug(slug);
  if (!category) notFound();

  const articles = getArticlesByCategory(category);

  return (
    <>
      <Masthead />
      <main className="mx-auto max-w-[880px] px-4 sm:px-6 py-8 sm:py-12">
        <p className="small-caps text-accent-red">Category</p>
        <h1 className="headline mt-2 text-4xl">{category}.</h1>
        <p className="dek mt-3 text-lg">
          All stories filed under {category}, most recent first.
        </p>

        <hr className="my-8 rule-double" />

        {articles.length === 0 ? (
          <p className="mt-8 italic text-muted">No stories yet.</p>
        ) : (
          <ul className="divide-y divide-rule">
            {articles.map((a) => (
              <li key={`${a.edition}-${a.slug}`} className="py-6">
                <Link
                  href={a.href}
                  className="!text-ink no-underline transition-opacity duration-150 hover:opacity-70"
                >
                  <p className="small-caps text-muted">
                    {formatDateline(a.edition)}
                  </p>
                  <h2 className="headline mt-1 text-2xl">{a.headline}</h2>
                  <p className="dek mt-1 text-base">{a.dek}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </>
  );
}
