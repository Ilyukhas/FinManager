import { cookies } from "next/headers";
import { createServerSupabase } from "@/lib/supabase/server";
import { ok, bad } from "@/app/api/_utils";

export async function POST() {
  const supabase = createServerSupabase(cookies());
  const { data: u } = await supabase.auth.getUser();
  const user = u.user;
  if (!user) return bad("Unauthorized", 401);

  // wallet
  const { data: existingWallets } = await supabase.from("wallets").select("id").limit(1);
  if (!existingWallets || existingWallets.length === 0) {
    await supabase.from("wallets").insert({ user_id: user.id, name: "Основной", currency: "EUR", balance_cents: 0 });
  }

  // categories
  const { data: existingCats } = await supabase.from("categories").select("id").limit(1);
  if (!existingCats || existingCats.length === 0) {
    const base = [
      { name: "Зарплата", type: "INCOME" },
      { name: "Фриланс", type: "INCOME" },
      { name: "Продукты", type: "EXPENSE" },
      { name: "Транспорт", type: "EXPENSE" },
      { name: "Кафе", type: "EXPENSE" },
      { name: "Инвестиции", type: "EXPENSE" },
    ].map((x) => ({ ...x, user_id: user.id }));
    await supabase.from("categories").insert(base);
  }

  return ok({ ok: true });
}
