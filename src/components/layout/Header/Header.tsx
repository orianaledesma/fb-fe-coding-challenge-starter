import { Link } from "react-router-dom";

import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} aria-label="Incident Dashboard — Home">
          <span className={styles.brandMark} aria-hidden="true">
            ID
          </span>
          <span className={styles.brandText}>Incident Dashboard</span>
        </Link>
        <div className={styles.actions}>
          <Link to="/incidents/new" className={styles.newButton}>
            <PlusIcon /> New incident
          </Link>
        </div>
      </div>
    </header>
  );
}

function PlusIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="8" y1="3" x2="8" y2="13" />
      <line x1="3" y1="8" x2="13" y2="8" />
    </svg>
  );
}
