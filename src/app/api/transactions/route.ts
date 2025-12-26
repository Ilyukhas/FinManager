import { cookies } from "next/headers";
import { createServerSupabase } from "@/lib/supabase/server";
import { ok, bad } from "@/app/api/_utils";

export async function GET() {
  const supabase = createServerSupabase(cookies());
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return bad("Unauthorized", 401);

  const { data, error } = await supabase
    .from("transactions_view")
    .select("*")
    .order("date", { ascending: false })
    .limit(50);

  if (error) return bad(error.message, 400);
  return ok(data ?? []);
}

export async function POST(req: Request) {
  const supabase = createServerSupabase(cookies());
  const { data: u } = await supabase.auth.getUser();
  const user = u.user;
  if (!user) return bad("Unauthorized", 401);

  const body = await req.json().catch(() => ({}));
  const wallet_id = String(body?.wallet_id ?? "");
  const category_id = String(body?.category_id ?? "");
  const type = body?.type === "INCOME" ? "INCOME" : "EXPENSE";
  const amount_cents = Number(body?.amount_cents ?? 0);
  const note = body?.note ? String(body.note) : null;
  const date = body?.date ? new Date(body.date).toISOString() : new Date().toISOString();

  if (!wallet_id || !category_id) return bad("wallet_id and category_id required");
  if (!Number.isFinite(amount_cents) || amount_cents <= 0) return bad("amount_cents must be > 0");

  // insert transaction
  const { data, error } = await supabase
    .from("transactions")
    .insert({
      user_id: user.id,
      wallet_id,
      category_id,
      type,
      amount_cents,
      note,
      date,
    })
    .select("id")
    .single();

  if (error) return bad(error.message, 400);

  // update wallet balance (simple)
  const sign = type === "INCOME" ? 1 : -1;
  await supabase.rpc("wallet_apply_delta", { p_wallet_id: wallet_id, p_delta_cents: sign * amount_cents });

  return ok({ id: data?.id });
}
