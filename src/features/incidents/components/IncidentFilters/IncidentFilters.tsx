import { useId } from "react";

import { Button } from "../../../../components/ui/Button/Button";
import { Select } from "../../../../components/ui/Select/Select";
import { SEVERITY_OPTIONS, STATUS_OPTIONS } from "../../schemas/incidentSchema";
import { defaultFilters } from "../../utils/filterIncidents";
import type { IncidentFilters as Filters } from "../../utils/filterIncidents";
import type { User } from "../../../../api/types";

import styles from "./IncidentFilters.module.css";

interface IncidentFiltersProps {
  filters: Filters;
  users: User[];
  onChange: (next: Filters) => void;
}

export function IncidentFilters({
  filters,
  users,
  onChange,
}: IncidentFiltersProps) {
  const searchId = useId();

  const update = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const isFiltering =
    filters.search !== "" ||
    filters.status !== "all" ||
    filters.severity !== "all" ||
    filters.assigneeId !== "all";

  const statusOptions = [
    { value: "all", label: "All statuses" },
    ...STATUS_OPTIONS.map((s) => ({ value: s, label: s })),
  ];

  const severityOptions = [
    { value: "all", label: "All severities" },
    ...SEVERITY_OPTIONS.map((s) => ({ value: s, label: s })),
  ];

  const assigneeOptions = [
    { value: "all", label: "All assignees" },
    { value: "unassigned", label: "Unassigned" },
    ...users.map((u) => ({ value: u.id, label: u.name })),
  ];

  return (
    <section
      className={styles.toolbar}
      aria-label="Filter incidents"
      role="search"
    >
      <div className={styles.searchField}>
        <label htmlFor={searchId} className={styles.searchLabel}>
          Search
        </label>
        <div className={styles.searchInputWrap}>
          <SearchIcon className={styles.searchIcon} />
          <input
            id={searchId}
            type="search"
            className={styles.searchInput}
            value={filters.search}
            onChange={(e) => update("search", e.target.value)}
            placeholder="Search by title or description…"
          />
        </div>
      </div>

      <Select
        label="Status"
        value={filters.status}
        onValueChange={(v) => update("status", v as Filters["status"])}
        options={statusOptions}
      />

      <Select
        label="Severity"
        value={filters.severity}
        onValueChange={(v) => update("severity", v as Filters["severity"])}
        options={severityOptions}
      />

      <Select
        label="Assignee"
        value={filters.assigneeId}
        onValueChange={(v) => update("assigneeId", v as Filters["assigneeId"])}
        options={assigneeOptions}
      />

      <Button
        variant="ghost"
        size="md"
        className={styles.reset}
        onClick={() => onChange(defaultFilters)}
        disabled={!isFiltering}
      >
        Reset
      </Button>
    </section>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="7" cy="7" r="5" />
      <line x1="11" y1="11" x2="14" y2="14" />
    </svg>
  );
}
