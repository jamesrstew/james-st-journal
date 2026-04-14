import type { Metadata } from "next";
import Link from "next/link";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { getAllEditions } from "@/lib/articles";
import { formatDateline } from "@/lib/date";

export const metadata: Metadata = {
  title: "Archive",
  description: "Past editions of The James St. Journal.",
};

export default function ArchiveIndex() {
  const editions = [...getAllEditions()].reverse();

  return (
    <>
      <Masthead />
      <main className="mx-auto max-w-[880px] px-4 sm:px-6 py-8 sm:py-12">
        <p className="small-caps text-muted">Archive</p>
        <h1 className="headline mt-2 text-4xl">Past editions.</h1>
        <p className="dek mt-3 text-lg">
          Every edition of the paper, ordered most recent first.
        </p>

        <hr className="my-8 rule-double" />

        {editions.length === 0 ? (
          <p className="mt-8 italic text-muted">No editions yet.</p>
        ) : (
          <ul className="divide-y divide-rule">
            {editions.map((e) => {
              const lead = e.articles[0];
              return (
                <li key={e.date} className="py-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <Link
                      href={`/archive/${e.date}`}
                      className="!text-ink no-underline transition-opacity duration-150 hover:opacity-70"
                    >
                      <p className="small-caps text-muted">
                        {formatDateline(e.date)}
                      </p>
                      <h2 className="headline mt-1 text-2xl">
                        {lead?.headline ?? "(no stories filed)"}
                      </h2>
                      {lead ? (
                        <p className="dek mt-1 text-base">{lead.dek}</p>
                      ) : null}
                    </Link>
                    <span className="small-caps text-muted whitespace-nowrap">
                      {e.articleCount}/5
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
      <Footer />
    </>
  );
}
