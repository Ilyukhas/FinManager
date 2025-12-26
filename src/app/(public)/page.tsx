import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Stat } from "@/components/ui/stat";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6">
        <Logo />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/auth/login"><Button variant="ghost">Войти</Button></Link>
          <Link href="/auth/register"><Button>Регистрация</Button></Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 pb-16 pt-10 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-xs font-medium tracking-wide text-slate-500 dark:text-slate-400">
            Персональный финансовый менеджер
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Доходы, расходы и инвестиции — в одном аккуратном дашборде.
          </h1>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            PentaFin помогает быстро фиксировать операции, видеть баланс по кошелькам и оценивать доходность портфеля.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/auth/register"><Button>Начать бесплатно</Button></Link>
            <Link href="/auth/login"><Button variant="outline">У меня уже есть аккаунт</Button></Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <Stat label="Учёт" value="Транзакции + категории" />
            <Stat label="Инвестиции" value="ROI и портфель" />
            <Stat label="Аналитика" value="Графики по месяцам" />
            <Stat label="Безопасность" value="Supabase Auth + RLS" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Превью дашборда</p>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-300">
              demo
            </span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">Баланс</p>
              <p className="mt-2 text-2xl font-semibold">€ 2 480</p>
              <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">+€ 320 за 30 дней</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">Портфель</p>
              <p className="mt-2 text-2xl font-semibold">€ 6 150</p>
              <p className="mt-1 text-xs text-sky-600 dark:text-sky-400">ROI: 8.4%</p>
            </div>
            <div className="col-span-2 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">Поток операций</p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-300">Зарплата</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">+€ 3 100</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-300">Аренда</span>
                  <span className="font-medium text-rose-600 dark:text-rose-400">-€ 1 200</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-300">ETF пополнение</span>
                  <span className="font-medium text-sky-600 dark:text-sky-400">-€ 400</span>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-5 text-xs text-slate-500 dark:text-slate-400">
            После регистрации создаются базовые категории и кошелёк.
          </p>
        </div>
      </section>
    </main>
  );
}
