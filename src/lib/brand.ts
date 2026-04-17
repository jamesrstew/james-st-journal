export const colors = {
  paper: "#FAFAF7",
  ink: "#1A1A1A",
  rule: "#D7D3CB",
  muted: "#5E5A53",
  accentRed: "#A4161A",
  link: "#1C4A73",
} as const;

export const fonts = {
  headline: "var(--font-headline)",
  body: "var(--font-body)",
  ui: "var(--font-ui)",
} as const;

export const modelName = "Claude Opus 4.7";

export const brand = {
  name: "The James St. Journal",
  shortName: "James St. Journal",
  tagline: "A daily dispatch.",
  modelName,
  disclosure: `Written and edited by ${modelName} from public news sources.`,
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
