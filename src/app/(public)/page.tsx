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
              Контроль доходов и расходов — в одном удобном дашборде.
            </h1>
            <p className="mt-4 text-slate-600 dark:text-slate-300">
              PentaFin помогает отслеживать операции, управлять бюджетом и контролировать финансы в реальном времени.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/auth/register"><Button>Начать бесплатно</Button></Link>
              <Link href="/auth/login"><Button variant="outline">У меня уже есть аккаунт</Button></Link>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <Stat label="Учёт операций" value="Доходы и расходы" />
              <Stat label="Категории" value="Гибкая система" />
              <Stat label="Аналитика" value="Графики и отчёты" />
              <Stat label="Безопасность" value="Защищённые данные" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Пример дашборда</p>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-300">
              демо
            </span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">Общий баланс</p>
                <p className="mt-2 text-2xl font-semibold">247 850 ₽</p>
                <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">+32 400 ₽ за месяц</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">Траты за месяц</p>
                <p className="mt-2 text-2xl font-semibold">68 240 ₽</p>
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">+8% к прошлому месяцу</p>
              </div>
              <div className="col-span-2 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">Последние операции</p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300">Зарплата</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">+85 000 ₽</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300">Аренда квартиры</span>
                    <span className="font-medium text-rose-600 dark:text-rose-400">-35 000 ₽</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300">Продукты</span>
                    <span className="font-medium text-rose-600 dark:text-rose-400">-12 450 ₽</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300">Фриланс проект</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">+25 000 ₽</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300">Транспорт</span>
                    <span className="font-medium text-rose-600 dark:text-rose-400">-5 790 ₽</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">Доходы</p>
                <p className="mt-1 text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                  110 000 ₽
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">Расходы</p>
                <p className="mt-1 text-lg font-semibold text-rose-600 dark:text-rose-400">
                  68 240 ₽
                </p>
              </div>
            </div>

            <p className="mt-5 text-xs text-slate-500 dark:text-slate-400">
              После регистрации вы получите полный доступ ко всем функциям
            </p>
          </div>
        </section>
      </main>
  );
}