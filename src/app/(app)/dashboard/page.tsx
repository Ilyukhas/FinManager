import { MetricCard } from "@/components/ui/metric-card";
import { OverviewCharts } from "@/components/charts/overview-charts";
import { apiGet } from "@/lib/http/api";
import {getOverview} from "@/app/api/analytics/overview/route";

export default async function DashboardPage() {
  const data = await getOverview();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Дашборд</h1>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <MetricCard title="Баланс" value={data.balanceLabel} hint={data.balanceHint} />
        <MetricCard title="Доходы (30 дней)" value={data.income30Label} hint="Сумма по операциям" />
        <MetricCard title="Расходы (30 дней)" value={data.expense30Label} hint="Сумма по операциям" />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
          <p className="text-sm font-medium">Доходы/расходы по месяцам</p>
          <div className="mt-4">
            <OverviewCharts data={data.monthlySeries} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
          <p className="text-sm font-medium">Инвестиции</p>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-300">Текущая стоимость</span>
              <span className="font-semibold">{data.investCurrentLabel}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-300">Вложено</span>
              <span className="font-semibold">{data.investInvestedLabel}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-300">ROI</span>
              <span className="font-semibold">{data.investRoiLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
