import type { IncidentStatus } from "../../../api/types";

import styles from "./Badge.module.css";

const statusClass: Record<IncidentStatus, string> = {
  Open: styles.statusOpen,
  "In Progress": styles.statusInProgress,
  Resolved: styles.statusResolved,
};

interface StatusBadgeProps {
  status: IncidentStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={[styles.badge, statusClass[status]].join(" ")}>
      <span className={styles.dot} aria-hidden="true" />
      {status}
    </span>
  );
}
