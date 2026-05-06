import styles from "./Spinner.module.css";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  /**
   * When provided, marks the spinner as a live status region.
   * Otherwise the spinner is purely decorative and should be
   * paired with a sibling/ancestor that owns the aria-live region.
   */
  label?: string;
}

export function Spinner({ size = "md", label }: SpinnerProps) {
  const ariaProps = label
    ? { role: "status" as const, "aria-label": label }
    : { "aria-hidden": true as const };
  return (
    <span className={[styles.spinner, styles[size]].join(" ")} {...ariaProps} />
  );
}

interface LoadingBlockProps {
  label?: string;
}

export function LoadingBlock({ label = "Loading…" }: LoadingBlockProps) {
  return (
    <div className={styles.center} role="status" aria-live="polite">
      <Spinner size="lg" />
      <span>{label}</span>
    </div>
  );
}
