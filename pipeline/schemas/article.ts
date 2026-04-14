import { z } from "zod";
import { CATEGORIES } from "../categories";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const SourceSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  source: z.string().min(1),
  tier: z.enum(["body", "headline"]).default("body"),
});

export const ArticleFrontmatterSchema = z.object({
  slug: z.string().regex(SLUG_RE, "slug must be kebab-case"),
  edition: z.string().regex(DATE_RE, "edition must be YYYY-MM-DD"),
  slot: z.number().int().min(1).max(5),
  category: z.enum(CATEGORIES),
  headline: z.string().min(1).max(120),
  dek: z.string().min(1).max(200),
  byline: z.string().min(1),
  published_at: z.string().datetime(),
  reading_time_min: z.number().int().positive().optional(),
  word_count: z.number().int().positive().optional(),
  sources: z.array(SourceSchema).min(1),
  model: z.string().optional(),
  draft_iterations: z.number().int().min(0).optional(),
  needs_review: z.boolean().default(false),
  is_sample: z.boolean().default(false),
});

export type ArticleFrontmatter = z.infer<typeof ArticleFrontmatterSchema>;
export type Source = z.infer<typeof SourceSchema>;
