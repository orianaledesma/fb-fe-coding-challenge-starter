import type { ReactNode } from "react";

import styles from "./PageContainer.module.css";

interface PageContainerProps {
  children: ReactNode;
  id?: string;
}

export function PageContainer({
  children,
  id = "main-content",
}: PageContainerProps) {
  return (
    <main id={id} className={styles.main} tabIndex={-1}>
      <div className={styles.container}>{children}</div>
    </main>
  );
}
