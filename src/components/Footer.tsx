import Link from "next/link";
import { brand } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-rule">
      <div className="mx-auto max-w-[1200px] px-6 py-8 text-center text-sm">
        <p className="italic text-muted">{brand.disclosure}</p>
        <p className="mt-2 small-caps text-muted">{brand.copyright}</p>
        <nav className="mt-4 flex justify-center gap-5 text-[0.7rem] small-caps text-muted">
          <Link href="/about">About</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
      </div>
    </footer>
  );
}
