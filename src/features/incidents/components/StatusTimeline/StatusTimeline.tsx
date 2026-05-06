import { StatusBadge } from "../../../../components/ui/Badge/StatusBadge";
import { formatDateTime } from "../../utils/formatDate";
import type { StatusHistoryEntry, User } from "../../../../api/types";

import styles from "./StatusTimeline.module.css";

interface StatusTimelineProps {
  history: StatusHistoryEntry[];
  users: User[];
}

export function StatusTimeline({ history, users }: StatusTimelineProps) {
  const userById = new Map(users.map((u) => [u.id, u]));
  const ordered = [...history].sort(
    (a, b) =>
      new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime(),
  );

  return (
    <ol className={styles.timeline}>
      {ordered.map((entry, idx) => {
        const user = userById.get(entry.changedBy);
        const who =
          user?.name ?? (entry.changedBy === "current-user" ? "You" : entry.changedBy);
        return (
          <li key={`${entry.changedAt}-${idx}`} className={styles.entry}>
            <span className={styles.markerCol} aria-hidden="true">
              <span className={styles.line} />
              <span className={styles.dot} />
            </span>
            <div className={styles.body}>
              <span className={styles.statusRow}>
                <StatusBadge status={entry.status} />
                <span className={styles.changedBy}>by {who}</span>
              </span>
              <time
                dateTime={entry.changedAt}
                className={styles.timestamp}
              >
                {formatDateTime(entry.changedAt)}
              </time>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
