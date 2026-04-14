import Link from "next/link";
import { brand } from "@/lib/brand";
import { formatDateline, editionNumberSinceLaunch, todayInPT } from "@/lib/date";
import { ThemeToggle } from "./ThemeToggle";

interface MastheadProps {
  editionDate?: string;
}

export function Masthead({ editionDate }: MastheadProps) {
  const date = editionDate ?? todayInPT();
  const dateline = formatDateline(date);
  const issue = editionNumberSinceLaunch(date, brand.launchDate);

  return (
    <header className="border-b-2 border-ink">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-6 pb-4 sm:pt-8">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[0.65rem] sm:text-[0.7rem] small-caps text-muted">
          <span>{brand.volume} · NO. {issue}</span>
          <span className="order-3 w-full text-center sm:order-none sm:w-auto">
            {dateline}
          </span>
          <ThemeToggle />
        </div>
        <h1 className="mt-3 text-center">
          <Link
            href="/"
            className="headline block text-[clamp(2rem,9vw,4.75rem)] leading-none !text-ink no-underline"
          >
            The James St. Journal
          </Link>
        </h1>
        <p className="mt-2 text-center italic dek text-[0.95rem] sm:text-[1rem]">
          {brand.tagline}
        </p>
        <nav className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-1 text-[0.7rem] sm:text-[0.72rem] small-caps">
          <Link href="/" className="!text-ink">Today</Link>
          <Link href="/archive" className="!text-ink">Archive</Link>
          <Link href="/about" className="!text-ink">About</Link>
        </nav>
      </div>
    </header>
  );
}
