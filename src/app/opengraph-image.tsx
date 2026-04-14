import { ImageResponse } from "next/og";
import fs from "node:fs/promises";
import path from "node:path";
import { brand } from "@/lib/brand";

export const alt = "The James St. Journal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadFont(file: string): Promise<ArrayBuffer> {
  const buf = await fs.readFile(path.join(process.cwd(), "public", "fonts", file));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

export default async function Image() {
  const [playfair, sourceSerif] = await Promise.all([
    loadFont("PlayfairDisplay-Bold.ttf"),
    loadFont("SourceSerif4-Regular.ttf"),
  ]);

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
          alignItems: "center",
          justifyContent: "center",
          padding: "72px",
          fontFamily: "SourceSerif",
        }}
      >
        <div
          style={{
            fontFamily: "Playfair",
            fontSize: 104,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            textAlign: "center",
            color: "#1A1A1A",
            display: "flex",
          }}
        >
          {brand.name}
        </div>
        <div
          style={{
            marginTop: 30,
            fontSize: 34,
            fontStyle: "italic",
            color: "#6B5E4F",
            display: "flex",
          }}
        >
          {brand.tagline}
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 20,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#6B5E4F",
            display: "flex",
          }}
        >
          Five stories. Every morning. 5 a.m. Pacific.
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
