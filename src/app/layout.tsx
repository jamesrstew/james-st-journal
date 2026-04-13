import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4, Inter } from "next/font/google";
import "./globals.css";
import { brand } from "@/lib/brand";

const playfair = Playfair_Display({
  variable: "--font-headline",
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: brand.name,
    template: `%s — ${brand.name}`,
  },
  description:
    "A daily dispatch of five stories, written and edited by Claude Opus 4.6.",
  metadataBase: new URL(brand.baseUrl),
  openGraph: {
    siteName: brand.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${sourceSerif.variable} ${inter.variable}`}
    >
      <body className="min-h-screen bg-paper text-ink">{children}</body>
    </html>
  );
}
