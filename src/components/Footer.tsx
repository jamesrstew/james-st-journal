import { brand } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-rule">
      <div className="mx-auto max-w-[1200px] px-6 py-8 text-center text-sm">
        <p className="italic text-muted">{brand.disclosure}</p>
        <p className="mt-2 small-caps text-muted">{brand.copyright}</p>
      </div>
    </footer>
  );
}
