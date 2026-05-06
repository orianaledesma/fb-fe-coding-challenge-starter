import { Link } from "react-router-dom";

import { StatusBadge } from "../../../../components/ui/Badge/StatusBadge";
import { SeverityBadge } from "../../../../components/ui/Badge/SeverityBadge";
import { formatDate } from "../../utils/formatDate";
import type {
  SortConfig,
  SortDirection,
  SortField,
} from "../../utils/sortIncidents";
import type { Incident, User } from "../../../../api/types";

import styles from "./IncidentList.module.css";

interface IncidentListProps {
  incidents: Incident[];
  users: User[];
  sort: SortConfig;
  onSortChange: (sort: SortConfig) => void;
  totalCount: number;
}

interface ColumnDef {
  key: string;
  label: string;
  sortField?: SortField;
}

const columns: ColumnDef[] = [
  { key: "title", label: "Incident", sortField: "title" },
  { key: "status", label: "Status", sortField: "status" },
  { key: "severity", label: "Severity", sortField: "severity" },
  { key: "assignee", label: "Assignee" },
  { key: "createdAt", label: "Created", sortField: "createdAt" },
];

export function IncidentList({
  incidents,
  users,
  sort,
  onSortChange,
  totalCount,
}: IncidentListProps) {
  const userById = new Map(users.map((u) => [u.id, u]));

  const toggleSort = (field: SortField) => {
    if (sort.field === field) {
      onSortChange({
        field,
        direction: sort.direction === "asc" ? "desc" : "asc",
      });
    } else {
      onSortChange({ field, direction: field === "title" ? "asc" : "desc" });
    }
  };

  const ariaSort = (field?: SortField): "ascending" | "descending" | "none" => {
    if (!field || sort.field !== field) return "none";
    return sort.direction === "asc" ? "ascending" : "descending";
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.count} role="status" aria-live="polite">
        Showing {incidents.length} of {totalCount}{" "}
        {totalCount === 1 ? "incident" : "incidents"}
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={ariaSort(col.sortField)}
                >
                  {col.sortField ? (
                    <button
                      type="button"
                      className={styles.sortable}
                      onClick={() => toggleSort(col.sortField!)}
                    >
                      {col.label}
                      <SortIcon
                        active={sort.field === col.sortField}
                        direction={sort.direction}
                      />
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {incidents.map((inc) => {
              const assignee = inc.assigneeId
                ? userById.get(inc.assigneeId)
                : null;
              return (
                <tr key={inc.id} className={styles.row}>
                  <td>
                    <div className={styles.titleCell}>
                      <Link
                        to={`/incidents/${inc.id}`}
                        className={styles.titleLink}
                      >
                        {inc.title}
                      </Link>
                      {inc.description ? (
                        <span className={styles.description}>
                          {inc.description}
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className={styles.badges}>
                    <StatusBadge status={inc.status} />
                  </td>
                  <td className={styles.badges}>
                    <SeverityBadge severity={inc.severity} />
                  </td>
                  <td>
                    {assignee ? (
                      <span className={styles.assignee}>{assignee.name}</span>
                    ) : (
                      <span className={styles.unassigned}>Unassigned</span>
                    )}
                  </td>
                  <td className={[styles.date, styles.meta].join(" ")}>
                    <time dateTime={inc.createdAt}>
                      {formatDate(inc.createdAt)}
                    </time>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface SortIconProps {
  active: boolean;
  direction: SortDirection;
}

function SortIcon({ active, direction }: SortIconProps) {
  return (
    <svg
      className={active ? styles.sortIconActive : styles.sortIcon}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {!active || direction === "asc" ? <polyline points="3 7 6 4 9 7" /> : null}
      {!active || direction === "desc" ? (
        <polyline points="3 5 6 8 9 5" />
      ) : null}
    </svg>
  );
}
