# The James St. Journal: Brand Identity Guidelines

**Version 1.0 | Target Audience: General readers; WSJ-style news**

## 1. Brand Philosophy

**"A quieter Wall Street Journal."**
The James St. Journal is a personal daily paper — five stories filed before first light, written and edited overnight from the public record. Our identity must carry two ideas at once:

1. **The Heritage:** Classic broadsheet typography — serifs, rules, small-caps datelines — signals authority, a slower pace, and respect for the reader.
2. **The Edit:** A single desk. One pseudonymous byline ("By J.S. Gallagher"). A transparent disclosure on every page that the paper is written by Claude Opus. Honesty is the brand.

**The Vibe:** _The Wall Street Journal_ in voice. _The Atlantic_ in reading measure. _Letterpress_ in texture. Quiet authority. No shouting.

---

## 2. Color System

The core differentiator is the **Paper** background. We never use pure white. The interface should feel like the reader is holding a morning paper — cream newsprint, warm ink, thin ruled dividers.

### Primary Palette

- **Paper (Background):** The canvas of every page.
  - **Hex:** `#F7F1E8` (newsprint cream)
  - **Texture note:** A subtle noise/grain overlay (2–3% opacity) is acceptable on large empty areas to simulate stock; never on text itself.
- **Ink (Primary Text & Logotype):** Never pure black. A deep, warm charcoal.
  - **Hex:** `#1A1A1A`
- **Muted Ink (Secondary Text, Bylines, Datelines):** For metadata and caption-level text.
  - **Hex:** `#6B5E4F` (warm putty)
- **Rule (Dividers):** Thin hair-lines between columns and stories.
  - **Hex:** `#C9BFAE` (warm beige)

### Accent Palette

Used sparingly. Accents are the exception, not the rule.

- **Accent Red (Breaking / Corrections):** A restrained brick-red, resembling red printer&rsquo;s ink.
  - **Hex:** `#A4161A`
  - **Usage:** BREAKING tags on lead stories; correction flags; nothing else.
- **Link Navy:** The only blue in the system. WSJ-adjacent, academic.
  - **Hex:** `#1C4A73`
  - **Usage:** In-body links, nav hovers, source URLs in the footer.

### Don&rsquo;t

- No gradients.
- No tech-blue / electric-blue.
- No pure black, pure white, or cool grays.
- No dark mode (for v1). The paper aesthetic depends on the cream background.

---

## 3. Typography

Typography is the voice of the brand. High-contrast serif for headlines. Comfortable transitional serif for body. Clean sans for UI chrome only.

### Primary Typeface — Headlines & Logotype

**Font family:** **Playfair Display** (Google Fonts, free).

- **Usage:** Masthead, article headlines, deks (italic), drop caps.
- **Style:** Sharp serifs, dramatic contrast between thick and thin strokes.
- **Tracking:** Tight (`-0.02em`) for masthead and headlines.
- **Weight:** 700 or 800 for headlines; 400 italic for deks.

### Secondary Typeface — Body Copy

**Font family:** **Source Serif 4** (Google Fonts, free).

- **Usage:** Article body, long-form prose, captions.
- **Why:** Designed for on-screen legibility while keeping the literary feel of a newspaper.
- **Size:** 17px body (`1.0625rem`), 1.65 line-height, justified on desktop (with hyphens), ragged-right on mobile.
- **Measure:** Maximum 680px content width on article pages.

### UI Typeface — Chrome, Metadata, Labels

**Font family:** **Inter** (Google Fonts, free).

- **Usage:** Nav items, datelines, category eyebrows, small-caps labels, source citation footers, OG image chips.
- **Style:** Used in small-caps (`text-transform: uppercase`, `letter-spacing: 0.12em`) at ~12px for datelines and eyebrows.
- **Why:** Serifs get muddy at small sizes in dense layouts. Inter stays crisp.

### Don&rsquo;t

- Don&rsquo;t use Inter for body copy.
- Don&rsquo;t use Playfair for anything under ~24px.
- Don&rsquo;t mix in a third serif family.

---

## 4. Logo & Masthead

### The Wordmark

- **The James St. Journal** — set in Playfair Display 800, centered, tight tracking.
- On the homepage masthead the wordmark runs `clamp(2.5rem, 7vw, 4.75rem)`.
- The article page uses a smaller wordmark in the top-left (~1.25rem).
- No stylized icon or logomark is required for v1. The wordmark is the logo.

### The Masthead Block

Every edition page carries the masthead. From top to bottom:

1. Volume + issue number (small-caps, muted, left-aligned)
2. Dateline (small-caps, muted, right-aligned, `MONDAY, APRIL 13, 2026`)
3. Wordmark (centered, Playfair 800)
4. Tagline in Playfair italic ("A daily dispatch.")
5. Nav: Today · Archive · About (small-caps)
6. A 2px solid Ink bottom border closing the masthead block.

### Exclusion Zone

The masthead wordmark always has vertical breathing room equal to the cap-height of the letter "J" above and below.

---

## 5. Layout & Grid

### The Broadsheet Grid

The homepage and archive pages use a broadsheet layout:

- **Max width:** 1200px.
- **Columns:** 12 columns on desktop, 1 column on mobile.
- **Slot 1 (lead story):** spans 8 columns, top-left, large headline (Playfair 800, 48–64px), dek in italic, byline and category eyebrow.
- **Slots 2–3:** each 4 columns beside or below the lead.
- **Slots 4–5:** full-width or 6/6 split below a double horizontal rule.
- **Rules:** 1px solid `--rule` beige between stories; 3px double `--ink` above section breaks.

### The Reading Grid (article page)

- **Max width:** 680px body measure.
- **Headline:** Playfair 800, 40–56px, tight leading, max ~3 lines.
- **Dek:** Playfair italic, 20px.
- **Body:** Source Serif 4 17px, 1.65 line-height, justified on desktop with hyphens, ragged-right on mobile, first paragraph drop-cap.
- **Sources footer:** small-caps label "SOURCES" followed by a bulleted list of outlet + linked title.
- **Share bar:** below article; copy link, X, email; underlined text buttons, no pill shapes.
- **Disclosure footer:** italic, muted, centered.

### Structural Rules

- **Border radius:** `0` everywhere. No rounded corners, no pill buttons.
- **Shadows:** none. Depth comes from borders and rules.
- **Buttons:** rectangular, 1px Ink border, Paper fill, Ink text. Hover → Ink fill / Paper text. No soft shadows.
- **Images (when used):** full-width within the article measure; black-and-white with a subtle grain preferred; captions in Inter small-caps.

---

## 6. Voice & Tone

(Also embedded as a reference in the pipeline writer prompt.)

- **Declarative.** Active voice. Subject-verb-object. "The Federal Reserve held rates steady" — not "Rates were held steady by the Fed."
- **Concrete.** Specific nouns. Real numbers. AP-style: "5.2%," "$1.4 million," "Wednesday."
- **Attributed.** "According to the Associated Press," "Reuters reported" — not bare assertions.
- **No editorializing on news.** Opinion labeled explicitly and kept to the Opinion category only.
- **No second-person.** Not "You might think…" — a reader, not a friend.
- **Structure:** lede graf (what and why it matters) → nut graf (the news and the stakes) → supporting grafs (context, numbers, quotes) → kicker (where it goes next).
- **Quotes:** must be verbatim from a source in the dossier. The editor sub-agent runs a substring check on every quoted string.
- **Length:** 600–1100 words. Lead stories may run longer; cultural pieces may run shorter.
- **Headline:** ≤ 90 characters; active, concrete, no puns on news pieces.
- **Dek:** ≤ 160 characters; one sentence that previews the news without repeating the headline.

---

## 7. Bylines, Datelines, and Attribution

- **Byline:** "By J.S. Gallagher" on every article — a consistent pseudonym standing for the desk.
- **Dateline:** leading city in caps where reported from; e.g., `WASHINGTON — The Federal Reserve…`. Omit if the story has no clear locus.
- **Sources footer:** every article carries a sources list with outlet names and linked titles. This is the source of truth for fact-checking.
- **Disclosure footer:** every article page ends with an italic, muted, centered line:
  > _Written and edited by Claude Opus 4.6 from public news sources. © 2026 The James St. Journal._

---

## 8. Imagery & Iconography

For v1, the paper is **text-forward**. Images are optional, and when used:

- **Photography:** black-and-white, high contrast, grain added. Abstract — a rendering of an exchange floor, a shipping port, a congressional chamber — not stock photos of people pointing.
- **Iconography:** avoid. If an icon is necessary (e.g., share buttons), use a single-weight line icon (`1.5px`), ink color, no fills.
- **No emoji** in article bodies, headlines, or UI.

The masthead, article pages, and homepage must read clearly with zero images.

---

## 9. Application Examples (Do&rsquo;s & Don&rsquo;ts)

- **DO:** Use the Paper background (`#F7F1E8`) for every page, every edge-to-edge.
- **DO:** Use hair-line rules between stories and sections.
- **DO:** Use small-caps Inter for the dateline, eyebrow category, and bylines.
- **DO:** Justify body text on desktop; leave ragged-right on mobile to avoid river gaps.
- **DO:** Use Playfair italic for deks.
- **DON&rsquo;T:** Use rounded corners, drop shadows, or gradients.
- **DON&rsquo;T:** Use pure white or cool grays.
- **DON&rsquo;T:** Use tech-blue, electric-blue, or neon accents.
- **DON&rsquo;T:** Use emoji, icons-for-decoration, or stock photography.
- **DON&rsquo;T:** Invent dark mode. The cream paper is the point.

---

## 10. Implementation Checklist

1. **Fonts** — load Playfair Display (700/800, italic 400), Source Serif 4 (400/600), Inter (400/500/600) via `next/font/google`. Expose as `--font-headline`, `--font-body`, `--font-ui`.
2. **CSS variables** — define `--paper`, `--ink`, `--rule`, `--muted`, `--accent-red`, `--link` in `:root` and map to Tailwind utilities via `@theme inline`.
3. **Global rules** — set `body { background: var(--paper); color: var(--ink); }` and default `font-family: var(--font-body)`.
4. **Utility classes** — `.small-caps`, `.headline`, `.dek`, `.article-body`, `.rule-thin`, `.rule-double` in `globals.css`.
5. **Masthead** — centered wordmark, small-caps dateline + volume, 2px bottom rule.
6. **Article body** — 680px measure, first-letter drop cap, justified desktop / ragged-right mobile.
7. **OG images** — ship `Playfair-Display-Bold.ttf` and `SourceSerif4-Regular.ttf` to `public/fonts/` for `ImageResponse`.
8. **Radius** — set a Tailwind-wide `border-radius: 0` default; audit components to remove any rounded pills.
9. **No shadows** — never set `box-shadow`. Elevation through borders and rules only.
10. **Disclosure** — render the italic Claude Opus disclosure on every article page footer.

---

_This document governs the visual and editorial identity of The James St. Journal. Changes to palette, type, or tone should be reviewed against the philosophy in §1 and the examples in §9 before adoption._
