"use client";

import { cn } from "@/lib/ui/cn";
import * as React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline" | "ghost";
};

export function Button({ className, variant = "solid", ...props }: Props) {
  const styles =
    variant === "outline"
      ? "border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
      : variant === "ghost"
      ? "hover:bg-slate-100 dark:hover:bg-slate-900"
      : "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100";

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-60",
        styles,
        className
      )}
      {...props}
    />
  );
}
