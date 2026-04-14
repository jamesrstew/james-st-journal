import { ImageResponse } from "next/og";
import fs from "node:fs/promises";
import path from "node:path";
import { getAllEditions, getArticle } from "@/lib/articles";
import { brand } from "@/lib/brand";
import { formatDateline } from "@/lib/date";

export const alt = "The James St. Journal — article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface RouteParams {
  date: string;
  slug: string;
}

export function generateStaticParams(): RouteParams[] {
  return getAllEditions().flatMap((e) =>
    e.articles.map((a) => ({ date: e.date, slug: a.slug })),
  );
}

async function loadFont(file: string): Promise<ArrayBuffer> {
  const buf = await fs.readFile(path.join(process.cwd(), "public", "fonts", file));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

export default async function Image({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { date, slug } = await params;
  const article = getArticle(date, slug);

  const [playfair, sourceSerif] = await Promise.all([
    loadFont("PlayfairDisplay-Bold.ttf"),
    loadFont("SourceSerif4-Regular.ttf"),
  ]);

  const headline = article?.headline ?? brand.name;
  const dek = article?.dek ?? brand.tagline;
  const category = article?.category ?? "";
  const dateline = formatDateline(date);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#F7F1E8",
          color: "#1A1A1A",
          display: "flex",
          flexDirection: "column",
          padding: "60px 72px",
          fontFamily: "SourceSerif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "2px solid #1A1A1A",
            paddingBottom: "18px",
            fontSize: 18,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#6B5E4F",
          }}
        >
          <span>{brand.name}</span>
          <span>{dateline}</span>
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {category ? (
            <div
              style={{
                fontSize: 20,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "#A4161A",
                marginBottom: 18,
              }}
            >
              {category}
            </div>
          ) : null}
          <div
            style={{
              fontFamily: "Playfair",
              fontSize: 68,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              color: "#1A1A1A",
              display: "flex",
            }}
          >
            {headline}
          </div>
          <div
            style={{
              marginTop: 26,
              fontSize: 28,
              fontStyle: "italic",
              lineHeight: 1.35,
              color: "#6B5E4F",
              display: "flex",
            }}
          >
            {dek}
          </div>
        </div>

        <div
          style={{
            marginTop: "auto",
            paddingTop: 24,
            borderTop: "1px solid #C9BFAE",
            display: "flex",
            justifyContent: "space-between",
            fontSize: 18,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#6B5E4F",
          }}
        >
          <span>By {article?.byline ?? brand.byline}</span>
          <span>jamesstjournal.com</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Playfair", data: playfair, weight: 700, style: "normal" },
        { name: "SourceSerif", data: sourceSerif, weight: 400, style: "normal" },
      ],
    },
  );
}
