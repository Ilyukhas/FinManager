import { cookies } from "next/headers";
import { createServerSupabase } from "@/lib/supabase/server";
import { ok, bad } from "@/app/api/_utils";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const supabase = await createServerSupabase();
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return bad("Unauthorized", 401);

  // fetch tx to revert wallet
  const { data: tx, error: e1 } = await supabase
    .from("transactions")
    .select("id,wallet_id,type,amount_cents")
    .eq("id", params.id)
    .single();

  if (e1) return bad(e1.message, 400);

  const { error } = await supabase.from("transactions").delete().eq("id", params.id);
  if (error) return bad(error.message, 400);

  const sign = tx.type === "INCOME" ? -1 : 1;
  await supabase.rpc("wallet_apply_delta", { p_wallet_id: tx.wallet_id, p_delta_cents: sign * tx.amount_cents });

  return ok({ ok: true });
}
