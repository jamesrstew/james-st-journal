import { NextResponse } from "next/server";

export const revalidate = 60;
export const runtime = "edge";

type TickerQuote = {
  symbol: string;
  label: string;
  price: number | null;
  previousClose: number | null;
  change: number | null;
  changePct: number | null;
  currency: string | null;
  error?: string;
};

const SYMBOLS: { symbol: string; label: string }[] = [
  { symbol: "^DJI", label: "Dow" },
  { symbol: "^GSPC", label: "S&P 500" },
  { symbol: "^IXIC", label: "Nasdaq" },
  { symbol: "^RUT", label: "Russell 2000" },
  { symbol: "^TNX", label: "10-Yr Yield" },
  { symbol: "CL=F", label: "Crude" },
  { symbol: "GC=F", label: "Gold" },
  { symbol: "BTC-USD", label: "Bitcoin" },
  { symbol: "EURUSD=X", label: "Euro" },
  { symbol: "^N225", label: "Nikkei" },
  { symbol: "^FTSE", label: "FTSE 100" },
  { symbol: "^HSI", label: "Hang Seng" },
];

async function fetchQuote(symbol: string, label: string): Promise<TickerQuote> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=2d`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; JamesStJournalTicker/1.0)" },
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const json = await res.json();
    const meta = json?.chart?.result?.[0]?.meta;
    if (!meta) throw new Error("no meta");
    const price: number | null = typeof meta.regularMarketPrice === "number" ? meta.regularMarketPrice : null;
    const prev: number | null = typeof meta.chartPreviousClose === "number" ? meta.chartPreviousClose : (typeof meta.previousClose === "number" ? meta.previousClose : null);
    const change = price != null && prev != null ? price - prev : null;
    const changePct = price != null && prev != null && prev !== 0 ? ((price - prev) / prev) * 100 : null;
    return {
      symbol,
      label,
      price,
      previousClose: prev,
      change,
      changePct,
      currency: meta.currency ?? null,
    };
  } catch (err) {
    return {
      symbol,
      label,
      price: null,
      previousClose: null,
      change: null,
      changePct: null,
      currency: null,
      error: err instanceof Error ? err.message : "fetch failed",
    };
  }
}

export async function GET() {
  const quotes = await Promise.all(SYMBOLS.map(s => fetchQuote(s.symbol, s.label)));
  return NextResponse.json(
    { quotes, updatedAt: new Date().toISOString() },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    },
  );
}
