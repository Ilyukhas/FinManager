"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/ui/cn";

const nav = [
  { href: "/dashboard", label: "Дашборд" },
  { href: "/transactions", label: "Доходы/Расходы" },
  { href: "/investments", label: "Инвестиции" },
  { href: "/analytics", label: "Аналитика" },
  { href: "/profile", label: "Профиль" },
];

export function AppShell({ children, userEmail }: { children: React.ReactNode; userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
      <div className="min-h-screen bg-[radial-gradient(80%_50%_at_50%_0%,rgba(56,189,248,.12),transparent)] dark:bg-[radial-gradient(80%_50%_at_50%_0%,rgba(56,189,248,.10),transparent)]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-5 py-6 lg:grid-cols-[240px_1fr]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between">
              <Logo />
            </div>

            <nav className="mt-5 space-y-1">
              {nav.map((x) => {
                const active = pathname === x.href;
                return (
                    <Link
                        key={x.href}
                        href={x.href}
                        className={cn(
                            "block rounded-xl px-3 py-2 text-sm transition",
                            active
                                ? "gray-500 text-white dark:bg-grey dark:text-slate-900"
                                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
                        )}
                    >
                      {x.label}
                    </Link>
                );
              })}
            </nav>

            <div className="mt-6 rounded-xl border border-slate-200 p-3 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-300">
              <p className="font-medium">Пользователь</p>
              <p className="mt-1 break-all">{userEmail}</p>
              <Button className="mt-3 w-full" variant="outline" onClick={logout}>
                Выйти
              </Button>
            </div>
          </aside>

          <main className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 dark:border-slate-800 dark:bg-slate-950">
            {children}
          </main>
        </div>
      </div>
  );
}