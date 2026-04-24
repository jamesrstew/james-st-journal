#!/usr/bin/env python3
"""
Generate a pen-sketch illustration for a JSJ article via gpt-image-2 at
quality=low, then composite into a light-mode PNG (on #FAFAF7 paper with
#1A1A1A ink) and a dark-mode PNG (on #14120F paper with #ECE6D7 ink) via an
ink-density alpha-mask recomposite. Both variants are derived from one API
call — same drawing, two palettes.

Usage:
    python3 pipeline/illustrate.py <YYYY-MM-DD> <slot>-<slug> <subject>

Example:
    python3 pipeline/illustrate.py 2026-04-23 1-iran-tankers \\
      "An oil tanker ship at sea, side profile view."

Key: reads OPENAI_API_KEY from the environment. Falls back to
~/.config/jsj/openai.key for local dev. Exits 2 if neither is available.

Output:
    content/articles/<YYYY-MM-DD>/<slot>-<slug>-light.png
    content/articles/<YYYY-MM-DD>/<slot>-<slug>-dark.png

Cost at quality=low + size=1536x1024: ~$0.016 per article.
"""

import sys, os, json, base64, pathlib, urllib.request, urllib.error, time, re
from io import BytesIO
from PIL import Image, ImageChops

REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent
CONTENT   = REPO_ROOT / "content" / "articles"
KEY_FILE  = pathlib.Path.home() / ".config/jsj/openai.key"

LIGHT_BG  = (0xFA, 0xFA, 0xF7)
LIGHT_INK = (0x1A, 0x1A, 0x1A)
DARK_BG   = (0x14, 0x12, 0x0F)
DARK_INK  = (0xEC, 0xE6, 0xD7)

DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
SLUG_RE = re.compile(r"^\d+-[a-z0-9]+(?:-[a-z0-9]+)*$")

STYLE_SUFFIX = (
    " Style: a single simple black ink pen-and-ink line drawing on a plain white "
    "background — minimalist mid-century newspaper spot-illustration aesthetic, "
    "like a naturalist's field-notebook sketch. Clean thin black outlines with at "
    "most light crosshatching; no solid black fills, no grey washes, no color, no "
    "shading gradients. Generous white negative space. One physical real-world "
    "object or scene, not an infographic, not a chart, not a diagram, not a "
    "flowchart, not a map. Absolutely no text, no letters, no numbers, no labels, "
    "no signs, no flags with writing — zero characters of any script anywhere."
)


def load_api_key() -> str:
    key = os.environ.get("OPENAI_API_KEY")
    if key:
        return key.strip()
    if KEY_FILE.exists():
        return KEY_FILE.read_text().strip()
    print("error: set $OPENAI_API_KEY or place a key at ~/.config/jsj/openai.key",
          file=sys.stderr)
    sys.exit(2)


def request_image(prompt: str, slug: str, attempt: int) -> bytes:
    body = json.dumps({
        "model": "gpt-image-2",
        "prompt": prompt + STYLE_SUFFIX,
        "n": 1,
        "size": "1536x1024",
        "quality": "low",
        "output_format": "png",
    }).encode("utf-8")
    req = urllib.request.Request(
        "https://api.openai.com/v1/images/generations",
        data=body,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {load_api_key()}",
        },
        method="POST",
    )
    t0 = time.time()
    print(f"[{slug}] attempt {attempt}: requesting gpt-image-2…", flush=True)
    try:
        with urllib.request.urlopen(req, timeout=180) as resp:
            resp_body = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        err_text = e.read().decode("utf-8", errors="replace")
        print(f"[{slug}] HTTP {e.code}: {err_text}", file=sys.stderr)
        raise
    print(f"[{slug}] done in {time.time()-t0:.1f}s", flush=True)
    return base64.b64decode(resp_body["data"][0]["b64_json"])


def generate(prompt: str, slug: str) -> bytes:
    try:
        return request_image(prompt, slug, attempt=1)
    except Exception as exc:
        print(f"[{slug}] first attempt failed ({exc}); backing off 10s and retrying",
              file=sys.stderr)
        time.sleep(10)
        return request_image(prompt, slug, attempt=2)


def composite(raw_png: bytes, bg_rgb, ink_rgb) -> Image.Image:
    """Flatten API output onto white, then use inverted luminance as an ink-density
    alpha mask so any target paper/ink palette can be painted through it."""
    img = Image.open(BytesIO(raw_png)).convert("RGBA")
    white = Image.new("RGBA", img.size, (255, 255, 255, 255))
    flat  = Image.alpha_composite(white, img).convert("RGB")
    density = ImageChops.invert(flat.convert("L"))
    paper = Image.new("RGB", img.size, bg_rgb)
    ink   = Image.new("RGB", img.size, ink_rgb)
    return Image.composite(ink, paper, density)


def main():
    if len(sys.argv) != 4:
        print("usage: illustrate.py <YYYY-MM-DD> <slot>-<slug> <subject>",
              file=sys.stderr)
        sys.exit(2)
    date, slug, subject = sys.argv[1], sys.argv[2], sys.argv[3]
    if not DATE_RE.match(date):
        print(f"error: date must be YYYY-MM-DD, got {date!r}", file=sys.stderr)
        sys.exit(2)
    if not SLUG_RE.match(slug):
        print(f"error: slug must be <slot>-<kebab-slug>, got {slug!r}", file=sys.stderr)
        sys.exit(2)

    out_dir = CONTENT / date
    out_dir.mkdir(parents=True, exist_ok=True)

    raw = generate(subject, slug)
    composite(raw, LIGHT_BG, LIGHT_INK).save(out_dir / f"{slug}-light.png", optimize=True)
    composite(raw, DARK_BG,  DARK_INK ).save(out_dir / f"{slug}-dark.png",  optimize=True)
    print(f"[{slug}] wrote {slug}-light.png and {slug}-dark.png to content/articles/{date}/")


if __name__ == "__main__":
    main()
