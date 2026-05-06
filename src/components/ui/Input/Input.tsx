import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

import styles from "./Input.module.css";

interface FieldShellProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: (ariaProps: {
    id: string;
    "aria-invalid": boolean | undefined;
    "aria-describedby": string | undefined;
  }) => React.ReactNode;
}

function FieldShell({
  id,
  label,
  required,
  error,
  hint,
  children,
}: FieldShellProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required ? (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {children({
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
      })}
      {hint ? (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      ) : null}
      {error ? (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, required, id, className, ...rest },
  ref,
) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <FieldShell
      id={fieldId}
      label={label}
      required={required}
      error={error}
      hint={hint}
    >
      {(aria) => (
        <input
          ref={ref}
          required={required}
          className={[styles.input, error && styles.invalid, className]
            .filter(Boolean)
            .join(" ")}
          {...aria}
          {...rest}
        />
      )}
    </FieldShell>
  );
});

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { label, error, hint, required, id, className, ...rest },
    ref,
  ) {
    const generatedId = useId();
    const fieldId = id ?? generatedId;

    return (
      <FieldShell
        id={fieldId}
        label={label}
        required={required}
        error={error}
        hint={hint}
      >
        {(aria) => (
          <textarea
            ref={ref}
            required={required}
            className={[styles.textarea, error && styles.invalid, className]
              .filter(Boolean)
              .join(" ")}
            {...aria}
            {...rest}
          />
        )}
      </FieldShell>
    );
  },
);
