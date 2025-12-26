"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatMoney } from "@/lib/money";
import type { Investment, Wallet } from "@/types/db";

const TYPES = [
  { value: "STOCK", label: "Акции" },
  { value: "ETF", label: "ETF" },
  { value: "CRYPTO", label: "Крипто" },
  { value: "DEPOSIT", label: "Депозит" },
  { value: "OTHER", label: "Другое" },
];

export default function InvestmentsPage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [items, setItems] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  const [walletId, setWalletId] = useState("");
  const [name, setName] = useState("S&P 500 ETF");
  const [type, setType] = useState("ETF");
  const [invested, setInvested] = useState("1000");
  const [current, setCurrent] = useState("1085");
  const [startedAt, setStartedAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [err, setErr] = useState<string | null>(null);

  async function loadAll() {
    setLoading(true);
    const [w, inv] = await Promise.all([
      fetch("/api/wallets").then((r) => r.json()),
      fetch("/api/investments").then((r) => r.json()),
    ]);
    setWallets(w);
    setItems(inv);
    setWalletId(w?.[0]?.id ?? "");
    setLoading(false);
  }

  useEffect(() => { loadAll(); }, []);

  const summary = useMemo(() => {
    const investedC = items.reduce((a, x) => a + x.amount_invested_cents, 0);
    const currentC = items.reduce((a, x) => a + x.current_value_cents, 0);
    const roi = investedC > 0 ? (currentC - investedC) / investedC : 0;
    return { investedC, currentC, roi };
  }, [items]);

  async function addInvestment() {
    setErr(null);
    try {
      if (!walletId) throw new Error("Выбери кошелёк");
      const investedC = Math.round(Number(invested) * 100);
      const currentC = Math.round(Number(current) * 100);
      if (investedC <= 0 || currentC <= 0) throw new Error("Суммы должны быть > 0");

      const res = await fetch("/api/investments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          wallet_id: walletId,
          name,
          type,
          amount_invested_cents: investedC,
          current_value_cents: currentC,
          started_at: new Date(startedAt).toISOString(),
        }),
      });
      if (!res.ok) throw new Error((await res.json())?.error ?? "Ошибка создания");
      await loadAll();
    } catch (e: any) {
      setErr(e?.message ?? "Ошибка");
    }
  }

  async function removeInvestment(id: string) {
    const res = await fetch(`/api/investments/${id}`, { method: "DELETE" });
    if (res.ok) await loadAll();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Инвестиции</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Учет портфеля + ROI.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <h2 className="text-sm font-medium">Добавить актив</h2>

          <div className="mt-4 space-y-3">
            <Select
              label="Кошелёк"
              value={walletId}
              onChange={setWalletId}
              options={wallets.map((w) => ({ value: w.id, label: `${w.name} (${w.currency})` }))}
            />
            <Input label="Название" value={name} onChange={(e) => setName(e.target.value)} />
            <Select label="Тип" value={type} onChange={setType} options={TYPES} />
            <Input label="Вложено" value={invested} onChange={(e) => setInvested(e.target.value)} />
            <Input label="Текущая стоимость" value={current} onChange={(e) => setCurrent(e.target.value)} />
            <Input label="Дата начала" type="date" value={startedAt} onChange={(e) => setStartedAt(e.target.value)} />

            {err ? (
              <p className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
                {err}
              </p>
            ) : null}

            <Button className="w-full" onClick={addInvestment}>Добавить</Button>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
              <p className="text-xs text-slate-500 dark:text-slate-400">Вложено</p>
              <p className="mt-2 text-lg font-semibold">{formatMoney(summary.investedC, "EUR")}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
              <p className="text-xs text-slate-500 dark:text-slate-400">Текущая стоимость</p>
              <p className="mt-2 text-lg font-semibold">{formatMoney(summary.currentC, "EUR")}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
              <p className="text-xs text-slate-500 dark:text-slate-400">ROI</p>
              <p className="mt-2 text-lg font-semibold">{(summary.roi * 100).toFixed(2)}%</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-sm font-medium">Портфель</p>

            {loading ? (
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Загрузка...</p>
            ) : items.length === 0 ? (
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Пока нет активов.</p>
            ) : (
              <div className="mt-4 divide-y divide-slate-200 dark:divide-slate-800">
                {items.map((x) => {
                  const roi = x.amount_invested_cents > 0 ? (x.current_value_cents - x.amount_invested_cents) / x.amount_invested_cents : 0;
                  return (
                    <div key={x.id} className="flex items-center justify-between py-3 text-sm">
                      <div>
                        <p className="font-medium">{x.name} <span className="text-xs text-slate-500 dark:text-slate-400">• {x.type}</span></p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Старт: {new Date(x.started_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={roi >= 0 ? "font-semibold text-emerald-600 dark:text-emerald-400" : "font-semibold text-rose-600 dark:text-rose-400"}>
                          {(roi * 100).toFixed(2)}%
                        </span>
                        <Button variant="ghost" onClick={() => removeInvestment(x.id)}>Удалить</Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
