import { cookies } from "next/headers";
import { createServerSupabase } from "@/lib/supabase/server";
import { ok, bad } from "@/app/api/_utils";

export async function GET() {
  const supabase = createServerSupabase(cookies());
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return bad("Unauthorized", 401);

  const { data, error } = await supabase
    .from("investments")
    .select("id,wallet_id,name,type,amount_invested_cents,current_value_cents,started_at,created_at")
    .order("created_at", { ascending: false });

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
  const name = String(body?.name ?? "").trim();
  const type = String(body?.type ?? "OTHER").trim();
  const amount_invested_cents = Number(body?.amount_invested_cents ?? 0);
  const current_value_cents = Number(body?.current_value_cents ?? 0);
  const started_at = body?.started_at ? new Date(body.started_at).toISOString() : new Date().toISOString();

  if (!wallet_id || !name) return bad("wallet_id and name required");
  if (amount_invested_cents <= 0 || current_value_cents <= 0) return bad("amounts must be > 0");

  const { data, error } = await supabase
    .from("investments")
    .insert({
      user_id: user.id,
      wallet_id,
      name,
      type,
      amount_invested_cents,
      current_value_cents,
      started_at,
    })
    .select("id")
    .single();

  if (error) return bad(error.message, 400);
  return ok({ id: data?.id });
}
