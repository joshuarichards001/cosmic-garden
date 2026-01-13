import clsx from "clsx";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

export function Button({
  title,
  children,
  className,
  ...props
}: {
  title?: string;
  children: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        "px-4 py-2 rounded text-sm",
        "bg-writer-button-bg-light text-writer-button-text-light",
        "hover:bg-writer-button-bg-light-hover",
        "dark:bg-writer-button-bg-dark dark:text-writer-button-text-dark",
        "dark:hover:bg-writer-button-bg-dark-hover",
        className,
      )}
      title={title}
      {...props}
    >
      {children}
    </button>
  );
}
