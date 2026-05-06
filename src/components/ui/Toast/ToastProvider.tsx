import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import * as RToast from "@radix-ui/react-toast";

import styles from "./Toast.module.css";

type Variant = "success" | "error" | "info";

interface ToastInstance {
  id: number;
  title: string;
  description?: string;
  variant: Variant;
}

interface ToastApi {
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastInstance[]>([]);

  const push = useCallback(
    (variant: Variant, title: string, description?: string) => {
      setToasts((prev) => [
        ...prev,
        { id: Date.now() + Math.random(), title, description, variant },
      ]);
    },
    [],
  );

  const api = useMemo<ToastApi>(
    () => ({
      success: (title, description) => push("success", title, description),
      error: (title, description) => push("error", title, description),
      info: (title, description) => push("info", title, description),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      {toasts.map((t) => (
        <RToast.Root
          key={t.id}
          className={[styles.toast, styles[t.variant]].join(" ")}
          onOpenChange={(open) => {
            if (!open) {
              setToasts((prev) => prev.filter((x) => x.id !== t.id));
            }
          }}
        >
          <span className={styles.iconWrap} aria-hidden="true">
            <ToastIcon variant={t.variant} />
          </span>
          <div className={styles.body}>
            <RToast.Title className={styles.title}>{t.title}</RToast.Title>
            {t.description ? (
              <RToast.Description className={styles.description}>
                {t.description}
              </RToast.Description>
            ) : null}
          </div>
          <RToast.Close className={styles.close} aria-label="Dismiss">
            <CloseIcon />
          </RToast.Close>
        </RToast.Root>
      ))}
      <RToast.Viewport className={styles.viewport} />
    </ToastContext.Provider>
  );
}

function ToastIcon({ variant }: { variant: Variant }) {
  if (variant === "success") {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
        <polyline
          points="6 10 9 13 14 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (variant === "error") {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
        <line
          x1="10"
          y1="6"
          x2="10"
          y2="11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="10" cy="14" r="1" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
      <line
        x1="10"
        y1="9"
        x2="10"
        y2="14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="10" cy="6" r="1" fill="currentColor" />
    </svg>
  );
}

function CloseIcon() {
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
      <line x1="3" y1="3" x2="13" y2="13" />
      <line x1="13" y1="3" x2="3" y2="13" />
    </svg>
  );
}
