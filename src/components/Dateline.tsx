import { brand } from "@/lib/brand";
import { formatDateline, editionNumberSinceLaunch } from "@/lib/date";

interface DatelineProps {
  editionDate: string;
  articleCount?: number;
  isComplete?: boolean;
}

export function Dateline({
  editionDate,
  articleCount,
  isComplete,
}: DatelineProps) {
  const dateline = formatDateline(editionDate);
  const issue = editionNumberSinceLaunch(editionDate, brand.launchDate);
  const incomplete =
    typeof articleCount === "number" && isComplete === false;

  return (
    <div className="border-b border-ink">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[0.65rem] sm:text-[0.7rem] small-caps">
        <span>{brand.volume} · NO. {issue}</span>
        <span className="text-muted">{dateline}</span>
        <span className="text-muted hidden sm:inline">
          {incomplete
            ? `${articleCount}/5 STORIES — EDITORIAL GAP NOTED`
            : "FIVE STORIES"}
        </span>
        {incomplete && (
          <span className="text-muted sm:hidden">
            {articleCount}/5 · GAP NOTED
          </span>
        )}
      </div>
    </div>
  );
}
