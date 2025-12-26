"use client";

import * as React from "react";
import { cn } from "@/lib/ui/cn";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = React.forwardRef<HTMLInputElement, Props>(function Input(
  { className, label, error, ...props },
  ref
) {
  return (
    <div>
      {label ? (
        <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
          {label}
        </label>
      ) : null}
      <input
        ref={ref}
        className={cn(
          "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500 dark:border-slate-800 dark:bg-slate-950",
          className
        )}
        {...props}
      />
      {error ? (
        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{error}</p>
      ) : null}
    </div>
  );
});
