export const colors = {
  paper: "#F7F1E8",
  ink: "#1A1A1A",
  rule: "#C9BFAE",
  muted: "#6B5E4F",
  accentRed: "#A4161A",
  link: "#1C4A73",
} as const;

export const fonts = {
  headline: "var(--font-headline)",
  body: "var(--font-body)",
  ui: "var(--font-ui)",
} as const;

export const brand = {
  name: "The James St. Journal",
  shortName: "James St. Journal",
  tagline: "A daily dispatch.",
  disclosure:
    "Written and edited by Claude Opus 4.6 from public news sources.",
  publisher: "True Craft Ventures LLC",
  copyright: "© 2026 True Craft Ventures LLC.",
  byline: "J.S. Gallagher",
  volume: "VOL. I",
  launchDate: "2026-04-13",
  baseUrl:
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://jamesstjournal.com",
} as const;

export const measure = {
  articleBodyMaxWidth: "680px",
  broadsheetMaxWidth: "1200px",
} as const;
