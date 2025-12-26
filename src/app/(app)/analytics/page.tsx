import { apiGet } from "@/lib/http/api";
import { OverviewCharts } from "@/components/charts/overview-charts";

export default async function AnalyticsPage() {
  const data = await apiGet("/api/analytics/overview");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Аналитика</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Графики по месяцам + ключевые метрики.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
        <p className="text-sm font-medium">Доходы и расходы</p>
        <div className="mt-4">
          <OverviewCharts data={data.monthlySeries} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
          <p className="text-xs text-slate-500 dark:text-slate-400">Баланс</p>
          <p className="mt-2 text-lg font-semibold">{data.balanceLabel}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{data.balanceHint}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
          <p className="text-xs text-slate-500 dark:text-slate-400">Инвестиции</p>
          <p className="mt-2 text-lg font-semibold">{data.investCurrentLabel}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">ROI: {data.investRoiLabel}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
          <p className="text-xs text-slate-500 dark:text-slate-400">Сальдо 30 дней</p>
          <p className="mt-2 text-lg font-semibold">{data.net30Label}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Доходы минус расходы</p>
        </div>
      </div>
    </div>
  );
}
