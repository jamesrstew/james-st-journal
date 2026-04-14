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

export const CORE_BEATS = ["Markets", "Business", "Politics", "Tech"] as const satisfies readonly Category[];

export const CATEGORY_WEIGHT: Record<Category, number> = {
  Markets: 1.0,
  Business: 1.0,
  Politics: 1.0,
  Tech: 1.0,
  World: 0.85,
  Science: 0.7,
  Health: 0.7,
  Culture: 0.5,
  Sports: 0.5,
  Opinion: 0.5,
};

export function isCoreBeat(category: Category): boolean {
  return (CORE_BEATS as readonly Category[]).includes(category);
}

export function categorySlug(category: Category): string {
  return category.toLowerCase();
}

export function categoryFromSlug(slug: string): Category | null {
  const normalized = slug.toLowerCase();
  return CATEGORIES.find((c) => c.toLowerCase() === normalized) ?? null;
}
