import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { Broadsheet } from "@/components/Broadsheet";
import { getAllEditions, getEditionByDate } from "@/lib/articles";
import { formatDateline } from "@/lib/date";

interface RouteParams {
  date: string;
}

export function generateStaticParams(): RouteParams[] {
  return getAllEditions().map((e) => ({ date: e.date }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { date } = await params;
  const edition = getEditionByDate(date);
  if (!edition) return {};
  return {
    title: `Edition — ${formatDateline(date)}`,
    description: edition.articles[0]?.dek,
  };
}

export default async function ArchiveEdition({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { date } = await params;
  const edition = getEditionByDate(date);
  if (!edition) notFound();

  return (
    <>
      <Masthead editionDate={edition.date} />
      <Broadsheet edition={edition} />
      <Footer />
    </>
  );
}
