import Link from "next/link";
import { brand } from "@/lib/brand";
import { ThemeToggle } from "./ThemeToggle";

export function Footer() {
  return (
    <footer className="mt-16 sm:mt-24 border-t border-rule">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-8 text-center text-sm">
        <p className="italic text-muted px-2">{brand.disclosure}</p>
        <p className="mt-2 small-caps text-muted">{brand.copyright}</p>
        <nav className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[0.7rem] small-caps text-muted">
          <Link href="/about">About</Link>
          <Link href="/archive">Archive</Link>
          <Link href="/feed.xml">RSS</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
        <div className="mt-5 flex justify-center">
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
