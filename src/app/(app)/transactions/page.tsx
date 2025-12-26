"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatMoney } from "@/lib/money";
import type { Category, Wallet, Transaction } from "@/types/db";

export default function TransactionsPage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [walletId, setWalletId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("0");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [err, setErr] = useState<string | null>(null);

  const filteredCategories = useMemo(
    () => categories.filter((c) => c.type === type),
    [categories, type]
  );

  async function loadAll() {
    setLoading(true);
    const [w, c, t] = await Promise.all([
      fetch("/api/wallets").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/transactions").then((r) => r.json()),
    ]);
    setWallets(w);
    setCategories(c);
    setItems(t);
    setWalletId(w?.[0]?.id ?? "");
    setCategoryId(c?.find((x: Category) => x.type === type)?.id ?? "");
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    const first = filteredCategories[0]?.id ?? "";
    if (first) setCategoryId(first);
  }, [type, filteredCategories]);

  async function addTx() {
    setErr(null);
    try {
      const amountCents = Math.round(Number(amount) * 100);
      if (!walletId || !categoryId) throw new Error("Выбери кошелёк и категорию");
      if (!Number.isFinite(amountCents) || amountCents <= 0) throw new Error("Сумма должна быть > 0");

      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          wallet_id: walletId,
          category_id: categoryId,
          type,
          amount_cents: amountCents,
          note: note || null,
          date: new Date(date).toISOString(),
        }),
      });
      if (!res.ok) throw new Error((await res.json())?.error ?? "Ошибка создания");
      setAmount("0");
      setNote("");
      await loadAll();
    } catch (e: any) {
      setErr(e?.message ?? "Ошибка");
    }
  }

  async function removeTx(id: string) {
    const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    if (res.ok) await loadAll();
  }

  const total = items.reduce((acc, t) => acc + (t.type === "INCOME" ? t.amount_cents : -t.amount_cents), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Доходы и расходы</h1>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <h2 className="text-sm font-medium">Новая операция</h2>

          <div className="mt-4 space-y-3">
            <Select label="Тип" value={type} onChange={(v) => setType(v as any)} options={[
              { value: "EXPENSE", label: "Расход" },
              { value: "INCOME", label: "Доход" },
            ]} />

            <Select
              label="Кошелёк"
              value={walletId}
              onChange={setWalletId}
              options={wallets.map((w) => ({ value: w.id, label: `${w.name} (${w.currency})` }))}
            />

            <Select
              label="Категория"
              value={categoryId}
              onChange={setCategoryId}
              options={filteredCategories.map((c) => ({ value: c.id, label: c.name }))}
            />

            <Input label="Сумма" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="100.00" />
            <Input label="Дата" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <Input label="Заметка" value={note} onChange={(e) => setNote(e.target.value)} placeholder="например, кофе" />

            {err ? (
              <p className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
                {err}
              </p>
            ) : null}

            <Button className="w-full" onClick={addTx}>Добавить</Button>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Итого</p>
              <p className="text-sm font-semibold">{formatMoney(total, "EUR")}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-sm font-medium">Последние операции</p>

            {loading ? (
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Загрузка...</p>
            ) : items.length === 0 ? (
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Пока нет операций.</p>
            ) : (
              <div className="mt-4 divide-y divide-slate-200 dark:divide-slate-800">
                {items.map((t) => (
                  <div key={t.id} className="flex items-center justify-between py-3 text-sm">
                    <div>
                      <p className="font-medium">{t.type === "INCOME" ? "Доход" : "Расход"} • {t.category_name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(t.date).toLocaleDateString()} {t.note ? `• ${t.note}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={t.type === "INCOME" ? "font-semibold text-emerald-600 dark:text-emerald-400" : "font-semibold text-rose-600 dark:text-rose-400"}>
                        {t.type === "INCOME" ? "+" : "-"}{formatMoney(t.amount_cents, "EUR")}
                      </span>
                      <Button variant="ghost" onClick={() => removeTx(t.id)}>Удалить</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
