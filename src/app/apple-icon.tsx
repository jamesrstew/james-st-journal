import { ImageResponse } from "next/og";
import fs from "node:fs/promises";
import path from "node:path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

async function loadFont(file: string): Promise<ArrayBuffer> {
  const buf = await fs.readFile(path.join(process.cwd(), "public", "fonts", file));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

export default async function AppleIcon() {
  const playfair = await loadFont("PlayfairDisplay-Bold.ttf");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#1A1A1A",
          color: "#FAFAF7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Playfair Display",
          fontWeight: 700,
          fontSize: 96,
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        JSJ
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Playfair Display", data: playfair, weight: 700, style: "normal" }],
    },
  );
}
