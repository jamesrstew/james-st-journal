import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import {
  ArticleFrontmatterSchema,
  type ArticleFrontmatter,
} from "../../pipeline/schemas/article";
import { type Category } from "../../pipeline/categories";

export interface Article extends ArticleFrontmatter {
  body: string;
  reading_time_min: number;
  word_count: number;
  href: string;
}

export interface Edition {
  date: string;
  articles: Article[];
  articleCount: number;
  isComplete: boolean;
}

const CONTENT_ROOT = path.join(process.cwd(), "content", "articles");

function readArticleFile(editionDate: string, filename: string): Article {
  const full = path.join(CONTENT_ROOT, editionDate, filename);
  const raw = fs.readFileSync(full, "utf8");
  const { data, content } = matter(raw);

  const parsed = ArticleFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    const message = parsed.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(
      `Invalid frontmatter in content/articles/${editionDate}/${filename}:\n${message}`,
    );
  }

  const body = content.trim();
  const stats = readingTime(body);

  return {
    ...parsed.data,
    body,
    reading_time_min:
      parsed.data.reading_time_min ?? Math.max(1, Math.round(stats.minutes)),
    word_count: parsed.data.word_count ?? stats.words,
    href: `/article/${parsed.data.edition}/${parsed.data.slug}`,
  };
}

let _allEditions: Edition[] | null = null;

export function getAllEditions(): Edition[] {
  if (_allEditions) return _allEditions;

  if (!fs.existsSync(CONTENT_ROOT)) {
    _allEditions = [];
    return _allEditions;
  }

  const editionDirs = fs
    .readdirSync(CONTENT_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^\d{4}-\d{2}-\d{2}$/.test(d.name))
    .map((d) => d.name)
    .sort();

  const editions: Edition[] = editionDirs.map((date) => {
    const files = fs
      .readdirSync(path.join(CONTENT_ROOT, date))
      .filter((f) => f.endsWith(".md"))
      .sort();

    const articles = files
      .map((f) => readArticleFile(date, f))
      .filter((a) => !a.needs_review)
      .sort((a, b) => a.slot - b.slot);

    const slugs = new Set<string>();
    for (const a of articles) {
      if (slugs.has(a.slug)) {
        throw new Error(
          `Duplicate slug "${a.slug}" in edition ${date}. Every article in an edition must have a unique slug.`,
        );
      }
      slugs.add(a.slug);
    }

    return {
      date,
      articles,
      articleCount: articles.length,
      isComplete: articles.length === 5,
    };
  });

  _allEditions = editions;
  return editions;
}

export function getLatestEdition(): Edition | null {
  const editions = getAllEditions();
  return editions.length > 0 ? editions[editions.length - 1] : null;
}

export function getEditionByDate(date: string): Edition | null {
  return getAllEditions().find((e) => e.date === date) ?? null;
}

export function getArticle(date: string, slug: string): Article | null {
  const edition = getEditionByDate(date);
  return edition?.articles.find((a) => a.slug === slug) ?? null;
}

export function getArticlesByCategory(category: Category): Article[] {
  return getAllEditions()
    .flatMap((e) => e.articles)
    .filter((a) => a.category === category)
    .sort((a, b) => (a.edition < b.edition ? 1 : -1));
}

export function getAllArticles(): Article[] {
  return getAllEditions().flatMap((e) => e.articles);
}
