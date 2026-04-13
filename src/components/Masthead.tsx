import Link from "next/link";
import { brand } from "@/lib/brand";
import { formatDateline, editionNumberSinceLaunch, todayInPT } from "@/lib/date";

interface MastheadProps {
  editionDate?: string;
}

export function Masthead({ editionDate }: MastheadProps) {
  const date = editionDate ?? todayInPT();
  const dateline = formatDateline(date);
  const issue = editionNumberSinceLaunch(date, brand.launchDate);

  return (
    <header className="border-b-2 border-ink">
      <div className="mx-auto max-w-[1200px] px-6 pt-8 pb-4">
        <div className="flex items-center justify-between text-[0.7rem] small-caps text-muted">
          <span>{brand.volume} · NO. {issue}</span>
          <span>{dateline}</span>
        </div>
        <h1 className="mt-3 text-center">
          <Link
            href="/"
            className="headline block text-[clamp(2.5rem,7vw,4.75rem)] leading-none !text-ink no-underline"
          >
            The James St. Journal
          </Link>
        </h1>
        <p className="mt-2 text-center italic dek text-[1rem]">
          {brand.tagline}
        </p>
        <nav className="mt-4 flex justify-center gap-6 text-[0.72rem] small-caps">
          <Link href="/" className="!text-ink">Today</Link>
          <Link href="/archive" className="!text-ink">Archive</Link>
          <Link href="/about" className="!text-ink">About</Link>
        </nav>
      </div>
    </header>
  );
}
