import type { Metadata } from "next";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms of use for ${brand.name}.`,
};

export default function Terms() {
  return (
    <>
      <Masthead />
      <main className="mx-auto max-w-[680px] px-4 sm:px-6 py-12 sm:py-16">
        <p className="small-caps text-muted">Terms of Use</p>
        <h1 className="headline mt-2 text-4xl">Terms.</h1>
        <p className="mt-2 text-sm text-muted">Last updated: April 13, 2026.</p>

        <div className="article-body mt-8">
          <p>
            These terms govern your use of The James St. Journal (
            <a href={brand.baseUrl}>{brand.baseUrl.replace(/^https?:\/\//, "")}</a>
            ), a website published by True Craft Ventures LLC, an Oregon
            limited liability company (&ldquo;the Publisher&rdquo;,
            &ldquo;we&rdquo;, &ldquo;us&rdquo;). By accessing the site you
            agree to these terms.
          </p>

          <h2 className="headline mt-10 text-2xl">1. Nature of the content</h2>
          <p>
            The articles on this site are original syntheses, written and
            edited by an automated system (Anthropic&rsquo;s Claude Opus 4.6
            model), drawn from publicly available news sources. Each article
            discloses its automated authorship and lists its sources. While
            quotes are verified against the source material and factual
            claims are expected to be traceable to sources, the articles are
            produced without human byline-level review and <strong>may
            contain errors</strong>. Nothing on this site is offered as
            investment, legal, medical, or other professional advice.
          </p>

          <h2 className="headline mt-10 text-2xl">2. No warranties</h2>
          <p>
            The site and its contents are provided &ldquo;as is&rdquo; and
            &ldquo;as available&rdquo;, without warranties of any kind,
            express or implied, including without limitation warranties of
            merchantability, fitness for a particular purpose, non-infringement,
            or accuracy. To the fullest extent permitted by law, the
            Publisher disclaims all such warranties.
          </p>

          <h2 className="headline mt-10 text-2xl">3. Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, in no event will the
            Publisher, its members, officers, contractors, or affiliates be
            liable for any indirect, incidental, consequential, special, or
            punitive damages, or any loss of profits, revenues, data, or
            goodwill, arising out of or related to your use of or reliance
            on the site or its content &mdash; even if the Publisher has
            been advised of the possibility of such damages. The Publisher&rsquo;s
            total aggregate liability to you for any and all claims arising
            out of or relating to the site will not exceed one hundred U.S.
            dollars ($100).
          </p>

          <h2 className="headline mt-10 text-2xl">4. Intellectual property</h2>
          <p>
            The original expression of the articles published on this site
            &mdash; the specific wording, arrangement, and headlines &mdash;
            is copyright of True Craft Ventures LLC. Source materials cited
            in each article remain the property of their respective
            publishers and are linked for attribution. Quoting, linking, and
            citation of articles from this site is permitted; wholesale
            copying of articles or the site&rsquo;s design is not. The
            brand marks &ldquo;The James St. Journal&rdquo; and the
            accompanying typographic wordmark are used under the ownership
            of True Craft Ventures LLC.
          </p>

          <h2 className="headline mt-10 text-2xl">5. DMCA</h2>
          <p>
            To submit a notice under the Digital Millennium Copyright Act,
            file an issue at{" "}
            <a href="https://github.com/jamesrstew/james-st-journal/issues">
              github.com/jamesrstew/james-st-journal/issues
            </a>{" "}
            with the title &ldquo;DMCA notice&rdquo; and include: identification
            of the copyrighted work, the allegedly infringing material, your
            contact information, a good-faith statement, and a statement
            under penalty of perjury that you are the rights holder or
            authorized to act on its behalf.
          </p>

          <h2 className="headline mt-10 text-2xl">6. Governing law</h2>
          <p>
            These terms are governed by the laws of the State of Oregon,
            excluding its choice-of-law rules. Any dispute arising out of or
            relating to the site or these terms will be brought exclusively
            in the state or federal courts located in Multnomah County,
            Oregon.
          </p>

          <h2 className="headline mt-10 text-2xl">7. Changes</h2>
          <p>
            We may update these terms from time to time. Continued use of the
            site after an update constitutes acceptance of the revised
            terms.
          </p>

          <p className="mt-10 italic text-muted">
            Contact: file an issue at the GitHub link above while a dedicated
            legal contact is being established.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
