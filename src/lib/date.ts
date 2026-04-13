const DATELINE_FMT = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "America/Los_Angeles",
});

export function formatDateline(date: Date | string): string {
  const d = typeof date === "string" ? new Date(`${date}T12:00:00-07:00`) : date;
  return DATELINE_FMT.format(d).toUpperCase();
}

export function editionNumberSinceLaunch(
  editionDate: string,
  launchDate: string,
): number {
  const a = new Date(`${launchDate}T00:00:00-07:00`).getTime();
  const b = new Date(`${editionDate}T00:00:00-07:00`).getTime();
  const days = Math.round((b - a) / 86400000);
  return Math.max(1, days + 1);
}

export function todayInPT(): string {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(new Date());
}
