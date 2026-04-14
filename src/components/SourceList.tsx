import type { Source } from "../../pipeline/schemas/article";

interface SourceListProps {
  sources: Source[];
}

export function SourceList({ sources }: SourceListProps) {
  return (
    <section className="mt-12 border-t border-rule pt-6">
      <p className="small-caps text-muted">Sources</p>
      <ol className="mt-3 space-y-2 text-sm">
        {sources.map((s, i) => (
          <li key={`${s.url}-${i}`} className="flex gap-2">
            <span className="text-muted tabular-nums">{i + 1}.</span>
            <span>
              <a href={s.url} rel="nofollow noopener noreferrer" target="_blank">
                {s.title}
              </a>
              <span className="text-muted"> — {s.source}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
