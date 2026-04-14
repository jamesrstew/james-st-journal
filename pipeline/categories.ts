export const CATEGORIES = [
  "Markets",
  "Business",
  "Politics",
  "World",
  "Tech",
  "Science",
  "Health",
  "Culture",
  "Sports",
  "Opinion",
] as const;

export type Category = (typeof CATEGORIES)[number];

export function categorySlug(category: Category): string {
  return category.toLowerCase();
}

export function categoryFromSlug(slug: string): Category | null {
  const normalized = slug.toLowerCase();
  return CATEGORIES.find((c) => c.toLowerCase() === normalized) ?? null;
}
