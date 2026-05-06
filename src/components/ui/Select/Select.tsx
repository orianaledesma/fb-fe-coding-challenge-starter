import { useId } from "react";
import * as RSelect from "@radix-ui/react-select";

import styles from "./Select.module.css";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  id?: string;
  name?: string;
  /** Hide the visible label (still announced to AT). */
  visuallyHiddenLabel?: boolean;
  ariaLabel?: string;
}

export function Select({
  label,
  value,
  onValueChange,
  options,
  placeholder,
  required,
  disabled,
  error,
  id,
  name,
  visuallyHiddenLabel = false,
  ariaLabel,
}: SelectProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const errorId = `${fieldId}-error`;

  return (
    <div className={styles.field}>
      <label
        htmlFor={fieldId}
        className={visuallyHiddenLabel ? "sr-only" : styles.label}
      >
        {label}
        {required ? (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        ) : null}
      </label>

      <RSelect.Root
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        name={name}
      >
        <RSelect.Trigger
          id={fieldId}
          className={[styles.trigger, error && styles.invalid]
            .filter(Boolean)
            .join(" ")}
          aria-label={ariaLabel ?? label}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        >
          <span className={styles.triggerValue}>
            <RSelect.Value placeholder={placeholder ?? "Select…"} />
          </span>
          <RSelect.Icon className={styles.icon} aria-hidden="true">
            <ChevronDown />
          </RSelect.Icon>
        </RSelect.Trigger>

        <RSelect.Portal>
          <RSelect.Content
            className={styles.content}
            position="popper"
            sideOffset={4}
            collisionPadding={8}
          >
            <RSelect.ScrollUpButton className={styles.scrollButton}>
              <ChevronUp />
            </RSelect.ScrollUpButton>
            <RSelect.Viewport className={styles.viewport}>
              {options.map((opt) => (
                <RSelect.Item
                  key={opt.value}
                  value={opt.value}
                  className={styles.item}
                >
                  <RSelect.ItemText>{opt.label}</RSelect.ItemText>
                  <RSelect.ItemIndicator className={styles.checkmark}>
                    <Check />
                  </RSelect.ItemIndicator>
                </RSelect.Item>
              ))}
            </RSelect.Viewport>
            <RSelect.ScrollDownButton className={styles.scrollButton}>
              <ChevronDown />
            </RSelect.ScrollDownButton>
          </RSelect.Content>
        </RSelect.Portal>
      </RSelect.Root>

      {error ? (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}

function ChevronDown() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="4 6 8 10 12 6" />
    </svg>
  );
}

function ChevronUp() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="4 10 8 6 12 10" />
    </svg>
  );
}

function Check() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 8 6.5 11.5 13 5" />
    </svg>
  );
}
