import { cookies } from "next/headers";
import { createServerSupabase } from "@/lib/supabase/server";
import { ok, bad } from "@/app/api/_utils";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;  // ← ДОБАВЬ ЭТУ СТРОЧКУ

  const supabase = await createServerSupabase();
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return bad("Unauthorized", 401);

  const { error } = await supabase.from("investments").delete().eq("id", id);  // ← Используй id, не params.id
  if (error) return bad(error.message, 400);
  return ok({ ok: true });
}