import type { IncidentSeverity } from "../../../api/types";

import styles from "./Badge.module.css";

const severityClass: Record<IncidentSeverity, string> = {
  Low: styles.severityLow,
  Medium: styles.severityMedium,
  High: styles.severityHigh,
  Critical: styles.severityCritical,
};

interface SeverityBadgeProps {
  severity: IncidentSeverity;
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  return (
    <span className={[styles.badge, severityClass[severity]].join(" ")}>
      {severity}
    </span>
  );
}
