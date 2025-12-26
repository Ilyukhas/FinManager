import { cookies } from "next/headers";
import { createServerSupabase } from "@/lib/supabase/server";
import { ok, bad } from "@/app/api/_utils";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const supabase = createServerSupabase(cookies());
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return bad("Unauthorized", 401);

  const { error } = await supabase.from("investments").delete().eq("id", params.id);
  if (error) return bad(error.message, 400);
  return ok({ ok: true });
}
