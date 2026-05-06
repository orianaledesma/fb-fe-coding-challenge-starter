import type { ReactNode } from "react";

import styles from "./States.module.css";

interface EmptyStateProps {
  title: string;
  message?: string;
  action?: ReactNode;
}

export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className={styles.state}>
      <span className={styles.icon} aria-hidden="true">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 9h18" />
        </svg>
      </span>
      <h3 className={styles.title}>{title}</h3>
      {message ? <p className={styles.message}>{message}</p> : null}
      {action ? <div className={styles.actions}>{action}</div> : null}
    </div>
  );
}
