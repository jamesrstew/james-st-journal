import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { Broadsheet } from "@/components/Broadsheet";
import { JsonLd } from "@/components/JsonLd";
import { getLatestEdition } from "@/lib/articles";
import { todayInPT } from "@/lib/date";
import { publicationJsonLd, websiteJsonLd } from "@/lib/seo";

export default function Home() {
  const edition = getLatestEdition();
  const today = todayInPT();
  const isToday = edition?.date === today;

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
      {!isToday && (
        <div className="bg-paper border-b border-rule">
          <p className="mx-auto max-w-[1200px] px-6 py-2 text-center text-xs small-caps text-muted">
            Today&rsquo;s edition is being prepared — showing the most recent
            complete edition.
          </p>
        </div>
      )}
      <Broadsheet edition={edition} />
      <Footer />
    </>
  );
}
