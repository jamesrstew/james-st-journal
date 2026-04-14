"use client";

import { useEffect, useState } from "react";

type Quote = {
  symbol: string;
  label: string;
  price: number | null;
  previousClose: number | null;
  change: number | null;
  changePct: number | null;
  currency: string | null;
  error?: string;
};

type TickerPayload = {
  quotes: Quote[];
  updatedAt: string;
};

function formatPrice(q: Quote): string {
  if (q.price == null) return "—";
  const p = q.price;
  // Yields shown as percent-like numbers (TNX is yield × 1, already percent-looking)
  if (q.symbol === "^TNX") return p.toFixed(2) + "%";
  if (q.symbol === "EURUSD=X") return p.toFixed(4);
  // Large numbers get thousands separators and two decimals
  return p.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatPct(pct: number | null): string {
  if (pct == null) return "—";
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(2)}%`;
}

export function Ticker() {
  const [data, setData] = useState<TickerPayload | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/ticker", { cache: "no-store" });
        if (!res.ok) throw new Error("ticker fetch failed");
        const json = (await res.json()) as TickerPayload;
        if (!cancelled) {
          setData(json);
          setFailed(false);
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    }
    load();
    const id = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  if (failed && !data) return null;

  const quotes = data?.quotes ?? [];
  const visible = quotes.filter(q => q.price != null);
  if (visible.length === 0) {
    // Render a thin loading strip to reserve space without flashing empty
    return (
      <div className="border-b border-rule bg-ink text-[0.7rem] text-paper/60">
        <div className="mx-auto flex max-w-[1400px] items-center gap-6 overflow-x-auto whitespace-nowrap px-4 py-1.5 small-caps tracking-wider">
          <span>Markets loading…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-rule bg-ink text-paper">
      <div
        className="mx-auto flex max-w-[1400px] items-center gap-6 overflow-x-auto whitespace-nowrap px-4 py-1.5 text-[0.72rem]"
        role="marquee"
        aria-label="Market ticker"
      >
        {visible.map(q => {
          const up = (q.change ?? 0) > 0;
          const down = (q.change ?? 0) < 0;
          const colorClass = up ? "text-[#4ED58A]" : down ? "text-[#E07276]" : "text-paper/70";
          const arrow = up ? "▲" : down ? "▼" : "·";
          return (
            <span key={q.symbol} className="flex items-center gap-1.5">
              <span className="small-caps tracking-wider text-paper/85">{q.label}</span>
              <span className="tabular-nums font-semibold text-paper">{formatPrice(q)}</span>
              <span className={`tabular-nums ${colorClass}`}>{formatPct(q.changePct)}</span>
              <span className={`text-[0.6rem] ${colorClass}`} aria-hidden="true">{arrow}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
