import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { defaultFilters, type IncidentFilters } from "../utils/filterIncidents";
import {
  defaultSort,
  type SortConfig,
  type SortDirection,
  type SortField,
} from "../utils/sortIncidents";

const VALID_SORT_FIELDS: SortField[] = [
  "createdAt",
  "updatedAt",
  "severity",
  "status",
  "title",
];

export interface IncidentListUrlState {
  filters: IncidentFilters;
  sort: SortConfig;
}

interface UpdaterApi {
  setFilters: (next: IncidentFilters) => void;
  setSort: (next: SortConfig) => void;
}

export function useIncidentSearchParams(): IncidentListUrlState & UpdaterApi {
  const [params, setParams] = useSearchParams();

  const state = useMemo<IncidentListUrlState>(() => {
    const status = params.get("status") as IncidentFilters["status"] | null;
    const severity = params.get("severity") as
      | IncidentFilters["severity"]
      | null;
    const assignee = params.get("assignee") ?? "all";
    const search = params.get("q") ?? "";
    const sortField = params.get("sort") as SortField | null;
    const sortDir = params.get("dir") as SortDirection | null;

    return {
      filters: {
        search,
        status:
          status && ["Open", "In Progress", "Resolved"].includes(status)
            ? status
            : defaultFilters.status,
        severity:
          severity && ["Low", "Medium", "High", "Critical"].includes(severity)
            ? severity
            : defaultFilters.severity,
        assigneeId: assignee as IncidentFilters["assigneeId"],
      },
      sort: {
        field:
          sortField && VALID_SORT_FIELDS.includes(sortField)
            ? sortField
            : defaultSort.field,
        direction: sortDir === "asc" ? "asc" : "desc",
      },
    };
  }, [params]);

  const writeParams = useCallback(
    (next: { filters?: IncidentFilters; sort?: SortConfig }) => {
      const filters = next.filters ?? state.filters;
      const sort = next.sort ?? state.sort;

      const newParams = new URLSearchParams();
      if (filters.search) newParams.set("q", filters.search);
      if (filters.status !== "all") newParams.set("status", filters.status);
      if (filters.severity !== "all")
        newParams.set("severity", filters.severity);
      if (filters.assigneeId !== "all")
        newParams.set("assignee", filters.assigneeId);
      if (sort.field !== defaultSort.field) newParams.set("sort", sort.field);
      if (sort.direction !== defaultSort.direction)
        newParams.set("dir", sort.direction);

      setParams(newParams, { replace: true });
    },
    [setParams, state.filters, state.sort],
  );

  return {
    ...state,
    setFilters: (filters) => writeParams({ filters }),
    setSort: (sort) => writeParams({ sort }),
  };
}
