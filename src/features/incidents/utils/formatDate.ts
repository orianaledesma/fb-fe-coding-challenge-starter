const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return dateFormatter.format(date);
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return dateTimeFormatter.format(date);
}

export function relativeTime(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  const diffSec = Math.round((now.getTime() - date.getTime()) / 1000);
  const abs = Math.abs(diffSec);

  if (abs < 60) return "just now";
  if (abs < 3600) {
    const m = Math.round(abs / 60);
    return `${m} minute${m === 1 ? "" : "s"} ago`;
  }
  if (abs < 86_400) {
    const h = Math.round(abs / 3600);
    return `${h} hour${h === 1 ? "" : "s"} ago`;
  }
  if (abs < 86_400 * 30) {
    const d = Math.round(abs / 86_400);
    return `${d} day${d === 1 ? "" : "s"} ago`;
  }
  return formatDate(iso);
}
