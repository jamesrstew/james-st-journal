import type { Article } from "@/lib/articles";

interface IllustrationProps {
  article: Article;
  eager?: boolean;
}

export function Illustration({ article, eager = false }: IllustrationProps) {
  if (!article.has_illustration) return null;
  const base = `/illustrations/${article.edition}/${article.slot}-${article.slug}`;
  const loading = eager ? "eager" : "lazy";
  return (
    <div className="illustration-wrap">
      <img
        src={`${base}-light.png`}
        alt=""
        className="illustration illustration-light"
        loading={loading}
        decoding="async"
      />
      <img
        src={`${base}-dark.png`}
        alt=""
        className="illustration illustration-dark"
        loading={loading}
        decoding="async"
      />
    </div>
  );
}
