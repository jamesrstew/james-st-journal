import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

const CONTENT_ROOT = path.join(process.cwd(), "content", "articles");
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const FILE_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*-(light|dark)\.png$/;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;
  if (segments.length !== 2) return NextResponse.json({ error: "not found" }, { status: 404 });
  const [date, filename] = segments;
  if (!DATE_RE.test(date) || !FILE_RE.test(filename)) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const abs = path.join(CONTENT_ROOT, date, filename);
  if (!abs.startsWith(CONTENT_ROOT + path.sep)) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  if (!fs.existsSync(abs)) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const data = fs.readFileSync(abs);
  return new NextResponse(new Uint8Array(data), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
