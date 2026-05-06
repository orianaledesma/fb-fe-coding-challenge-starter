import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  leftIcon?: ReactNode;
}

function cx(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      block = false,
      leftIcon,
      className,
      children,
      type = "button",
      ...rest
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cx(
          styles.button,
          styles[variant],
          styles[size],
          block && styles.block,
          className,
        )}
        {...rest}
      >
        {leftIcon}
        {children}
      </button>
    );
  },
);
