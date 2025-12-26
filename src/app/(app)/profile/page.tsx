"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Wallet, Category } from "@/types/db";

export default function ProfilePage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [walletName, setWalletName] = useState("Основной");
  const [currency, setCurrency] = useState("RUB");

  const [catName, setCatName] = useState("Кофе");
  const [catType, setCatType] = useState<"доходы" | "EXPENSE">("EXPENSE");


  function translateType(type: string): string {
    if (type === "EXPENSE") return "Расход";
    if (type === "INCOME") return "Доход";
    return type;
  }

  async function loadAll() {
    setLoading(true);
    const [w, c] = await Promise.all([
      fetch("/api/wallets").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]);
    setWallets(w);
    setCategories(c);
    setLoading(false);
  }

  useEffect(() => { loadAll(); }, []);

  async function addWallet() {
    await fetch("/api/wallets", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: walletName, currency }),
    });
    await loadAll();
  }

  async function deleteWallet(id: string) {
    await fetch(`/api/wallets/${id}`, { method: "DELETE" });
    await loadAll();
  }

  async function addCategory() {
    await fetch("/api/categories", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: catName, type: catType }),
    });
    await loadAll();
  }

  async function deleteCategory(id: string) {
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    await loadAll();
  }

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Профиль</h1>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <Card>
            <h2 className="text-sm font-medium">Кошельки</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input label="Название" value={walletName} onChange={(e) => setWalletName(e.target.value)} />
              <Input label="Валюта" value={currency} onChange={(e) => setCurrency(e.target.value)} />
            </div>
            <Button className="mt-3" onClick={addWallet}>Добавить кошелёк</Button>

            <div className="mt-4 divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? <p className="py-3 text-sm text-slate-600 dark:text-slate-300">Загрузка...</p> : null}
              {wallets.map((w) => (
                  <div key={w.id} className="flex items-center justify-between py-3 text-sm">
                    <div>
                      <p className="font-medium">{w.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{w.currency}</p>
                    </div>
                    <Button variant="ghost" onClick={() => deleteWallet(w.id)}>Удалить</Button>
                  </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-sm font-medium">Категории</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input label="Название" value={catName} onChange={(e) => setCatName(e.target.value)} />
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Тип</label>
                <select
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500 dark:border-slate-800 dark:bg-slate-950"
                    value={catType}
                    onChange={(e) => setCatType(e.target.value as any)}
                >
                  <option value="EXPENSE">Расход</option>
                  <option value="INCOME">Доход</option>
                </select>
              </div>
            </div>
            <Button className="mt-3" onClick={addCategory}>Добавить категорию</Button>

            <div className="mt-4 divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? <p className="py-3 text-sm text-slate-600 dark:text-slate-300">Загрузка...</p> : null}
              {categories.map((c) => (
                  <div key={c.id} className="flex items-center justify-between py-3 text-sm">
                    <div>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {translateType(c.type)} {/* ← Здесь показываем русское название */}
                      </p>
                    </div>
                    <Button variant="ghost" onClick={() => deleteCategory(c.id)}>Удалить</Button>
                  </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
  );
}