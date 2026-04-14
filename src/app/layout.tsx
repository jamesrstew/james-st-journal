import type { Metadata, Viewport } from "next";
import { Playfair_Display, Source_Serif_4, Inter } from "next/font/google";
import "./globals.css";
import { brand } from "@/lib/brand";
import { Ticker } from "@/components/Ticker";

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
    default: `${brand.name} — ${brand.tagline}`,
    template: `%s — ${brand.name}`,
  },
  description:
    "A daily dispatch of five original stories, written and edited overnight by Claude Opus 4.6 from the public record. New edition every morning at 5 a.m. Pacific.",
  metadataBase: new URL(brand.baseUrl),
  applicationName: brand.name,
  keywords: [
    "daily news",
    "AI news",
    "Claude",
    "Anthropic",
    "news digest",
    "newspaper",
    "WSJ alternative",
    brand.name,
  ],
  authors: [{ name: brand.byline }],
  creator: brand.publisher,
  publisher: brand.publisher,
  category: "news",
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: brand.name }],
    },
  },
  openGraph: {
    siteName: brand.name,
    type: "website",
    locale: "en_US",
    url: brand.baseUrl,
    title: `${brand.name} — ${brand.tagline}`,
    description:
      "Five original stories, written and edited overnight. New edition every morning at 5 a.m. Pacific.",
  },
  twitter: {
    card: "summary_large_image",
    title: brand.name,
    description:
      "Five stories. Every morning at 5 a.m. Pacific. Written and edited by Claude Opus 4.6.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF7" },
    { media: "(prefers-color-scheme: dark)", color: "#14120F" },
  ],
  colorScheme: "light dark",
};

const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${sourceSerif.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body className="min-h-screen bg-paper text-ink">
        <Ticker />
        {children}
      </body>
    </html>
  );
}
