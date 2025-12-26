import { cookies } from "next/headers";
import { createServerSupabase } from "@/lib/supabase/server";
import { ok, bad } from "@/app/api/_utils";

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return bad("Unauthorized", 401);

  const { data, error } = await supabase
    .from("wallets")
    .select("id,name,currency,balance_cents,created_at")
    .order("created_at", { ascending: true });

  if (error) return bad(error.message, 400);
  return ok(data ?? []);
}

export async function POST(req: Request) {
  const supabase = await createServerSupabase();
  const { data: u } = await supabase.auth.getUser();
  const user = u.user;
  if (!user) return bad("Unauthorized", 401);

  const body = await req.json().catch(() => ({}));
  const name = String(body?.name ?? "").trim();
  const currency = String(body?.currency ?? "RUB").trim().toUpperCase();
  if (!name) return bad("name is required");

  const { data, error } = await supabase
    .from("wallets")
    .insert({ user_id: user.id, name, currency, balance_cents: 0 })
    .select("id,name,currency,balance_cents,created_at")
    .single();

  if (error) return bad(error.message, 400);
  return ok(data);
}
