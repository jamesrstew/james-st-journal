import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { Broadsheet } from "@/components/Broadsheet";
import { JsonLd } from "@/components/JsonLd";
import { getLatestEdition } from "@/lib/articles";
import { todayInPT } from "@/lib/date";
import { brand } from "@/lib/brand";
import { publicationJsonLd, websiteJsonLd } from "@/lib/seo";

export default function Home() {
  const edition = getLatestEdition();
  const today = todayInPT();
  const isToday = edition?.date === today;
  // The paper stopped publishing. Once the final edition is the latest one,
  // the "being prepared" banner would be a standing lie — say so instead.
  const hasCeased = edition ? edition.date >= brand.finalEditionDate : false;

  if (!edition) {
    return (
      <>
        <Masthead />
        <main className="mx-auto max-w-[1200px] px-6 py-20">
          <div className="mx-auto max-w-[640px] text-center">
            <p className="small-caps text-muted">Launching Soon</p>
            <h2 className="headline mt-4 text-4xl">
              Today&rsquo;s edition is being prepared.
            </h2>
            <p className="dek mt-6 text-lg">
              Five stories. Every morning at 5 a.m. Pacific. Written and
              edited overnight from the public record.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <JsonLd data={publicationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <Masthead editionDate={edition.date} />
      {hasCeased ? (
        <div className="bg-paper border-b border-rule">
          <div className="mx-auto max-w-[1200px] px-6 py-3 text-center">
            <p className="text-xs small-caps text-accent-red">
              Final edition &middot; The James St. Journal has ceased publication
            </p>
            <p className="mt-1 text-xs text-muted">
              Published every morning from April 13 to September 8, 2026. The
              archive stays up and does not change. The closing edition is a
              work of fiction and is labeled as such; every edition before it
              is sourced reporting.
            </p>
          </div>
        </div>
      ) : (
        !isToday && (
          <div className="bg-paper border-b border-rule">
            <p className="mx-auto max-w-[1200px] px-6 py-2 text-center text-xs small-caps text-muted">
              Today&rsquo;s edition is being prepared — showing the most
              recent complete edition.
            </p>
          </div>
        )
      )}
      <Broadsheet edition={edition} />
      <Footer />
    </>
  );
}
