"use client";

import { useEffect, useState } from "react";

type Pref = "light" | "auto" | "dark";

const OPTIONS: { value: Pref; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "auto", label: "Sys" },
  { value: "dark", label: "Dark" },
];

export function ThemeToggle() {
  const [pref, setPref] = useState<Pref>("auto");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const t = localStorage.getItem("theme");
      setPref(t === "light" || t === "dark" ? t : "auto");
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  function apply(next: Pref) {
    setPref(next);
    try {
      if (next === "auto") {
        localStorage.removeItem("theme");
        document.documentElement.removeAttribute("data-theme");
      } else {
        localStorage.setItem("theme", next);
        document.documentElement.setAttribute("data-theme", next);
      }
    } catch {
      // ignore
    }
  }

  return (
    <div
      role="group"
      aria-label="Color theme"
      className="small-caps inline-flex items-center gap-1 text-[0.65rem] leading-none"
    >
      {OPTIONS.map((opt, i) => {
        const active = mounted && pref === opt.value;
        return (
          <span key={opt.value} className="inline-flex items-center gap-1">
            {i > 0 && <span aria-hidden className="text-rule">·</span>}
            <button
              type="button"
              onClick={() => apply(opt.value)}
              aria-pressed={active}
              className={
                (active ? "text-ink" : "text-muted hover:opacity-70") +
                " cursor-pointer transition-opacity"
              }
            >
              {opt.label}
            </button>
          </span>
        );
      })}
    </div>
  );
}
