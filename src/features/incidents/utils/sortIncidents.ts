import type { Incident } from "../../../api/types";

export type SortField =
  | "createdAt"
  | "updatedAt"
  | "severity"
  | "status"
  | "title";
export type SortDirection = "asc" | "desc";

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export const defaultSort: SortConfig = {
  field: "createdAt",
  direction: "desc",
};

const severityRank: Record<Incident["severity"], number> = {
  Low: 0,
  Medium: 1,
  High: 2,
  Critical: 3,
};

const statusRank: Record<Incident["status"], number> = {
  Open: 0,
  "In Progress": 1,
  Resolved: 2,
};

function compare(a: Incident, b: Incident, field: SortField): number {
  switch (field) {
    case "createdAt":
    case "updatedAt":
      return new Date(a[field]).getTime() - new Date(b[field]).getTime();
    case "severity":
      return severityRank[a.severity] - severityRank[b.severity];
    case "status":
      return statusRank[a.status] - statusRank[b.status];
    case "title":
      return a.title.localeCompare(b.title);
  }
}

export function sortIncidents(
  incidents: Incident[],
  config: SortConfig,
): Incident[] {
  const sign = config.direction === "asc" ? 1 : -1;
  return [...incidents].sort((a, b) => sign * compare(a, b, config.field));
}
