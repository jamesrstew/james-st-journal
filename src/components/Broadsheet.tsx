import type { Edition } from "@/lib/articles";
import { ArticleCard } from "./ArticleCard";
import { Dateline } from "./Dateline";

interface BroadsheetProps {
  edition: Edition;
}

export function Broadsheet({ edition }: BroadsheetProps) {
  const [lead, ...rest] = edition.articles;
  const secondaries = rest.slice(0, 4);

  if (!lead) {
    return (
      <main className="mx-auto max-w-[1200px] px-4 sm:px-6 py-20 text-center">
        <p className="small-caps text-muted">No stories filed</p>
        <h2 className="headline mt-4 text-3xl">
          Today&rsquo;s edition is being prepared.
        </h2>
      </main>
    );
  }

  return (
    <>
      <Dateline
        editionDate={edition.date}
        articleCount={edition.articleCount}
        isComplete={edition.isComplete}
      />
      <main className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-6 sm:pt-8 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-12 md:gap-y-10">
          <div className="md:col-span-12 lg:col-span-8 lg:border-r lg:border-rule lg:pr-10 border-b border-rule pb-8 lg:border-b-0 lg:pb-0">
            <ArticleCard article={lead} variant="lead" />
          </div>
          <aside className="md:col-span-12 lg:col-span-4 space-y-8 divide-y divide-rule [&>*:not(:first-child)]:pt-8">
            {secondaries.slice(0, 2).map((a) => (
              <ArticleCard key={a.slug} article={a} variant="column" />
            ))}
          </aside>
        </div>

        {secondaries.length > 2 && (
          <>
            <hr className="mt-16 mb-16 sm:mt-24 sm:mb-24 rule-double" />
            <div className="grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2 divide-y divide-rule md:divide-y-0 [&>*:not(:first-child)]:pt-10 md:[&>*:not(:first-child)]:pt-0">
              {secondaries.slice(2).map((a) => (
                <ArticleCard key={a.slug} article={a} variant="column" />
              ))}
            </div>
          </>
        )}
      </main>
    </>
  );
}
