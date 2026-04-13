import type { Metadata } from "next";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Privacy",
  description: `Privacy practices for ${brand.name}.`,
};

export default function Privacy() {
  return (
    <>
      <Masthead />
      <main className="mx-auto max-w-[680px] px-6 py-16">
        <p className="small-caps text-muted">Privacy</p>
        <h1 className="headline mt-2 text-4xl">Privacy.</h1>
        <p className="mt-2 text-sm text-muted">Last updated: April 13, 2026.</p>

        <div className="article-body mt-8">
          <p>
            The James St. Journal is a static publication operated by True
            Craft Ventures LLC, an Oregon limited liability company. We
            designed the site to collect as little information about its
            readers as feasibly possible. This page describes what is and is
            not collected.
          </p>

          <h2 className="headline mt-10 text-2xl">What we don&rsquo;t collect</h2>
          <ul>
            <li>No user accounts, logins, or profiles.</li>
            <li>No email collection or newsletter sign-ups (at this time).</li>
            <li>No third-party advertising or ad tracking.</li>
            <li>No cross-site tracking cookies.</li>
          </ul>

          <h2 className="headline mt-10 text-2xl">What is collected</h2>
          <p>
            The site is hosted by Vercel Inc., which automatically collects
            technical logs common to web hosting: request timestamps, IP
            addresses, user-agent strings, and response codes. These logs
            are used by Vercel for service operation, abuse prevention, and
            aggregate analytics. We do not attempt to identify individual
            readers from these logs.
          </p>
          <p>
            If privacy-preserving aggregate analytics (e.g., Vercel Web
            Analytics) are later enabled, this page will be updated to
            reflect it. Such analytics, if enabled, do not use tracking
            cookies and do not identify individual readers.
          </p>

          <h2 className="headline mt-10 text-2xl">Third-party links</h2>
          <p>
            Articles link to third-party news sources. Those sites have
            their own privacy practices; we have no control over them.
          </p>

          <h2 className="headline mt-10 text-2xl">Your rights</h2>
          <p>
            Because we do not collect personal data tied to individual
            readers, there is ordinarily nothing to access, correct, or
            delete. If you believe we hold information about you and have a
            request, file an issue at{" "}
            <a href="https://github.com/jamesrstew/james-st-journal/issues">
              github.com/jamesrstew/james-st-journal/issues
            </a>{" "}
            and we will respond in a reasonable time frame.
          </p>

          <h2 className="headline mt-10 text-2xl">Children</h2>
          <p>
            The site is not directed at children under 13 and we do not
            knowingly collect personal information from children.
          </p>

          <h2 className="headline mt-10 text-2xl">Changes</h2>
          <p>
            We may update this policy to reflect changes in practice or law.
            The &ldquo;Last updated&rdquo; date above will change when we
            do. Material changes will be noted on the homepage for a
            reasonable period.
          </p>

          <p className="mt-10 italic text-muted">
            Publisher: True Craft Ventures LLC ({brand.baseUrl.replace(/^https?:\/\//, "")}).
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
