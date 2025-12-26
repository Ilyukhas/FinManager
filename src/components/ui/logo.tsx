import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
        PF
      </span>
      <div className="leading-tight">
        <p className="text-sm font-semibold">PentaFin</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">finance • invest</p>
      </div>
    </Link>
  );
}
