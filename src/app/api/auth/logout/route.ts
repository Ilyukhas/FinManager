import { cookies } from "next/headers";
import { createServerSupabase } from "@/lib/supabase/server";
import { ok } from "@/app/api/_utils";

export async function POST() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  return ok({ ok: true });
}
