import type { Metadata } from "next";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "About",
  description: `About ${brand.name} — methodology, byline, and publisher.`,
};

export default function About() {
  return (
    <>
      <Masthead />
      <main className="mx-auto max-w-[680px] px-6 py-16">
        <p className="small-caps text-muted">Colophon</p>
        <h1 className="headline mt-2 text-4xl">About this paper.</h1>

        <div className="article-body mt-8">
          <p>
            The James St. Journal is a one-person daily paper. Every morning at
            5 a.m. Pacific, a scheduled agent wakes up, clusters the last
            twenty-four hours of wire copy, and files five stories before
            breakfast. The reporter&rsquo;s byline is <em>J.S. Gallagher</em>,
            a pseudonym for the desk. The editor is a second pass by the same
            model, run as a fresh agent with no memory of the first draft. The
            copy is then committed to a public repository, and a static site
            is rebuilt from it automatically.
          </p>

          <p>
            The paper draws on two tiers of sources. The first tier
            &mdash; paywalled outlets such as <em>The Wall Street Journal</em>,
            <em> The New York Times</em>, <em>The Financial Times</em>, and
            <em> Bloomberg</em> &mdash; contributes headlines only, as a
            signal that a story is considered newsworthy by serious rooms.
            The second tier &mdash; the Associated Press, Reuters, the BBC,
            NPR, and other organizations that publish freely &mdash; supplies
            the facts. Every article cites its sources; every quote is
            verbatim from a source and checked against it programmatically
            before publication.
          </p>

          <h2 className="headline mt-10 text-2xl">The newsroom</h2>
          <p>
            The writing is done by Claude Opus 4.6. The editing is done by a
            separate pass of the same model, which receives only the draft
            and the source dossier &mdash; no writer reasoning &mdash; and
            which is required to run a literal substring check on every
            quoted string before approving a piece. The managing editor is a
            human, <a href="https://github.com/jamesrstew">James Stewart</a>,
            who chose the sources, wrote the prompts, set the tone guide, and
            remains responsible for the paper.
          </p>

          <h2 className="headline mt-10 text-2xl">Publisher</h2>
          <p>
            The James St. Journal is published by <strong>True Craft
            Ventures LLC</strong>, a limited liability company organized under
            the laws of the State of Oregon. Correspondence, including
            corrections, DMCA notices, and other legal inquiries, should be
            directed to the LLC via the GitHub issues page while a dedicated
            contact address is being set up.
          </p>

          <h2 className="headline mt-10 text-2xl">Corrections</h2>
          <p>
            If you spot a factual error, file an issue at{" "}
            <a href="https://github.com/jamesrstew/james-st-journal/issues">
              github.com/jamesrstew/james-st-journal
            </a>
            . Corrections will be noted on the affected article and in a
            standing corrections log once the paper&rsquo;s archive is large
            enough to warrant one.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
