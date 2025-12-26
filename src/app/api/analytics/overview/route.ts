import { cookies } from "next/headers";
import { createServerSupabase } from "@/lib/supabase/server";
import { ok, bad } from "@/app/api/_utils";
import { formatMoney } from "@/lib/money";

function monthKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export async function GET() {
  const supabase = createServerSupabase(cookies());
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return bad("Unauthorized", 401);

  const { data: wallets } = await supabase.from("wallets").select("balance_cents,currency");
  const balance = (wallets ?? []).reduce((a, w) => a + (w.balance_cents ?? 0), 0);

  const since = new Date();
  since.setDate(since.getDate() - 30);

  const { data: txs } = await supabase
    .from("transactions")
    .select("type,amount_cents,date")
    .gte("date", since.toISOString());

  const income30 = (txs ?? []).filter((t) => t.type === "INCOME").reduce((a, t) => a + t.amount_cents, 0);
  const expense30 = (txs ?? []).filter((t) => t.type === "EXPENSE").reduce((a, t) => a + t.amount_cents, 0);
  const net30 = income30 - expense30;

  // monthly series (last 6 months)
  const start = new Date();
  start.setMonth(start.getMonth() - 5);
  start.setDate(1);

  const { data: allTx } = await supabase
    .from("transactions")
    .select("type,amount_cents,date")
    .gte("date", start.toISOString());

  const bucket: Record<string, { income: number; expense: number }> = {};
  for (let i = 0; i < 6; i++) {
    const d = new Date(start);
    d.setMonth(start.getMonth() + i);
    bucket[monthKey(d)] = { income: 0, expense: 0 };
  }

  for (const t of allTx ?? []) {
    const key = monthKey(new Date(t.date));
    if (!bucket[key]) continue;
    if (t.type === "INCOME") bucket[key].income += t.amount_cents;
    else bucket[key].expense += t.amount_cents;
  }

  const monthlySeries = Object.entries(bucket).map(([month, v]) => ({
    month,
    income: Math.round(v.income / 100),
    expense: Math.round(v.expense / 100),
  }));

  const { data: inv } = await supabase
    .from("investments")
    .select("amount_invested_cents,current_value_cents");

  const invested = (inv ?? []).reduce((a, x) => a + x.amount_invested_cents, 0);
  const current = (inv ?? []).reduce((a, x) => a + x.current_value_cents, 0);
  const roi = invested > 0 ? (current - invested) / invested : 0;

  return ok({
    balanceLabel: formatMoney(balance, "EUR"),
    balanceHint: "Сумма балансов по кошелькам",
    income30Label: formatMoney(income30, "EUR"),
    expense30Label: formatMoney(expense30, "EUR"),
    net30Label: formatMoney(net30, "EUR"),
    monthlySeries,
    investInvestedLabel: formatMoney(invested, "EUR"),
    investCurrentLabel: formatMoney(current, "EUR"),
    investRoiLabel: `${(roi * 100).toFixed(2)}%`,
  });
}
