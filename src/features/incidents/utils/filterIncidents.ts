import type {
  Incident,
  IncidentSeverity,
  IncidentStatus,
} from "../../../api/types";

export interface IncidentFilters {
  search: string;
  status: IncidentStatus | "all";
  severity: IncidentSeverity | "all";
  assigneeId: string | "all" | "unassigned";
}

export const defaultFilters: IncidentFilters = {
  search: "",
  status: "all",
  severity: "all",
  assigneeId: "all",
};

export function filterIncidents(
  incidents: Incident[],
  filters: IncidentFilters,
): Incident[] {
  const search = filters.search.trim().toLowerCase();

  return incidents.filter((inc) => {
    if (filters.status !== "all" && inc.status !== filters.status) return false;
    if (filters.severity !== "all" && inc.severity !== filters.severity)
      return false;

    if (filters.assigneeId === "unassigned") {
      if (inc.assigneeId !== null) return false;
    } else if (filters.assigneeId !== "all") {
      if (inc.assigneeId !== filters.assigneeId) return false;
    }

    if (search) {
      const haystack = `${inc.title} ${inc.description}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }

    return true;
  });
}
