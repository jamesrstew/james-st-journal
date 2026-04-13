import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Masthead />
      <main className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="mx-auto max-w-[640px] text-center">
          <p className="small-caps text-muted">Launching Soon</p>
          <h2 className="headline mt-4 text-4xl">
            Today&rsquo;s edition is being prepared.
          </h2>
          <p className="dek mt-6 text-lg">
            Five stories. Every morning at 5 a.m. Pacific. Written and edited
            overnight from the public record.
          </p>
          <hr className="mx-auto mt-10 w-24 rule-thin" />
          <p className="mt-10 article-body text-base">
            The James St. Journal is a personal daily paper — one editor,
            one byline, five stories chosen by an algorithm you can read. Each
            morning an editor reviews the night&rsquo;s wires, clusters the
            meaningful developments, and files the edition before first light.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
