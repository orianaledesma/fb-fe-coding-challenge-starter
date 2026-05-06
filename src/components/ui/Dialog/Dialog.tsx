import type { ReactNode } from "react";
import * as RDialog from "@radix-ui/react-dialog";

import styles from "./Dialog.module.css";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
}: DialogProps) {
  return (
    <RDialog.Root open={open} onOpenChange={onOpenChange}>
      <RDialog.Portal>
        <RDialog.Overlay className={styles.overlay} />
        <RDialog.Content className={styles.content}>
          <header className={styles.header}>
            <div className={styles.titleGroup}>
              <RDialog.Title className={styles.title}>{title}</RDialog.Title>
              {description ? (
                <RDialog.Description className={styles.description}>
                  {description}
                </RDialog.Description>
              ) : null}
            </div>
            <RDialog.Close
              className={styles.closeButton}
              aria-label="Close dialog"
            >
              <CloseIcon />
            </RDialog.Close>
          </header>
          <div className={styles.body}>{children}</div>
          {footer ? <div className={styles.footer}>{footer}</div> : null}
        </RDialog.Content>
      </RDialog.Portal>
    </RDialog.Root>
  );
}

function CloseIcon() {
  return (
    <svg
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
      <line x1="3" y1="3" x2="13" y2="13" />
      <line x1="13" y1="3" x2="3" y2="13" />
    </svg>
  );
}
