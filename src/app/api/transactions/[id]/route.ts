import { cookies } from "next/headers";
import { createServerSupabase } from "@/lib/supabase/server";
import { ok, bad } from "@/app/api/_utils";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  // ДОБАВЬ ЭТУ СТРОЧКУ:
  const { id } = await params;

  const supabase = await createServerSupabase();
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return bad("Unauthorized", 401);

  // Используй переменную id вместо params.id
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) return bad(error.message, 400);
  return ok({ ok: true });
}