#!/usr/bin/env tsx
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { ArticleFrontmatterSchema } from "./schemas/article";

const date = process.argv[2];
if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  console.error("usage: tsx pipeline/validate.ts YYYY-MM-DD");
  process.exit(2);
}

const dir = join(process.cwd(), "content", "articles", date);
let files: string[];
try {
  files = readdirSync(dir).filter((f) => f.endsWith(".md")).sort();
} catch {
  console.error(`no edition directory: ${dir}`);
  process.exit(1);
}

if (files.length === 0) {
  console.error(`no markdown files in ${dir}`);
  process.exit(1);
}

const errors: string[] = [];
const slugs = new Map<string, string>();
const slots = new Map<number, string>();

for (const file of files) {
  const path = join(dir, file);
  const raw = readFileSync(path, "utf8");
  const parsed = matter(raw);
  const result = ArticleFrontmatterSchema.safeParse(parsed.data);
  if (!result.success) {
    errors.push(`${file}: frontmatter invalid\n${result.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n")}`);
    continue;
  }
  const fm = result.data;
  if (fm.edition !== date) {
    errors.push(`${file}: edition ${fm.edition} != directory ${date}`);
  }
  if (slugs.has(fm.slug)) {
    errors.push(`${file}: duplicate slug "${fm.slug}" (also in ${slugs.get(fm.slug)})`);
  } else {
    slugs.set(fm.slug, file);
  }
  if (slots.has(fm.slot)) {
    errors.push(`${file}: duplicate slot ${fm.slot} (also in ${slots.get(fm.slot)})`);
  } else {
    slots.set(fm.slot, file);
  }
  if (!parsed.content.trim()) {
    errors.push(`${file}: empty body`);
  }
}

if (errors.length > 0) {
  console.error("validation failed:");
  for (const e of errors) console.error(e);
  process.exit(1);
}

console.log(`ok: ${files.length} article(s) in ${date}`);
for (const [slot, file] of [...slots.entries()].sort(([a], [b]) => a - b)) {
  console.log(`  slot ${slot}: ${file}`);
}
