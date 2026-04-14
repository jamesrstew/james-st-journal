import Link from "next/link";
import { brand } from "@/lib/brand";

interface MastheadProps {
  editionDate?: string;
}

export function Masthead({}: MastheadProps) {
  return (
    <header className="border-b-2 border-ink">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-6 pb-4 sm:pt-8">
        <h1 className="text-center">
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
