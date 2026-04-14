import Link from "next/link";
import type { Article } from "@/lib/articles";

type Variant = "lead" | "column" | "compact";

interface ArticleCardProps {
  article: Article;
  variant?: Variant;
}

const HEADLINE_SIZE: Record<Variant, string> = {
  lead: "text-[clamp(2rem,4.2vw,3.25rem)]",
  column: "text-[clamp(1.25rem,2vw,1.6rem)]",
  compact: "text-xl",
};

const DEK_SIZE: Record<Variant, string> = {
  lead: "text-lg",
  column: "text-[0.98rem]",
  compact: "text-sm",
};

export function ArticleCard({ article, variant = "column" }: ArticleCardProps) {
  return (
    <article className="group">
      <Link
        href={article.href}
        className="!text-ink no-underline transition-opacity duration-150 hover:opacity-70"
      >
        <p className="small-caps text-accent-red">{article.category}</p>
        <h2 className={`headline mt-2 ${HEADLINE_SIZE[variant]}`}>
          {article.headline}
        </h2>
        <p className={`dek mt-3 ${DEK_SIZE[variant]}`}>{article.dek}</p>
        <p className="mt-3 small-caps text-muted">
          By {article.byline}
          {article.reading_time_min
            ? ` · ${article.reading_time_min} min read`
            : null}
        </p>
      </Link>
    </article>
  );
}
